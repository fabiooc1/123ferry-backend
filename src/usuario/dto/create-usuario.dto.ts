import z from 'zod';
import { passwordSchema } from './password.schema';
export const createUsuarioSchema = z.object({
  nomeCompleto: z
    .string('formato inválido')
    .max(100, 'no máximo 100 caracteres'),
  email: z.email('formato do e-mail inválido'),
  cpf: z
    .string('formato inválido')
    .regex(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      'formato inválido, utilize obrigatoriamente 000.000.000-00',
    ),
  dataNascimento: z.coerce
    .date('formato inválido')
    .max(new Date(), 'a data não pode ser no futuro'),
  senha: passwordSchema,
});

export type CreateUsuarioDtoType = z.infer<typeof createUsuarioSchema>;
