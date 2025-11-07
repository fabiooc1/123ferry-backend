import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PassagemService } from './passagem.service';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';
import {
  type CreatePassagemDto,
  createPassagemSchema,
} from './dtos/create-passagem.dto';
import { type RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  type PaginatePassagemDto,
  paginatePassagemSchema,
} from './dtos/paginate-passagem.dto';

@UseGuards(AuthGuard)
@Controller('passagem')
export class PassagemController {
  constructor(private readonly passagemService: PassagemService) {}

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body(new ZodValidationPipe(createPassagemSchema)) body: CreatePassagemDto,
  ) {
    const userId = Number(req.user.sub);
    return this.passagemService.create(userId, body);
  }

  @Get(':codigo')
  async getByCode(
    @Request() req: RequestWithUser,
    @Param('codigo') codigo: string,
  ) {
    const userId = Number(req.user.sub);
    return this.passagemService.findByCode(codigo, userId);
  }

  @Patch(':id/cancelar')
  async cancelar(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) passagemId: number,
  ) {
    const userId = Number(req.user.sub);
    return this.passagemService.cancel(userId, passagemId);
  }

  @Get()
  async getAll(
    @Request() req: RequestWithUser,
    @Query(new ZodValidationPipe(paginatePassagemSchema))
    queryParams: PaginatePassagemDto,
  ) {
    const userId = Number(req.user.sub);
    return this.passagemService.getAll(queryParams, userId);
  }
}
