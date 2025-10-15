import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUsuarioDtoType } from './dto/create-usuario.dto';
import { PrismaService } from 'src/database/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UsuarioService {
  public constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUsuarioDtoType) {
    const findUserWithSamerEmail = await this.prisma.usuario.count({
      where: {
        email: data.email,
      },
    });

    if (findUserWithSamerEmail > 0) {
      throw new HttpException('E-mail já utilizado', HttpStatus.CONFLICT);
    }

    const findUserWithSamerCPF = await this.prisma.usuario.count({
      where: {
        cpf: data.cpf,
      },
    });

    if (findUserWithSamerCPF > 0) {
      throw new HttpException('CPF já utilizado', HttpStatus.CONFLICT);
    }

    const passwordHash = await hash(data.senha, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nomeCompleto: data.nomeCompleto,
        cpf: data.cpf,
        email: data.email,
        dataNascimento: data.dataNascimento,
        senhaCriptografada: passwordHash,
        perfilId: 1,
      },
      omit: {
        senhaCriptografada: true,
        perfilId: true,
      },
      include: {
        perfil: true,
      },
    });

    return user;
  }

  async findByLogin(login: string) {
    const user = await this.prisma.usuario.findFirst({
      where: {
        OR: [{ email: login }, { cpf: login }],
      },
    });

    if (!user) {
      throw new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }

  async findById(userId: bigint) {
    const user = await this.prisma.usuario.findUnique({
      where: {
        id: userId,
      },
      include: {
        perfil: true,
      },
      omit: {
        perfilId: true,
        senhaCriptografada: true,
      },
    });

    if (!user) {
      throw new HttpException('Usuario nao encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
