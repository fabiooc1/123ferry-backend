import z from 'zod';

export const paginationViagemSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(6),
  rotaId: z.coerce.number().positive().optional(),
  dataPartida: z.coerce.date().optional(),
  dataPartidaOrdem: z.enum(['asc', 'desc']).default('asc'),
});

export type PaginationViagemDto = z.infer<typeof paginationViagemSchema>;
