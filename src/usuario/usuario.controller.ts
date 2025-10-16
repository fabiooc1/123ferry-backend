import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import {
  createUsuarioSchema,
  type CreateUsuarioDtoType,
} from './dto/create-usuario.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { type RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createUsuarioSchema))
    createUsuarioDto: CreateUsuarioDtoType,
  ) {
    return this.usuarioService.create(createUsuarioDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  get(@Request() req: RequestWithUser) {
    const userId = BigInt(req.user.sub);
    return this.usuarioService.findById(userId);
  }
}
