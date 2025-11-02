import { cpfSchema } from 'src/usuario/dto/cpf.schema';
import z from 'zod';

export const pasagemVeiculoSchema = z.object({
  placa: z.string().min(8),
  veiculoId: z.coerce.number().positive(),
  motoristaCpf: cpfSchema,
});

export type PassagemVeiculoDto = z.infer<typeof pasagemVeiculoSchema>;
