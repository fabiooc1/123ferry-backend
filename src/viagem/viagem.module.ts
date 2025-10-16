import { Module } from '@nestjs/common';
import { ViagemService } from './viagem.service';
import { ViagemController } from './viagem.controller';
import { FerryModule } from 'src/ferry/ferry.module';
import { AdminViagemController } from './admin.viagem.controller';

@Module({
  controllers: [AdminViagemController, ViagemController],
  providers: [ViagemService],
  imports: [FerryModule, ViagemModule],
})
export class ViagemModule {}
