import z from 'zod';
import { createViagemSchema } from './create-viagem.dto';

export const updateViagemSchema = createViagemSchema.partial();

export type UpdateViagemDto = z.infer<typeof updateViagemSchema>;
