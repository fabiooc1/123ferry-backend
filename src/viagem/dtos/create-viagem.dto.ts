import z from 'zod';

export const createViagemSchema = z.object({
  ferryId: z.coerce.number().positive(),
  rotaId: z.coerce.number().positive(),
  dataPartida: z.coerce.date(),
  dataChegada: z.coerce.date(),
});

export type CreateViagemDto = z.infer<typeof createViagemSchema>;
