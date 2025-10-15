import z from 'zod';
import { createPortoSchema } from './create-porto.dto';

export const updatePortoSchema = createPortoSchema.partial();

export type UpdatePortoDto = z.infer<typeof updatePortoSchema>;
