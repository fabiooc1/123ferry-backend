import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  Request,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';
import {
  type CreateUsuarioDtoType,
  createUsuarioSchema,
} from './dto/create-usuario.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUsuarioSchema))
  create(@Body() createUsuarioDto: CreateUsuarioDtoType) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  get(@Request() req) {
    const userId = BigInt(req.user.sub);
    return this.usuarioService.findById(userId);
  }
}
