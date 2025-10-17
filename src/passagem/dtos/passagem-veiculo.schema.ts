import z from 'zod';

export const pasagemVeiculoSchema = z.object({
  placa: z.string().min(10),
  veiculoId: z.coerce.bigint().positive(),
});

export type PassagemVeiculoDto = z.infer<typeof pasagemVeiculoSchema>;
