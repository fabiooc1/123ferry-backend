import { Controller, Get } from '@nestjs/common';
import { VeiculoService } from './veiculo.service';

@Controller('veiculo')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Get()
  getAll() {
    return this.veiculoService.getAll();
  }
}
