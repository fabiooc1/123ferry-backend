import { cpfSchema } from 'src/usuario/dto/cpf.schema';
import { dataNascimentoSchema } from 'src/usuario/dto/dataNascimento.schema';
import { nomeCompletoSchema } from 'src/usuario/dto/nomeCompletoSchema';
import z from 'zod';

export const passageiroSchema = z.object({
  tipoId: z.number().positive(),
  nomeCompleto: nomeCompletoSchema,
  cpf: cpfSchema,
  dataNascimento: dataNascimentoSchema,
});

export type PassageiroDto = z.infer<typeof passageiroSchema>;
