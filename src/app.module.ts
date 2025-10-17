import { Module } from '@nestjs/common';
import { UsuarioModule } from './usuario/usuario.module';
import { DatabaseModule } from './database/database.module';
import { SeedDatabase } from './database/seed';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FerryModule } from './ferry/ferry.module';
import { PortoModule } from './porto/porto.module';
import { RotaModule } from './rota/rota.module';
import { ViagemModule } from './viagem/viagem.module';
import { PassagemModule } from './passagem/passagem.module';
import { TipoPassageiroModule } from './tipo-passageiro/tipo-passageiro.module';
import { VeiculoModule } from './veiculo/veiculo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '/.env',
    }),
    UsuarioModule,
    DatabaseModule,
    AuthModule,
    FerryModule,
    PortoModule,
    RotaModule,
    ViagemModule,
    PassagemModule,
    TipoPassageiroModule,
    VeiculoModule,
  ],
  controllers: [],
  providers: [SeedDatabase],
})
export class AppModule {}
