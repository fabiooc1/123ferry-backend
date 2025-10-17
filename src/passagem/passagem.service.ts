import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePassagemDto } from './dtos/create-passagem.dto';
import { TipoPassageiroService } from 'src/tipo-passageiro/tipo-passageiro.service';
import { PassageiroDto } from './dtos/passageiro.schema';
import { ViagemService } from 'src/viagem/viagem.service';
import { VeiculoService } from 'src/veiculo/veiculo.service';
import { PassagemVeiculoDto } from './dtos/passagem-veiculo.schema';

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
      await this.viagemService.isAvaliableShellPassagem(
        createPassagemDto.viagemId,
        createPassagemDto.passageiros.length,
      )
    ) {
      throw new HttpException(
        'Infelizmente essa viagem já atingiu o número máximo de passageiros.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const passageirosPromises = createPassagemDto.passageiros.map(
      (passageiro) => this.passageiroValidations(passageiro),
    );

    const veiculosPromises = createPassagemDto.veiculos.map((veiculo) =>
      this.veiculoValidations(veiculo),
    );

    await Promise.all([...passageirosPromises, ...veiculosPromises]);
  }

  private async passageiroValidations(
    passageiro: PassageiroDto,
  ): Promise<void> {
    if (await this.tipoPassageiroService.existById(passageiro.tipoId)) {
      throw new HttpException(
        `Tipo de passageiro não encontrado para ${passageiro.nomeCompleto}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  private async veiculoValidations(veiculo: PassagemVeiculoDto): Promise<void> {
    if (await this.veiculoService.existById(veiculo.veiculoId)) {
      throw new HttpException(
        `Tipo de veículo não encontrado para ${veiculo.placa}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
