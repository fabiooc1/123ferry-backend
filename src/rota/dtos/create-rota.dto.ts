import z from 'zod';

export const createRotaSchema = z.object({
  nome: z.string().max(100),
  origemId: z.bigint().positive(),
  destinoId: z.bigint().positive(),
});

export type CreateRotaDto = z.infer<typeof createRotaSchema>;
