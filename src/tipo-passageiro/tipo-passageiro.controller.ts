import { Controller } from '@nestjs/common';
import { TipoPassageiroService } from './tipo-passageiro.service';

@Controller('tipo-passageiro')
export class TipoPassageiroController {
  constructor(private readonly tipoPassageiroService: TipoPassageiroService) {}
}
