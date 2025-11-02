import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { hash } from 'bcrypt';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUsuarioDtoType } from './dto/create-usuario.dto';
import { UpdateUsuarioDtoType } from './dto/update-usuario.dto';
import { Prisma } from 'generated/prisma';

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
      throw new HttpException(
        {
          field: 'email',
          message: 'e-mail em uso',
        },
        HttpStatus.CONFLICT,
      );
    }

    const fiendUserWithSamerPhone = await this.prisma.usuario.count({
      where: {
        telefone: data.telefone,
      },
    });

    if (fiendUserWithSamerPhone > 0) {
      throw new HttpException(
        {
          field: 'phone',
          message: 'telefone em uso',
        },
        HttpStatus.CONFLICT,
      );
    }

    const findUserWithSamerCPF = await this.prisma.usuario.count({
      where: {
        cpf: data.cpf,
      },
    });

    if (findUserWithSamerCPF > 0) {
      throw new HttpException(
        {
          field: 'cpf',
          message: 'CPF já utilizado',
        },
        HttpStatus.CONFLICT,
      );
    }

    const passwordHash = await hash(data.senha, 10);

    const user = await this.prisma.usuario.create({
      data: {
        nomeCompleto: data.nomeCompleto,
        cpf: data.cpf,
        email: data.email,
        telefone: data.telefone,
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

  async findById(userId: number) {
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
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async update(
    isUpdatingByAdmin: boolean,
    userId: number,
    updateUsuarioDto: UpdateUsuarioDtoType,
  ) {
    await this.findById(userId);

    const data: Prisma.UsuarioUpdateInput = {};

    if (updateUsuarioDto.nomeCompleto) {
      data.nomeCompleto = updateUsuarioDto.nomeCompleto;
    }
    if (updateUsuarioDto.telefone) {
      data.telefone = updateUsuarioDto.telefone;
    }

    if (isUpdatingByAdmin) {
      if (updateUsuarioDto.email) {
        data.email = updateUsuarioDto.email;
      }
      if (updateUsuarioDto.cpf) {
        data.cpf = updateUsuarioDto.cpf;
      }
      if (updateUsuarioDto.dataNascimento) {
        data.dataNascimento = updateUsuarioDto.dataNascimento;
      }
      if (updateUsuarioDto.senha) {
        data.senhaCriptografada = await hash(updateUsuarioDto.senha, 10);
      }
    } else {
      if (
        updateUsuarioDto.cpf ||
        updateUsuarioDto.dataNascimento ||
        updateUsuarioDto.email
      ) {
        throw new ForbiddenException(
          'Você não tem permissão para alterar campos sensíveis.',
        );
      }
    }

    return this.prisma.usuario.update({
      where: { id: userId },
      data,
    });
  }

  async isAdmin(userId: number) {
    try {
      const usuario = await this.prisma.usuario.findUniqueOrThrow({
        where: {
          id: userId,
        },
        select: {
          perfil: {
            select: {
              nome: true,
            },
          },
        },
      });

      return usuario.perfil.nome === 'ADMINISTRADOR';
    } catch {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
