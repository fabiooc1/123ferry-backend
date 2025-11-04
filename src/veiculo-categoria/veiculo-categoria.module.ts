import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { VeiculoCategoriaController } from './veiculo-categoria.controller';
import { VeiculoCategoriaService } from './veiculo-categoria.service';

@Module({
  controllers: [VeiculoCategoriaController],
  providers: [VeiculoCategoriaService],
  imports: [DatabaseModule],
  exports: [VeiculoCategoriaService],
})
export class VeiculoCategoriaModule {}
