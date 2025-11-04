import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PerfilTypes } from 'generated/prisma';

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

const PORTOS = [
  {
    id: 1,
    nome: 'Terminal Ponta da Espera',
    cidade: 'São Luís',
  },
  {
    id: 2,
    nome: 'Terminal Cujupe',
    cidade: 'Alcântara',
  },
];

const ROTAS = [
  {
    nome: 'São Luís (Ponta da Espera) -> Alcântara (Cujupe)',
    origemId: 1,
    destinoId: 2,
  },
  {
    nome: 'Alcântara (Cujupe) -> São Luís (Ponta da Espera)',
    origemId: 2,
    destinoId: 1,
  },
];

const PERFILS = [
  {
    nome: 'CLIENTE',
  },
  {
    nome: 'ATENDENTE',
  },
  {
    nome: 'ADMINISTRADOR',
  },
];

@Injectable()
export class SeedDatabase implements OnModuleInit {
  private readonly logger = new Logger(SeedDatabase.name);

  constructor(private readonly prisma: PrismaService) {}

  async onModuleInit() {
    this.logger.log('Iniciando o seeding do banco de dados...');
    await this.seedProfiles();
    await this.seedPortos();
    await this.seedRotas();
    await this.seedVehicles();
    this.logger.log('Seeding concluído.');
  }

  async seedProfiles() {
    this.logger.log('Seeding [Perfis]...');
    for (const p of PERFILS) {
      try {
        const existingProfile = await this.prisma.perfil.findFirst({
          where: { nome: p.nome as PerfilTypes },
        });

        if (!existingProfile) {
          await this.prisma.perfil.create({
            data: {
              nome: p.nome as PerfilTypes,
            },
          });
        }
      } catch (error) {
        this.logger.error(`[PERFIS] Erro no seeding: ${error}`);
      }
    }
  }

  async seedPortos() {
    this.logger.log('Seeding [Portos]...');
    for (const p of PORTOS) {
      try {
        await this.prisma.porto.upsert({
          where: { id: p.id },
          update: {
            nome: p.nome,
            cidade: p.cidade,
          },
          create: {
            id: p.id,
            nome: p.nome,
            cidade: p.cidade,
          },
        });
      } catch (error) {
        this.logger.error(`[PORTOS] Erro no seeding: ${error}`);
      }
    }
  }

  async seedRotas() {
    this.logger.log('Seeding [Rotas]...');
    for (const r of ROTAS) {
      try {
        await this.prisma.rota.upsert({
          where: {
            origemId_destinoId: {
              origemId: r.origemId,
              destinoId: r.destinoId,
            },
          },
          update: {
            nome: r.nome,
          },
          create: {
            nome: r.nome,
            origemId: r.origemId,
            destinoId: r.destinoId,
          },
        });
      } catch (error) {
        this.logger.error(`[ROTAS] Erro no seeding: ${error}`);
      }
    }
  }

  async seedVehicles() {
    this.logger.log('Seeding [Categorias de Veículos]...');
    for (const v of VEHICLE_MODELS) {
      try {
        await this.prisma.veiculoCategoria.upsert({
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
        this.logger.error(`[VEICULOS] Erro no seeding: ${error}`);
      }
    }
  }
}
