import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/database/prisma.service';
import { FerryService } from 'src/ferry/ferry.service';
import { RotaService } from 'src/rota/rota.service';
import { CreateViagemDto } from './dtos/create-viagem.dto';
import { PaginationViagemDto } from './dtos/pagination-viagem.dto';
import { UpdateViagemDto } from './dtos/update-viagem.dto';

@Injectable()
export class ViagemService {
  constructor(
    private prisma: PrismaService,
    private ferryService: FerryService,
    private rotaService: RotaService,
  ) {}

  async create(userId: number, createViagemDto: CreateViagemDto) {
    const ferry = await this.ferryService.existById(createViagemDto.ferryId);

    if (!ferry) {
      throw new HttpException('Ferry não encontrado.', HttpStatus.NOT_FOUND);
    }

    const rota = await this.rotaService.existById(createViagemDto.rotaId);

    if (!rota) {
      throw new HttpException('Rota não encontrado.', HttpStatus.NOT_FOUND);
    }

    if (createViagemDto.dataChegada < createViagemDto.dataPartida) {
      throw new HttpException(
        'A data chegada deve ser maior que a de partida',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.viagem.create({
      data: {
        ...createViagemDto,
        criadaPorId: userId,
      },
    });
  }

  async findById(viagemId: number) {
    const viagem = await this.prisma.viagem.findUnique({
      where: {
        id: viagemId,
      },
      include: {
        ferry: true,
        rota: {
          include: {
            origem: true,
            destino: true,
          },
        },
      },
    });

    if (!viagem) {
      throw new HttpException('Viagem não encontrada.', HttpStatus.NOT_FOUND);
    }

    return viagem;
  }

  async update(viagemId: number, updateViagemDto: UpdateViagemDto) {
    if (Object.keys(updateViagemDto).length === 0) {
      throw new HttpException(
        'Nenhum dado de atualização fornecido',
        HttpStatus.BAD_REQUEST,
      );
    }

    const viagem = await this.findById(viagemId);

    if (updateViagemDto.ferryId) {
      if (updateViagemDto.ferryId === viagem.ferryId) {
        throw new HttpException(
          'Informe um ferry diferente do atual',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!(await this.ferryService.existById(updateViagemDto.ferryId))) {
        throw new HttpException('Ferry não encontrado', HttpStatus.NOT_FOUND);
      }
    }

    if (updateViagemDto.rotaId) {
      if (updateViagemDto.rotaId === viagem.rotaId) {
        throw new HttpException(
          'Informe uma rota diferente da atual',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!(await this.rotaService.existById(updateViagemDto.rotaId))) {
        throw new HttpException('Rota não encontrada', HttpStatus.NOT_FOUND);
      }
    }

    const novaDataPartida = updateViagemDto.dataPartida ?? viagem.dataPartida;
    const novaDataChegada = updateViagemDto.dataChegada ?? viagem.dataChegada;

    if (novaDataChegada < novaDataPartida) {
      throw new HttpException(
        'A data de chegada deve ser maior ou igual à data de partida',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.prisma.viagem.update({
      where: {
        id: viagemId,
      },
      data: {
        ...updateViagemDto,
      },
    });
  }

  async getAll(paginationViagemDto: PaginationViagemDto) {
    const { pageSize, page, rotaId, dataPartida } = paginationViagemDto;
    const skip = (page - 1) * pageSize;

    const where: Prisma.ViagemWhereInput = {};

    if (rotaId) {
      where.rotaId = rotaId;
    }

    if (dataPartida) {
      where.dataPartida = {
        gte: dataPartida,
      };
    }

    const [pageData, total] = await Promise.all([
      this.prisma.viagem.findMany({
        take: pageSize,
        skip: skip,
        where,
        orderBy: {
          dataPartida: 'asc',
        },
        include: {
          ferry: true,
          rota: true,
        },
      }),
      this.prisma.viagem.count({ where: where }),
    ]);

    const viagemIds = pageData.map((v) => v.id);

    if (viagemIds.length === 0) {
      return {
        data: [],
        meta: {
          totalItens: total,
          paginaAtual: page,
          tamanhoPagina: pageSize,
          totalPaginas: Math.ceil(total / pageSize),
        },
      };
    }

    const passengerCounts: { viagemId: number; passageiroCount: number }[] =
      await this.prisma.$queryRaw`
      SELECT
        t."viagemId" as "viagemId",
        COUNT(pp.id) as "passageiroCount"
      FROM "passagem_passageiros" "pp"
      INNER JOIN "passagens" "t" ON "pp"."passagemId" = "t".id
      WHERE
        "t"."viagemId" IN (${Prisma.join(viagemIds)})
        AND "t"."status" = 'PAGA'
      GROUP BY
        t."viagemId"
    `;

    const countMap = new Map<number, number>();
    for (const row of passengerCounts) {
      countMap.set(row.viagemId, Number(row.passageiroCount));
    }

    const dataComContagem = pageData.map((viagem) => ({
      ...viagem,
      quantidadeDePassageiros: countMap.get(viagem.id) ?? 0,
    }));

    return {
      data: dataComContagem,
      meta: {
        totalItens: total,
        paginaAtual: page,
        tamanhoPagina: pageSize,
        totalPaginas: Math.ceil(total / pageSize),
      },
    };
  }

  async existById(viagemId: number) {
    const viagem = await this.prisma.viagem.findFirst({
      where: {
        id: viagemId,
      },
      select: {
        id: true,
      },
    });

    return viagem != null;
  }

  async isAvaliableShellPassagem(
    viagemId: number,
    amountNewPassageiros: number,
  ): Promise<boolean> {
    const viagem = await this.prisma.viagem.findUniqueOrThrow({
      where: {
        id: viagemId,
      },
      select: {
        ferry: {
          select: {
            maximoDePessoas: true,
          },
        },
      },
    });

    const maximoDePessoas = viagem.ferry.maximoDePessoas;
    const currentAmountPassageiros = await this.prisma.passagemPassageiro.count(
      {
        where: {
          passagem: {
            viagemId,
            status: {
              not: 'CANCELADA',
            },
          },
        },
      },
    );

    const totalPassageirosAposReserva =
      currentAmountPassageiros + amountNewPassageiros;

    return totalPassageirosAposReserva <= maximoDePessoas;
  }
}
