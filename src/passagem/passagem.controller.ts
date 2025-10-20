import {
  Body,
  Controller,
  DefaultValuePipe,
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

@UseGuards(AuthGuard)
@Controller('passagem')
export class PassagemController {
  constructor(private readonly passagemService: PassagemService) {}

  @Post()
  async create(
    @Request() req: RequestWithUser,
    @Body(new ZodValidationPipe(createPassagemSchema)) body: CreatePassagemDto,
  ) {
    const userId = BigInt(req.user.sub);
    return this.passagemService.create(userId, body);
  }

  @Get(':codigo')
  async getByCode(
    @Request() req: RequestWithUser,
    @Param('codigo') codigo: string,
  ) {
    const userId = BigInt(req.user.sub);
    return this.passagemService.findByCode(userId, codigo);
  }

  @Patch(':id/cancelar')
  async cancelar(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) passagemId: bigint,
  ) {
    const userId = BigInt(req.user.sub);
    return this.passagemService.cancel(userId, passagemId);
  }

  @Get()
  async getAll(
    @Request() req: RequestWithUser,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(6), ParseIntPipe) pageSize: number,
  ) {
    const userId = BigInt(req.user.sub);
    return this.passagemService.getAll(userId, pageSize, page);
  }
}
