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
import { FerryService } from './ferry.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Perfis } from 'src/auth/decorators/perfis.decorator';
import { PerfilEnum } from 'src/auth/enums/perfil.enum';
import { PerfisGuard } from 'src/auth/auth.perfils.guard';
import {
  createFerrySchema,
  type CreateFerryDto,
} from './dtos/create-ferry.dto';
import {
  updateFerrySchema,
  type UpdateFerryDto,
} from './dtos/update-ferry.dto';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';

@UseGuards(AuthGuard, PerfisGuard)
@Perfis(PerfilEnum.ATENDENTE, PerfilEnum.ADMINISTRADOR)
@Controller('/admin/ferry')
export class AdminFerryController {
  constructor(private readonly ferryService: FerryService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createFerrySchema))
  async create(@Body() createFerryDto: CreateFerryDto) {
    return this.ferryService.create(createFerryDto);
  }

  @Put(':ferryId')
  @UsePipes(new ZodValidationPipe(updateFerrySchema))
  async update(
    @Param('ferryId', ParseIntPipe) ferryId: bigint,
    @Body() updateFerryDto: UpdateFerryDto,
  ) {
    return this.ferryService.update(ferryId, updateFerryDto);
  }
}
