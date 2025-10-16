import z from 'zod';

export const createRotaSchema = z.object({
  nome: z.string().max(100),
  origemId: z.coerce.bigint().positive(),
  destinoId: z.coerce.bigint().positive(),
});

export type CreateRotaDto = z.infer<typeof createRotaSchema>;
