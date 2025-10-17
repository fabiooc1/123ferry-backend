import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePassagemDto } from './dtos/create-passagem.dto';
import { TipoPassageiroService } from 'src/tipo-passageiro/tipo-passageiro.service';
import { PassageiroDto } from './dtos/passageiro.schema';
import { ViagemService } from 'src/viagem/viagem.service';
import { VeiculoService } from 'src/veiculo/veiculo.service';
import { PassagemVeiculoDto } from './dtos/passagem-veiculo.schema';
import { randomUUID } from 'node:crypto';

@Injectable()
export class PassagemService {
  constructor(
    private prisma: PrismaService,
    private tipoPassageiroService: TipoPassageiroService,
    private viagemService: ViagemService,
    private veiculoService: VeiculoService,
  ) {}

  async create(userId: bigint, createPassagemDto: CreatePassagemDto) {
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

        const passageirosData = createPassagemDto.passageiros.map(
          (passageiroDto) => ({
            nomeCompleto: passageiroDto.nomeCompleto,
            cpf: passageiroDto.cpf,
            dataNascimento: passageiroDto.dataNascimento,
            passagemId: newPassagemId,
            tipoId: passageiroDto.tipoId,
          }),
        );
        await prisma.passagemPassageiro.createMany({ data: passageirosData });

        if (createPassagemDto.veiculos.length > 0) {
          const veiculosData = createPassagemDto.veiculos.map((veiculoDto) => ({
            placa: veiculoDto.placa,
            veiculoId: veiculoDto.veiculoId,
            passagemId: newPassagemId,
          }));
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
    } catch {
      throw new HttpException(
        'Não foi possível realizar a reserva dessa passagem. Tente novamente mais tarde',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
