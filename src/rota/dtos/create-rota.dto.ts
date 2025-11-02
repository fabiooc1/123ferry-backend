import z from 'zod';

export const createRotaSchema = z.object({
  nome: z.string().max(100),
  origemId: z.coerce.number().positive(),
  destinoId: z.coerce.number().positive(),
});

export type CreateRotaDto = z.infer<typeof createRotaSchema>;
