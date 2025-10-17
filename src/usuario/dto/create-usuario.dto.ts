import z from 'zod';
import { passwordSchema } from './password.schema';
import { cpfSchema } from './cpf.schema';
import { dataNascimentoSchema } from './dataNascimento.schema';
import { nomeCompletoSchema } from './nomeCompletoSchema';

export const createUsuarioSchema = z.object({
  nomeCompleto: nomeCompletoSchema,
  email: z.email('formato do e-mail inválido'),
  cpf: cpfSchema,
  dataNascimento: dataNascimentoSchema,
  senha: passwordSchema,
});

export type CreateUsuarioDtoType = z.infer<typeof createUsuarioSchema>;
