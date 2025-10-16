import z from 'zod';

const now = () => {
  return new Date();
};

export const paginationViagemSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(6),
  rotaId: z.coerce.bigint().positive().optional(),
  dataPartida: z
    .union([z.string().datetime(), z.date()])
    .optional()
    .default(now)
    .pipe(z.coerce.date())
    .refine((val) => val >= now(), {
      message: 'A data de partida não pode ser anterior ao momento atual.',
    }),
});

export type PaginationViagemDto = z.infer<typeof paginationViagemSchema>;
