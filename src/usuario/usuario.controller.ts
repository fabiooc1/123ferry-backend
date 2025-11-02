import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Put,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import {
  createUsuarioSchema,
  type CreateUsuarioDtoType,
} from './dto/create-usuario.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { type RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';
import {
  type UpdateUsuarioDtoType,
  updateUsuarioSchema,
} from './dto/update-usuario.dto';

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
  @Get('/me')
  get(@Request() req: RequestWithUser) {
    const userId = Number(req.user.sub);
    return this.usuarioService.findById(userId);
  }

  @UseGuards(AuthGuard)
  @Put()
  update(
    @Request() req: RequestWithUser,
    @Body(new ZodValidationPipe(updateUsuarioSchema))
    updateUsuarioDto: UpdateUsuarioDtoType,
  ) {
    const userId = Number(req.user.sub);
    return this.usuarioService.update(false, userId, updateUsuarioDto);
  }
}
