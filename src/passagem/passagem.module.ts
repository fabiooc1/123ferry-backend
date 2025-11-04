import { Module } from '@nestjs/common';
import { PassagemService } from './passagem.service';
import { PassagemController } from './passagem.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TipoPassageiroModule } from 'src/tipo-passageiro/tipo-passageiro.module';
import { VeiculoCategoriaModule } from 'src/veiculo-categoria/veiculo-categoria.module';
import { ViagemModule } from 'src/viagem/viagem.module';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { AdminPassagemController } from './admin.passagem.controller';

@Module({
  controllers: [AdminPassagemController, PassagemController],
  providers: [PassagemService],
  imports: [
    DatabaseModule,
    TipoPassageiroModule,
    ViagemModule,
    VeiculoCategoriaModule,
    UsuarioModule,
  ],
})
export class PassagemModule {}
