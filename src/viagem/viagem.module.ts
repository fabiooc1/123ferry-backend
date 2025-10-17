import { Module } from '@nestjs/common';
import { ViagemService } from './viagem.service';
import { ViagemController } from './viagem.controller';
import { FerryModule } from 'src/ferry/ferry.module';
import { AdminViagemController } from './admin.viagem.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RotaModule } from 'src/rota/rota.module';

@Module({
  controllers: [AdminViagemController, ViagemController],
  providers: [ViagemService],
  imports: [DatabaseModule, FerryModule, RotaModule],
  exports: [ViagemService],
})
export class ViagemModule {}
