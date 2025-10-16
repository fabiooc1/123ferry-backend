import z from 'zod';
import { createRotaSchema } from './create-rota.dto';

export const updateRotaSchema = createRotaSchema.partial();

export type UpdateRotaDto = z.infer<typeof updateRotaSchema>;
