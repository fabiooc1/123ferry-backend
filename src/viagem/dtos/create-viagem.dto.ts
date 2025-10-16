import z from 'zod';

export const createViagemSchema = z.object({
  ferryId: z.bigint().positive(),
  rotaId: z.bigint().positive(),
  dataPartida: z.date(),
  dataChegada: z.date(),
});

export type CreateViagemDto = z.infer<typeof createViagemSchema>;
