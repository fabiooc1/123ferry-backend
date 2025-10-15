import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { DatabaseModule } from './database/database.module';
import { SeedDatabase } from './database/seed';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { FerryModule } from './ferry/ferry.module';
import { PortoModule } from './porto/porto.module';

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
  ],
  controllers: [AppController],
  providers: [AppService, SeedDatabase, FerryModule],
})
export class AppModule {}
