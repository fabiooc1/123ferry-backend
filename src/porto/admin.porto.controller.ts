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
  @UsePipes(new ZodValidationPipe(createPortoSchema))
  async create(@Body() createPortoDto: CreatePortoDto) {
    return this.portoService.create(createPortoDto);
  }

  @Put(':portoId')
  @UsePipes(new ZodValidationPipe(updatePortoSchema))
  async update(
    @Param('portoId', ParseIntPipe) portoId: bigint,
    @Body() updatePortoDto: UpdatePortoDto,
  ) {
    return this.portoService.update(portoId, updatePortoDto);
  }
}
