import z from 'zod';

export const createPortoSchema = z.object({
  nome: z
    .string('tipo inválido')
    .max(100, 'nome muito grande, utilize no máximo 100 caracteres'),
});

export type CreatePortoDto = z.infer<typeof createPortoSchema>;
