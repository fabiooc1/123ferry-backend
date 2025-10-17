import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TipoPassageiroService {
  constructor(private prisma: PrismaService) {}

  async existById(tipoId: number) {
    const tipo = await this.prisma.tipoPassageiro.findFirst({
      where: {
        id: tipoId,
      },
      select: {
        id: true,
      },
    });

    return tipo != null;
  }
}
