import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { type LoginDtoType } from 'src/usuario/dto/login-usuario.dto';
import { UsuarioService } from 'src/usuario/usuario.service';
import { UserPayload } from './interfaces/user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDtoType) {
    const user = await this.usuarioService.findByLogin(data.login);
    const isValidPassword = await compare(data.senha, user.senhaCriptografada);

    if (!isValidPassword) {
      throw new HttpException(
        'Credenciais inválidas.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const payload: UserPayload = {
      sub: String(user.id),
      email: user.email,
      perfilId: String(user.perfilId),
    };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }
}
