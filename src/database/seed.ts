import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';

const VEHICLE_MODELS = [
  {
    nome: 'Motocicleta',
    tamanhoEmM2: 2.5,
    precoPassagemEmCentavos: 3500,
  },
  {
    nome: 'Carro de Passeio Pequeno',
    tamanhoEmM2: 7.5,
    precoPassagemEmCentavos: 8000,
  },
  {
    nome: 'Carro de Passeio Grande / SUV',
    tamanhoEmM2: 10.5,
    precoPassagemEmCentavos: 11000,
  },
  {
    nome: 'Van / Utilitário',
    tamanhoEmM2: 12.0,
    precoPassagemEmCentavos: 15000,
  },
  {
    nome: 'Micro-ônibus',
    tamanhoEmM2: 16.0,
    precoPassagemEmCentavos: 22000,
  },
  {
    nome: 'Ônibus',
    tamanhoEmM2: 30.0,
    precoPassagemEmCentavos: 45000,
  },
  {
    nome: 'Caminhão (2 eixos)',
    tamanhoEmM2: 20.0,
    precoPassagemEmCentavos: 30000,
  },
  {
    nome: 'Carreta (acima de 3 eixos)',
    tamanhoEmM2: 45.0,
    precoPassagemEmCentavos: 70000,
  },
];

@Injectable()
export class SeedDatabase implements OnModuleInit {
  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    await this.seedProfiles();
    await this.seedPortos();
    await this.seedRotas();
  }

  async seedProfiles() {
    const profilesCount = await this.prisma.perfil.count();

    if (profilesCount === 0) {
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

  async seedPortos() {
    const portosCount = await this.prisma.porto.count();

    if (portosCount === 0) {
      await this.prisma.porto.createMany({
        data: [
          {
            id: 1,
            nome: 'Itaqui',
          },
          {
            id: 2,
            nome: 'Conjupe',
          },
        ],
      });
    }
  }

  async seedRotas() {
    const rotasCount = await this.prisma.rota.count();

    if (rotasCount === 0) {
      await this.prisma.rota.createMany({
        data: [
          {
            nome: 'São Luís -> Conjupe',
            origemId: 1,
            destinoId: 2,
          },
          {
            nome: 'Conjupe -> São Luís',
            origemId: 2,
            destinoId: 1,
          },
        ],
      });
    }
  }

  async seedVehicles() {
    for (const v of VEHICLE_MODELS) {
      try {
        await this.prisma.veiculo.upsert({
          where: { nome: v.nome },
          update: {
            tamanhoEmM2: v.tamanhoEmM2,
            precoPassagemEmCentavos: v.precoPassagemEmCentavos,
          },
          create: {
            nome: v.nome,
            tamanhoEmM2: v.tamanhoEmM2,
            precoPassagemEmCentavos: v.precoPassagemEmCentavos,
          },
        });
      } catch (error) {
        console.error('[VEICULOS] Seeding error: ', error);
      }
    }
  }
}
