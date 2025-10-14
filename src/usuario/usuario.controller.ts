import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';
import {
  type CreateUsuarioDtoType,
  createUsuarioSchema,
} from './dto/create-usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUsuarioSchema))
  create(@Body() createUsuarioDto: CreateUsuarioDtoType) {
    return this.usuarioService.create(createUsuarioDto);
  }
}
