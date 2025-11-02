import z from 'zod';
import { passageiroSchema } from './passageiro.schema';
import { pasagemVeiculoSchema } from './passagem-veiculo.schema';

export const createPassagemSchema = z.object({
  viagemId: z.coerce.number().positive(),
  passageiros: z.array(passageiroSchema).min(1, 'no mínimo 1 passageiro'),
  veiculos: z.array(pasagemVeiculoSchema),
});

export type CreatePassagemDto = z.infer<typeof createPassagemSchema>;
