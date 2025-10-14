import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService],
  imports: [DatabaseModule],
})
export class UsuarioModule {}
