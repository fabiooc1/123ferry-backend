import { Module } from '@nestjs/common';
import { PortoService } from './porto.service';
import { PortoController } from './porto.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [PortoController],
  providers: [PortoService],
  imports: [DatabaseModule],
})
export class PortoModule {}
