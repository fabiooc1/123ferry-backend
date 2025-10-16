import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Put,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { ViagemService } from './viagem.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { PerfisGuard } from 'src/auth/auth.perfils.guard';
import { Perfis } from 'src/auth/decorators/perfis.decorator';
import { PerfilEnum } from 'src/auth/enums/perfil.enum';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';
import {
  type CreateViagemDto,
  createViagemSchema,
} from './dtos/create-viagem.dto';
import { type RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import {
  updateViagemSchema,
  type UpdateViagemDto,
} from './dtos/update-viagem.dto';

@UseGuards(AuthGuard, PerfisGuard)
@Perfis(PerfilEnum.ATENDENTE, PerfilEnum.ADMINISTRADOR)
@Controller('admin/viagem')
export class AdminViagemController {
  constructor(private readonly viagemService: ViagemService) {}

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body(new ZodValidationPipe(createViagemSchema))
    createViagemDto: CreateViagemDto,
  ) {
    const userId = BigInt(req.user.sub);
    return this.viagemService.create(userId, createViagemDto);
  }

  @Put(':viagemId')
  async update(
    @Param('viagemId', ParseIntPipe) viagemId: bigint,
    @Body(new ZodValidationPipe(updateViagemSchema))
    updateViagemDto: UpdateViagemDto,
  ) {
    return this.viagemService.update(viagemId, updateViagemDto);
  }
}
