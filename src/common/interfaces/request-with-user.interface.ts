import { Request } from 'express';
import { UserPayload } from 'src/auth/interfaces/user-payload.interface';

export interface RequestWithUser extends Request {
  user: UserPayload;
}
