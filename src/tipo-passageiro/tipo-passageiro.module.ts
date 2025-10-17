import { Module } from '@nestjs/common';
import { TipoPassageiroService } from './tipo-passageiro.service';
import { TipoPassageiroController } from './tipo-passageiro.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [TipoPassageiroController],
  providers: [TipoPassageiroService],
  imports: [DatabaseModule],
  exports: [TipoPassageiroService],
})
export class TipoPassageiroModule {}
