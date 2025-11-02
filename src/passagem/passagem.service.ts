import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePassagemDto } from './dtos/create-passagem.dto';
import { TipoPassageiroService } from 'src/tipo-passageiro/tipo-passageiro.service';
import { PassageiroDto } from './dtos/passageiro.schema';
import { ViagemService } from 'src/viagem/viagem.service';
import { VeiculoService } from 'src/veiculo/veiculo.service';
import { PassagemVeiculoDto } from './dtos/passagem-veiculo.schema';
import { randomUUID } from 'node:crypto';
import { UsuarioService } from 'src/usuario/usuario.service';

@Injectable()
export class PassagemService {
  constructor(
    private prisma: PrismaService,
    private tipoPassageiroService: TipoPassageiroService,
    private viagemService: ViagemService,
    private veiculoService: VeiculoService,
    private usuarioService: UsuarioService,
  ) {}

  async create(userId: number, createPassagemDto: CreatePassagemDto) {
    const viagem = await this.viagemService.existById(
      createPassagemDto.viagemId,
    );

    if (!viagem) {
      throw new HttpException('Viagem não encontrada.', HttpStatus.NOT_FOUND);
    }

    if (
      !(await this.viagemService.isAvaliableShellPassagem(
        createPassagemDto.viagemId,
        createPassagemDto.passageiros.length,
      ))
    ) {
      throw new HttpException(
        'Infelizmente essa viagem já atingiu o número máximo de passageiros.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // if (createPassagemDto.veiculos.length > 0) {
    //   if (
    //     !(await this.viagemService.isAvaliableShellVeiculoPassagem(
    //       createPassagemDto.viagemId,
    //       createPassagemDto.veiculos,
    //     ))
    //   ) {
    //     throw new HttpException(
    //       'Espaço insuficiente para os veículos na balsa.',
    //       HttpStatus.BAD_REQUEST,
    //     );
    //   }
    // }

    const passageirosPromises = createPassagemDto.passageiros.map(
      (passageiro) => this.passageiroValidations(passageiro),
    );

    const veiculosPromises = createPassagemDto.veiculos.map((veiculo) =>
      this.veiculoValidations(veiculo),
    );

    await Promise.all([...passageirosPromises, ...veiculosPromises]);

    try {
      const passagemFinal = await this.prisma.$transaction(async (prisma) => {
        const randomCode = this.generateUniquePassagemCode();

        const passagem = await prisma.passagem.create({
          data: {
            viagemId: createPassagemDto.viagemId,
            codigo: randomCode,
            adquiridaPorId: userId,
          },
          select: {
            id: true,
          },
        });
        const newPassagemId = passagem.id;

        const cpfToPassageiroIdMap = new Map<string, number>();

        for (const passageiroDto of createPassagemDto.passageiros) {
          const novoPassageiro = await prisma.passagemPassageiro.create({
            data: {
              ...passageiroDto,
              passagemId: newPassagemId,
            },
            select: {
              id: true,
              cpf: true,
            },
          });

          cpfToPassageiroIdMap.set(novoPassageiro.cpf, novoPassageiro.id);
        }

        if (createPassagemDto.veiculos.length > 0) {
          const veiculosData = createPassagemDto.veiculos.map((veiculoDto) => {
            const passageiroId = cpfToPassageiroIdMap.get(
              veiculoDto.motoristaCpf,
            );

            if (!passageiroId) {
              throw new HttpException(
                `Motorista com CPF ${veiculoDto.motoristaCpf} não encontrado na lista de passageiros.`,
                HttpStatus.BAD_REQUEST,
              );
            }

            return {
              placa: veiculoDto.placa,
              veiculoId: veiculoDto.veiculoId,
              passagemId: newPassagemId,
              passageiroId: passageiroId,
            };
          });

          await prisma.passagemVeiculo.createMany({ data: veiculosData });
        }

        return await prisma.passagem.findUniqueOrThrow({
          where: { id: newPassagemId },
          include: {
            passageiros: true,
            veiculos: true,
          },
        });
      });

      return passagemFinal;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Não foi possível realizar a reserva dessa passagem. Tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByCode(userId: number, codigo: string) {
    const isAdmin = await this.usuarioService.isAdmin(userId);

    const whereClause: { codigo: string; adquiridaPorId?: number } = {
      codigo,
    };

    if (!isAdmin) {
      whereClause.adquiridaPorId = userId;
    }

    try {
      return await this.prisma.passagem.findUniqueOrThrow({
        where: whereClause,
        include: {
          veiculos: true,
          passageiros: true,
          viagem: true,
        },
      });
    } catch {
      throw new HttpException('Passagem não encontrada', HttpStatus.NOT_FOUND);
    }
  }

  async updatePaymentStatus(administradorId: number, passagemId: number) {
    const passagemData = await this.prisma.passagem.findUniqueOrThrow({
      where: { id: passagemId },
      select: {
        status: true,
        pagaEm: true,
        passageiros: {
          select: { id: true, tipoId: true },
        },
        veiculos: {
          select: { id: true, veiculoId: true },
        },
      },
    });

    if (passagemData.status === 'PAGA' || passagemData.pagaEm) {
      throw new HttpException(
        'Essa passagem já foi paga',
        HttpStatus.BAD_REQUEST,
      );
    }

    const tipoIds = passagemData.passageiros.map((p) => p.tipoId);
    const veiculoIds = passagemData.veiculos.map((v) => v.veiculoId);

    const [tiposPassageiro, veiculos] = await Promise.all([
      this.prisma.tipoPassageiro.findMany({
        where: { id: { in: tipoIds } },
        select: { id: true, precoEmCentavos: true },
      }),
      this.prisma.veiculo.findMany({
        where: { id: { in: veiculoIds } },
        select: { id: true, precoPassagemEmCentavos: true },
      }),
    ]);

    const passageiroPriceMap = new Map(
      tiposPassageiro.map((tp) => [tp.id, tp.precoEmCentavos]),
    );
    const veiculoPriceMap = new Map(
      veiculos.map((v) => [v.id, v.precoPassagemEmCentavos]),
    );

    return await this.prisma.$transaction(async (prisma) => {
      const dataAtualUTC = new Date();

      const passageiroUpdates = passagemData.passageiros.map((p) => {
        const precoAuditado = passageiroPriceMap.get(p.tipoId);

        if (precoAuditado === undefined) {
          throw new Error(
            `Preço não encontrado para TipoPassageiro ID: ${p.tipoId}`,
          );
        }

        return prisma.passagemPassageiro.update({
          where: { id: p.id },
          data: { precoPagoEmCentavos: precoAuditado },
        });
      });

      const veiculoUpdates = passagemData.veiculos.map((v) => {
        const precoAuditado = veiculoPriceMap.get(v.veiculoId);

        if (precoAuditado === undefined) {
          throw new Error(
            `Preço não encontrado para Veiculo ID: ${v.veiculoId}`,
          );
        }

        return prisma.passagemVeiculo.update({
          where: { id: v.id },
          data: { precoPagoEmCentavos: precoAuditado },
        });
      });

      await Promise.all([...passageiroUpdates, ...veiculoUpdates]);

      return prisma.passagem.update({
        where: { id: passagemId },
        data: {
          status: 'PAGA',
          pagaEm: dataAtualUTC,
          auditadaPorId: administradorId,
        },
        include: {
          passageiros: true,
          veiculos: true,
        },
      });
    });
  }

  async cancel(userId: number, passagemId: number) {
    const isAdministrador = await this.usuarioService.isAdmin(userId);

    const whereClause: { id: number; adquiridaPorId?: number } = {
      id: passagemId,
    };

    if (!isAdministrador) {
      whereClause.adquiridaPorId = userId;
    }

    const passagem = await this.prisma.passagem.findUnique({
      where: whereClause,
      select: {
        status: true,
        canceladaEm: true,
        adquiridaPorId: true,
        viagemId: true,
      },
    });

    if (!passagem) {
      throw new HttpException('Passagem não encontrada.', HttpStatus.NOT_FOUND);
    }

    if (passagem.status === 'CANCELADA' || passagem.canceladaEm) {
      throw new HttpException(
        'Essa passagem já foi cancelada.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.passagem.update({
      where: { id: passagemId },
      data: {
        status: 'CANCELADA',
        canceladaEm: new Date(),
        auditadaPorId: userId,
      },
    });
  }

  async getAll(userId: number, pageSize: number, page: number) {
    const skip = (page - 1) * pageSize;
    const [pageData, total] = await Promise.all([
      this.prisma.passagem.findMany({
        take: pageSize,
        skip: skip,
        where: {
          adquiridaPorId: userId,
        },
        orderBy: {
          reservadaEm: 'asc',
        },
      }),
      this.prisma.passagem.count({
        where: {
          adquiridaPorId: userId,
        },
      }),
    ]);

    return {
      data: pageData,
      meta: {
        totalItens: total,
        paginaAtual: page,
        tamanhoPagina: pageSize,
        totalPaginas: Math.ceil(total / pageSize),
      },
    };
  }

  private async passageiroValidations(
    passageiro: PassageiroDto,
  ): Promise<void> {
    if (!(await this.tipoPassageiroService.existById(passageiro.tipoId))) {
      throw new HttpException(
        `Tipo de passageiro não encontrado para ${passageiro.nomeCompleto}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async veiculoValidations(veiculo: PassagemVeiculoDto): Promise<void> {
    if (!(await this.veiculoService.existById(veiculo.veiculoId))) {
      throw new HttpException(
        `Tipo de veículo não encontrado para ${veiculo.placa}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private generateUniquePassagemCode(): string {
    return randomUUID();
  }
}
