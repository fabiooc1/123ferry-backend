import { SetMetadata } from '@nestjs/common';
import { PerfilEnum } from '../enums/perfil.enum';

export const PERFIS_KEY = 'perfis';
export const Perfis = (...perfis: PerfilEnum[]) =>
  SetMetadata(PERFIS_KEY, perfis);
