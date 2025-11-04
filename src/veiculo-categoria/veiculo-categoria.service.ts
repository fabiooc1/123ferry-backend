import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class VeiculoCategoriaService {
  constructor(private prisma: PrismaService) {}

  async existById(veiculoCategoriaId: number) {
    const categoria = await this.prisma.veiculoCategoria.findFirst({
      where: {
        id: veiculoCategoriaId,
      },
      select: {
        id: true,
      },
    });

    return categoria != null;
  }

  async getAll() {
    return await this.prisma.veiculoCategoria.findMany();
  }
}
