import { Module } from '@nestjs/common';
import { PassagemService } from './passagem.service';
import { PassagemController } from './passagem.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TipoPassageiroModule } from 'src/tipo-passageiro/tipo-passageiro.module';
import { VeiculoModule } from 'src/veiculo/veiculo.module';
import { ViagemModule } from 'src/viagem/viagem.module';
import { UsuarioModule } from 'src/usuario/usuario.module';

@Module({
  controllers: [PassagemController],
  providers: [PassagemService],
  imports: [
    DatabaseModule,
    TipoPassageiroModule,
    ViagemModule,
    VeiculoModule,
    UsuarioModule,
  ],
})
export class PassagemModule {}
