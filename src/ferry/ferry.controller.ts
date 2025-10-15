import {
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FerryService } from './ferry.service';
import { AuthGuard } from 'src/auth/auth.guard';
@UseGuards(AuthGuard)
@Controller('ferry')
export class FerryController {
  constructor(private readonly ferryService: FerryService) {}

  @Get()
  async getAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(6), ParseIntPipe) pageSize: number,
  ) {
    return this.ferryService.getAll(pageSize, page);
  }

  @Get(':ferryId')
  get(@Param('ferryId', ParseIntPipe) ferryId: bigint) {
    return this.ferryService.findById(ferryId);
  }
}
