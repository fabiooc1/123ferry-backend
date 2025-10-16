import { PerfilEnum } from '../enums/perfil.enum';

export interface UserPayload {
  sub: string;
  email: string;
  perfil: PerfilEnum;
}
