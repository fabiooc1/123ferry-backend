import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from 'src/database/prisma.service';
import { TipoPassageiroService } from 'src/tipo-passageiro/tipo-passageiro.service';
import { UsuarioService } from 'src/usuario/usuario.service';
import { VeiculoCategoriaService } from 'src/veiculo-categoria/veiculo-categoria.service';
import { ViagemService } from 'src/viagem/viagem.service';
import { CreatePassagemDto } from './dtos/create-passagem.dto';
import { PassageiroDto } from './dtos/passageiro.schema';
import { PassagemVeiculoDto } from './dtos/passagem-veiculo.schema';
import { Prisma } from 'src/generated/prisma';
import { PaginatePassagemDto } from './dtos/paginate-passagem.dto';

@Injectable()
export class PassagemService {
  constructor(
    private prisma: PrismaService,
    private tipoPassageiroService: TipoPassageiroService,
    private viagemService: ViagemService,
    private veiculoCategoriaService: VeiculoCategoriaService,
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
              veiculoCategoriaId: veiculoDto.veiculoCategoriaId,
              passagemId: newPassagemId,
              motoristaId: passageiroId,
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

  async findByCode(codigo: string, userId?: number) {
    const whereClause: { codigo: string; adquiridaPorId?: number } = {
      codigo,
    };

    if (userId) {
      whereClause.adquiridaPorId = userId;
    }

    try {
      return await this.prisma.passagem.findUniqueOrThrow({
        where: whereClause,
        include: {
          veiculos: {
            include: {
              veiculoCategoria: true,
            },
          },
          passageiros: {
            include: {
              tipo: true,
            },
          },
          viagem: {
            include: {
              ferry: true,
              rota: {
                include: {
                  origem: true,
                  destino: true,
                },
              },
            },
          },
        },
      });
    } catch {
      throw new HttpException('Passagem não encontrada', HttpStatus.NOT_FOUND);
    }
  }

  async updatePaymentStatus(administradorId: number, passagemId: number) {
    const passagem = await this.prisma.passagem.findUniqueOrThrow({
      where: { id: passagemId },
      select: {
        status: true,
        pagaEm: true,
        passageiros: {
          select: {
            id: true,
            tipo: {
              select: { precoEmCentavos: true },
            },
          },
        },
        veiculos: {
          select: {
            id: true,
            veiculoCategoria: {
              select: { precoPassagemEmCentavos: true },
            },
          },
        },
      },
    });

    if (passagem.status === 'PAGA' || passagem.pagaEm) {
      throw new HttpException(
        'Essa passagem já foi paga',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.$transaction(async (prisma) => {
      const dataAtualUTC = new Date();

      const passageiroUpdates = passagem.passageiros.map((p) => {
        const precoAuditado = p.tipo.precoEmCentavos;

        return prisma.passagemPassageiro.update({
          where: { id: p.id },
          data: { precoPagoEmCentavos: precoAuditado },
        });
      });

      const veiculoUpdates = passagem.veiculos.map((v) => {
        const precoAuditado = v.veiculoCategoria.precoPassagemEmCentavos;

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

  async getAll(dto: PaginatePassagemDto, userId?: number) {
    const { page, pageSize, status, passageiroNome } = dto;

    const skip = (page - 1) * pageSize;

    const where: Prisma.PassagemWhereInput = {};

    if (userId) {
      where.adquiridaPorId = userId;
    }

    if (status) {
      where.status = status;
    }

    if (passageiroNome) {
      where.passageiros = {
        some: {
          nomeCompleto: {
            contains: passageiroNome,
            mode: 'insensitive',
          },
        },
      };
    }

    const [pageData, total] = await Promise.all([
      this.prisma.passagem.findMany({
        take: pageSize,
        skip: skip,
        where: where,
        include: {
          adquiridaPor: {
            select: {
              nomeCompleto: true,
            },
          },
          viagem: {
            select: {
              rota: {
                include: {
                  origem: true,
                  destino: true,
                },
              },
              dataPartida: true,
              dataChegada: true,
            },
          },
          _count: {
            select: { passageiros: true, veiculos: true },
          },
        },
        orderBy: {
          reservadaEm: 'asc',
        },
      }),
      this.prisma.passagem.count({
        where: where,
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
    if (
      !(await this.veiculoCategoriaService.existById(
        veiculo.veiculoCategoriaId,
      ))
    ) {
      throw new HttpException(
        `Tipo de veículo não encontrado para ${veiculo.placa}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private generateUniquePassagemCode(): string {
    const bytes = 4;
    const randomHex = randomBytes(bytes).toString('hex').toUpperCase();

    const part1 = randomHex.substring(0, 4);
    const part2 = randomHex.substring(4, 8);

    return `${part1}-${part2}`;
  }
}
