import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserPayload } from './interfaces/user-payload.interface';
import { Reflector } from '@nestjs/core';
import { PerfilEnum } from './enums/perfil.enum';
import { PERFIS_KEY } from './decorators/perfis.decorator';

@Injectable()
export class PerfisGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPerfis = this.reflector.getAllAndOverride<PerfilEnum[]>(
      PERFIS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPerfis) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: UserPayload = request.user;
    const userPerfilIdNumerico = Number(user.perfilId);

    return requiredPerfis.some(
      (requiredId) => requiredId === userPerfilIdNumerico,
    );
  }
}
