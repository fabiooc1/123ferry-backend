import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateFerryDto } from './dtos/create-ferry.dto';
import { UpdateFerryDto } from './dtos/update-ferry.dto';

@Injectable()
export class FerryService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFerryDto) {
    const alreadyExistsFerryWithSameName = await this.existByName(data.nome);

    if (alreadyExistsFerryWithSameName) {
      throw new HttpException(
        'Já possui um ferry com esse nome',
        HttpStatus.CONFLICT,
      );
    }

    return await this.prisma.ferry.create({
      data: {
        ...data,
      },
    });
  }

  async existByName(name: string) {
    const amount = await this.prisma.ferry.count({
      where: {
        nome: name,
      },
    });

    return amount > 0;
  }

  async existById(ferryId: number) {
    const amount = await this.prisma.ferry.count({
      where: {
        id: ferryId,
      },
    });

    return amount > 0;
  }

  async findById(ferryId: number) {
    const ferry = await this.prisma.ferry.findUnique({
      where: {
        id: ferryId,
      },
    });

    if (!ferry) {
      throw new HttpException('Ferry não encontrado', HttpStatus.NOT_FOUND);
    }

    return ferry;
  }

  async update(ferryId: number, updateFerryDto: UpdateFerryDto) {
    const ferry = await this.existById(ferryId);

    if (!ferry) {
      throw new HttpException('Ferry não encontrado.', HttpStatus.NOT_FOUND);
    }

    const dataToUpdate = {};

    if (updateFerryDto.nome) {
      const alreadyExistsFerryWithSameName = await this.existByName(
        updateFerryDto.nome,
      );

      if (alreadyExistsFerryWithSameName) {
        throw new HttpException(
          'Já possui um ferry com esse nome.',
          HttpStatus.CONFLICT,
        );
      }

      dataToUpdate['nome'] = updateFerryDto.nome;
    }

    if (updateFerryDto.maximoDePessoas) {
      dataToUpdate['maximoDePessoas'] = updateFerryDto.maximoDePessoas;
    }

    if (updateFerryDto.maximoDeVeiculosEmM2) {
      dataToUpdate['maximoDeVeiculosEmM2'] =
        updateFerryDto.maximoDeVeiculosEmM2;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new HttpException(
        'Você precisa informar alguma alteração.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const ferryDataUpdated = this.prisma.ferry.update({
      where: {
        id: ferryId,
      },
      data: {
        ...dataToUpdate,
      },
    });

    return ferryDataUpdated;
  }

  async getAll(pageSize: number, page: number) {
    const skip = (page - 1) * pageSize;
    const [pageData, total] = await Promise.all([
      this.prisma.ferry.findMany({
        take: pageSize,
        skip: skip,
        orderBy: {
          id: 'asc',
        },
      }),
      this.prisma.ferry.count(),
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
}
