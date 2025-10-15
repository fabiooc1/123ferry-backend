import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PortoService } from './porto.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('porto')
export class PortoController {
  constructor(private readonly portoService: PortoService) {}

  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(6), ParseIntPipe) pageSize: number,
  ) {
    return this.portoService.getAll(pageSize, page);
  }

  @Get(':portoId')
  get(@Param('portoId', ParseIntPipe) portoId: bigint) {
    return this.portoService.findById(portoId);
  }
}
