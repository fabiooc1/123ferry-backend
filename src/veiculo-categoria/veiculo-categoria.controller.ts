import { Controller, Get } from '@nestjs/common';
import { VeiculoCategoriaService } from './veiculo-categoria.service';

@Controller('veiculo-categoria')
export class VeiculoCategoriaController {
  constructor(
    private readonly veiculoCategoriaService: VeiculoCategoriaService,
  ) {}

  @Get()
  getAll() {
    return this.veiculoCategoriaService.getAll();
  }
}
