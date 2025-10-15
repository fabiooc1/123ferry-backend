import z from 'zod';

export const createFerrySchema = z.object({
  nome: z
    .string('tipo inválido')
    .max(100, 'nome muito grande, utilize no máximo 100 caracteres'),
  maximoDePessoas: z.number('tipo inválido').min(1, 'no mínimo 1 pessoa'),
  maximoDeVeiculosEmM2: z
    .number('tipo inválido')
    .max(100000000, 'número muito grande, no maximo 100000000.00')
    .refine(
      (value) => /^\d+\.\d{2}$/.test(value.toFixed(2)),
      'número decimal com 2 casas inválido',
    ),
});

export type CreateFerryDto = z.infer<typeof createFerrySchema>;
