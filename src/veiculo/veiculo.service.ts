import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class VeiculoService {
  constructor(private prisma: PrismaService) {}

  async existById(veiculoId: number) {
    const veiculo = await this.prisma.veiculo.findFirst({
      where: {
        id: veiculoId,
      },
      select: {
        id: true,
      },
    });

    return veiculo != null;
  }

  async getAll() {
    return await this.prisma.veiculo.findMany();
  }
}
