import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PortoService } from 'src/porto/porto.service';
import { CreateRotaDto } from './dtos/create-rota.dto';
import { UpdateRotaDto } from './dtos/update-rota.dto';

@Injectable()
export class RotaService {
  constructor(
    private prisma: PrismaService,
    private portoService: PortoService,
  ) {}

  async create(createRotaDto: CreateRotaDto) {
    if (await this.existByName(createRotaDto.nome)) {
      throw new HttpException(
        'Já possui uma rota com esse nome',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (createRotaDto.origemId === createRotaDto.destinoId) {
      throw new HttpException(
        'A origem e destino não pode ser iguais',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (await this.portoService.existById(createRotaDto.origemId)) {
      throw new HttpException(
        'Porto de origem não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    if (await this.portoService.existById(createRotaDto.destinoId)) {
      throw new HttpException(
        'Porto de destino não encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    if (
      await this.alreadyExistRouteWithSameOrigemAndDestino(
        createRotaDto.origemId,
        createRotaDto.destinoId,
      )
    ) {
      throw new HttpException(
        'Já possui uma rota com essa origem e destino',
        HttpStatus.CONFLICT,
      );
    }

    return await this.prisma.rota.create({
      data: {
        ...createRotaDto,
      },
    });
  }

  async findById(rotaId: bigint) {
    const rote = await this.prisma.rota.findUnique({
      where: {
        id: rotaId,
      },
    });

    if (!rote) {
      throw new HttpException('Rota não encontrada', HttpStatus.NOT_FOUND);
    }

    return rote;
  }

  async existById(rotaId: bigint) {
    const rote = await this.prisma.rota.findFirst({
      where: {
        id: rotaId,
      },
      select: {
        id: true,
      },
    });

    return rote != null;
  }

  async existByName(name: string) {
    const route = await this.prisma.rota.findFirst({
      where: {
        nome: name,
      },
      select: {
        id: true,
      },
    });

    return route != null;
  }

  async update(rotaId: bigint, updateRotaDto: UpdateRotaDto) {
    if (Object.keys(updateRotaDto).length === 0) {
      throw new HttpException(
        'Nenhum dado de atualização fornecido',
        HttpStatus.BAD_REQUEST,
      );
    }

    const rote = await this.findById(rotaId);

    if (updateRotaDto.nome) {
      if (await this.existByName(updateRotaDto.nome)) {
        throw new HttpException(
          'Já possui uma rota com esse nome',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if (updateRotaDto.origemId) {
      if (!(await this.portoService.existById(updateRotaDto.origemId))) {
        throw new HttpException(
          'Porto de origem não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      if (rote.origemId === updateRotaDto.origemId) {
        throw new HttpException(
          'Essa rota já possui esse porto como origem',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    if (updateRotaDto.destinoId) {
      if (!(await this.portoService.existById(updateRotaDto.destinoId))) {
        throw new HttpException(
          'Porto de destino não encontrado',
          HttpStatus.CONFLICT,
        );
      }

      if (rote.destinoId === updateRotaDto.destinoId) {
        throw new HttpException(
          'Essa rota já possui esse porto como destino',
          HttpStatus.CONFLICT,
        );
      }
    }

    const newData = {
      ...rote,
      ...updateRotaDto,
    };

    if (
      await this.alreadyExistRouteWithSameOrigemAndDestino(
        newData.origemId,
        newData.destinoId,
      )
    ) {
      throw new HttpException(
        'Já possui uma rota com essa origem e destino',
        HttpStatus.CONFLICT,
      );
    }

    return this.prisma.rota.update({
      where: {
        id: rotaId,
      },
      data: {
        ...newData,
      },
    });
  }

  async getAll(pageSize: number, page: number) {
    const skip = (page - 1) * pageSize;
    const [pageData, total] = await Promise.all([
      this.prisma.rota.findMany({
        take: pageSize,
        skip: skip,
        orderBy: {
          id: 'asc',
        },
      }),
      this.prisma.rota.count(),
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

  private async alreadyExistRouteWithSameOrigemAndDestino(
    origemId: bigint,
    destinoId: bigint,
  ): Promise<boolean> {
    const rota = await this.prisma.rota.findFirst({
      where: {
        origemId,
        destinoId,
      },
      select: {
        id: true,
      },
    });

    return rota !== null;
  }
}
