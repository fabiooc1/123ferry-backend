import z from 'zod';

export const createRotaSchema = z.object({
  origemId: z.bigint().positive(),
  destinoId: z.bigint().positive(),
});

export type CreateRotaDto = z.infer<typeof createRotaSchema>;
