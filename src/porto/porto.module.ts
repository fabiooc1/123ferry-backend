import { Module } from '@nestjs/common';
import { PortoService } from './porto.service';
import { PortoController } from './porto.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AdminPortoController } from './admin.porto.controller';

@Module({
  controllers: [AdminPortoController, PortoController],
  providers: [PortoService],
  imports: [DatabaseModule],
})
export class PortoModule {}
