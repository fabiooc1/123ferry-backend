import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TipoPassageiroService } from './tipo-passageiro.service';

@UseGuards(AuthGuard)
@Controller('tipo-passageiro')
export class TipoPassageiroController {
  constructor(private readonly tipoPassageiroService: TipoPassageiroService) {}

  @Get()
  async getAll() {
    return this.tipoPassageiroService.getAll();
  }
}
