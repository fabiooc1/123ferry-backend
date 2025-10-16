import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RotaService } from './rota.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('rota')
export class RotaController {
  constructor(private readonly rotaService: RotaService) {}

  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(6), ParseIntPipe) pageSize: number,
  ) {
    return this.rotaService.getAll(pageSize, page);
  }

  @Get(':rotaId')
  get(@Param('rotaId', ParseIntPipe) rotaId: bigint) {
    return this.rotaService.findById(rotaId);
  }
}
