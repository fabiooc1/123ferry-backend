import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { type LoginDtoType } from 'src/usuario/dto/login-usuario.dto';
import { UserPayload } from './interfaces/user-payload.interface';
import { PerfilEnum } from './enums/perfil.enum';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(data: LoginDtoType) {
    const user = await this.prisma.usuario.findFirst({
      where: { OR: [{ email: data.login }, { cpf: data.login }] },
      select: {
        id: true,
        email: true,
        perfil: true,
        senhaCriptografada: true,
      },
    });

    if (!user) {
      throw new HttpException(
        'Credenciais inválidas.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const isValidPassword = await compare(data.senha, user.senhaCriptografada);

    if (!isValidPassword) {
      throw new HttpException(
        'Credenciais inválidas.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const userPerfil = user.perfil.id as PerfilEnum;

    const payload: UserPayload = {
      sub: String(user.id),
      email: user.email,
      perfil: userPerfil,
    };

    return {
      token: await this.jwtService.signAsync(payload),
      perfil: user.perfil,
    };
  }
}
