import z from 'zod';

export const paginationViagemSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().positive().default(6),
  rotaId: z.coerce.bigint().positive().optional(),
  dataPartida: z
    .union([z.string().datetime(), z.date()])
    .optional()
    .default(() => new Date()) // Use uma função para o default ser dinâmico
    .pipe(z.coerce.date())
    .refine(
      (val) => {
        const inputDate = val;
        const now = new Date();

        const startOfToday = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
        );

        return inputDate >= startOfToday;
      },
      {
        message: 'A data de partida não pode ser anterior a hoje.',
      },
    ),
});

export type PaginationViagemDto = z.infer<typeof paginationViagemSchema>;
