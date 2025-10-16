import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ViagemService } from './viagem.service';
import {
  paginationViagemSchema,
  type PaginationViagemDto,
} from './dtos/pagination-viagem.dto';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('viagem')
export class ViagemController {
  constructor(private readonly viagemService: ViagemService) {}

  @Get()
  async getAll(
    @Query(new ZodValidationPipe(paginationViagemSchema))
    paginationViagemDto: PaginationViagemDto,
  ) {
    return this.viagemService.getAll(paginationViagemDto);
  }

  @Get(':viagemId')
  get(@Param('viagemId', ParseIntPipe) viagemId: bigint) {
    return this.viagemService.findById(viagemId);
  }
}
