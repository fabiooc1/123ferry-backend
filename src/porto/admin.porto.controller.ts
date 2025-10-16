import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PerfisGuard } from 'src/auth/auth.perfils.guard';
import { Perfis } from 'src/auth/decorators/perfis.decorator';
import { PerfilEnum } from 'src/auth/enums/perfil.enum';
import { PortoService } from './porto.service';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';
import {
  type CreatePortoDto,
  createPortoSchema,
} from './dtos/create-porto.dto';
import {
  type UpdatePortoDto,
  updatePortoSchema,
} from './dtos/update-porto.dto';

@UseGuards(AuthGuard, PerfisGuard)
@Perfis(PerfilEnum.ATENDENTE, PerfilEnum.ADMINISTRADOR)
@Controller('/admin/porto')
export class AdminPortoController {
  constructor(private readonly portoService: PortoService) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createPortoSchema))
    createPortoDto: CreatePortoDto,
  ) {
    return this.portoService.create(createPortoDto);
  }

  @Put(':portoId')
  async update(
    @Param('portoId', ParseIntPipe) portoId: bigint,
    @Body(new ZodValidationPipe(updatePortoSchema))
    updatePortoDto: UpdatePortoDto,
  ) {
    return this.portoService.update(portoId, updatePortoDto);
  }
}
