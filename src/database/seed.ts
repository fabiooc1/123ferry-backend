import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class SeedDatabase implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedProfiles();
  }

  async seedProfiles() {
    const profilesAmount = await this.prisma.perfil.count();

    if (profilesAmount === 0) {
      await this.prisma.perfil.createMany({
        data: [
          {
            nome: 'CLIENTE',
          },
          {
            nome: 'ATENDENTE',
          },
          {
            nome: 'ADMINISTRADOR',
          },
        ],
      });
    }
  }
}
