import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import {
  type LoginDtoType,
  loginSchema,
} from 'src/usuario/dto/login-usuario.dto';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from 'src/pipes/zod.validation.pipe';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  @UsePipes(new ZodValidationPipe(loginSchema))
  login(@Body() loginDto: LoginDtoType) {
    return this.authService.login(loginDto);
  }
}
