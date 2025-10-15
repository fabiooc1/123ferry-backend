import z from 'zod';
import { passwordSchema } from './password.schema';

export const loginSchema = z.object({
  login: z.string('formato inválido'),
  senha: passwordSchema,
});

export type LoginDtoType = z.infer<typeof loginSchema>;
