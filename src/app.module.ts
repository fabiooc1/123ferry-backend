import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuarioModule } from './usuario/usuario.module';
import { DatabaseModule } from './database/database.module';
import { SeedDatabase } from './database/seed';

@Module({
  imports: [UsuarioModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService, SeedDatabase],
})
export class AppModule {}
