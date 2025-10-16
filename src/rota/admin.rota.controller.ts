import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { RotaService } from './rota.service';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';
import { type CreateRotaDto, createRotaSchema } from './dtos/create-rota.dto';
import { type UpdateRotaDto, updateRotaSchema } from './dtos/update-rota.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PerfisGuard } from 'src/auth/auth.perfils.guard';
import { Perfis } from 'src/auth/decorators/perfis.decorator';
import { PerfilEnum } from 'src/auth/enums/perfil.enum';

@UseGuards(AuthGuard, PerfisGuard)
@Perfis(PerfilEnum.ATENDENTE, PerfilEnum.ADMINISTRADOR)
@Controller('admin/rota')
export class AdminRotaController {
  constructor(private readonly rotaService: RotaService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createRotaSchema))
  async create(@Body() createRotaDto: CreateRotaDto) {
    return this.rotaService.create(createRotaDto);
  }

  @Put(':rotaId')
  @UsePipes(new ZodValidationPipe(updateRotaSchema))
  async update(
    @Param('rotaId', ParseIntPipe) rotaId: bigint,
    @Body() updateRotaDto: UpdateRotaDto,
  ) {
    return this.rotaService.update(rotaId, updateRotaDto);
  }
}
