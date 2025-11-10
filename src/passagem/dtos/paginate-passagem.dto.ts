import { PassagemStatus } from 'src/generated/prisma';
import z from 'zod';

export const paginatePassagemSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(15).default(5),
  status: z.enum(PassagemStatus).optional(),
  passageiroNome: z.string().min(1).max(100).optional(),
});

export type PaginatePassagemDto = z.infer<typeof paginatePassagemSchema>;
