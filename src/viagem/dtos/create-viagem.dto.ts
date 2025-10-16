import z from 'zod';

export const createViagemSchema = z.object({
  ferryId: z.coerce.bigint().positive(),
  rotaId: z.coerce.bigint().positive(),
  dataPartida: z.coerce.date(),
  dataChegada: z.coerce.date(),
});

export type CreateViagemDto = z.infer<typeof createViagemSchema>;
