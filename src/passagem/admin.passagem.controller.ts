import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PassagemService } from './passagem.service';
import { type RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { PerfisGuard } from 'src/auth/auth.perfils.guard';
import { PerfilEnum } from 'src/auth/enums/perfil.enum';
import { Perfis } from 'src/auth/decorators/perfis.decorator';

@UseGuards(AuthGuard, PerfisGuard)
@Perfis(PerfilEnum.ADMINISTRADOR, PerfilEnum.ATENDENTE)
@Controller('admin/passagem')
export class AdminPassagemController {
  constructor(private readonly passagemService: PassagemService) {}

  @Get(':codigo')
  async findByCode(
    @Request() req: RequestWithUser,
    @Param('codigo') codigo: string,
  ) {
    const userId = Number(req.user.sub);
    return this.passagemService.findByCode(userId, codigo);
  }

  @Patch(':pasagemId/paga')
  async atualizarParaPaga(
    @Request() req: RequestWithUser,
    @Param('pasagemId', new ParseIntPipe()) passagemId: number,
  ) {
    const userId = Number(req.user.sub);
    return this.passagemService.updatePaymentStatus(userId, passagemId);
  }

  @Patch(':passagemId/cancelar')
  async cancelar(
    @Request() req: RequestWithUser,
    @Param('passagemId', ParseIntPipe) passagemId: number,
  ) {
    const userId = Number(req.user.sub);
    return this.passagemService.cancel(userId, passagemId);
  }
}
