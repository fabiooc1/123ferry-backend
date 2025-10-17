import { Controller } from '@nestjs/common';
import { PassagemService } from './passagem.service';

@Controller('passagem')
export class PassagemController {
  constructor(private readonly passagemService: PassagemService) {}
}
