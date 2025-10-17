import { Module } from '@nestjs/common';
import { VeiculoService } from './veiculo.service';
import { VeiculoController } from './veiculo.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [VeiculoController],
  providers: [VeiculoService],
  imports: [DatabaseModule],
  exports: [VeiculoService],
})
export class VeiculoModule {}
