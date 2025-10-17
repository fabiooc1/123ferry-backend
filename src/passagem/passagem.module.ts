import { Module } from '@nestjs/common';
import { PassagemService } from './passagem.service';
import { PassagemController } from './passagem.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TipoPassageiroModule } from 'src/tipo-passageiro/tipo-passageiro.module';
import { VeiculoModule } from 'src/veiculo/veiculo.module';
import { ViagemModule } from 'src/viagem/viagem.module';

@Module({
  controllers: [PassagemController],
  providers: [PassagemService],
  imports: [DatabaseModule, TipoPassageiroModule, ViagemModule, VeiculoModule],
})
export class PassagemModule {}
