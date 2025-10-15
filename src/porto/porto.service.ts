import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreatePortoDto } from './dtos/create-porto.dto';
import { UpdatePortoDto } from './dtos/update-porto.dto';

@Injectable()
export class PortoService {
  constructor(private prisma: PrismaService) {}

  async create(createPortoDto: CreatePortoDto) {
    const alreadyExistsPortoWithSameName = await this.existByName(
      createPortoDto.nome,
    );

    if (alreadyExistsPortoWithSameName) {
      throw new HttpException(
        'Já existe um porto com esse nome',
        HttpStatus.CONFLICT,
      );
    }

    return await this.prisma.porto.create({
      data: {
        ...createPortoDto,
      },
    });
  }

  async existByName(name: string) {
    const amount = await this.prisma.porto.count({
      where: {
        nome: name,
      },
    });

    return amount > 1;
  }

  async existById(portoId: bigint) {
    const amount = await this.prisma.porto.count({
      where: {
        id: portoId,
      },
    });

    return amount > 1;
  }

  async findById(portoId: bigint) {
    const porto = await this.prisma.porto.findUnique({
      where: {
        id: portoId,
      },
    });

    if (!porto) {
      throw new HttpException('Porto não encontrado.', HttpStatus.NOT_FOUND);
    }

    return porto;
  }

  async getAll(pageSize: number, page: number) {
    const skip = (page - 1) * pageSize;
    const [pageData, total] = await Promise.all([
      this.prisma.porto.findMany({
        take: pageSize,
        skip: skip,
        orderBy: {
          id: 'asc',
        },
      }),
      this.prisma.porto.count(),
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

  async update(portoId: bigint, updatePortoDto: UpdatePortoDto) {
    const porto = await this.existById(portoId);

    if (!porto) {
      throw new HttpException('Porto não encontrado.', HttpStatus.NOT_FOUND);
    }

    const dataToUpdate = {};

    if (updatePortoDto.nome) {
      const alreadyExistsPortoWithSameName = await this.existByName(
        updatePortoDto.nome,
      );

      if (alreadyExistsPortoWithSameName) {
        throw new HttpException(
          'Já possui um porto com esse nome.',
          HttpStatus.CONFLICT,
        );
      }

      dataToUpdate['nome'] = updatePortoDto.nome;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      throw new HttpException(
        'Você precisa informar alguma alteração.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const portoDataUpdated = this.prisma.porto.update({
      where: {
        id: portoId,
      },
      data: {
        ...dataToUpdate,
      },
    });

    return portoDataUpdated;
  }
}
