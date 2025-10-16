import { Module } from '@nestjs/common';
import { RotaService } from './rota.service';
import { RotaController } from './rota.controller';
import { DatabaseModule } from 'src/database/database.module';
import { PortoModule } from 'src/porto/porto.module';
import { AdminRotaController } from './admin.rota.controller';

@Module({
  controllers: [RotaController, AdminRotaController],
  providers: [RotaService],
  imports: [DatabaseModule, PortoModule],
})
export class RotaModule {}
