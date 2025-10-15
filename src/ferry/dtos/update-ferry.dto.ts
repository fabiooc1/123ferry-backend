import z from 'zod';
import { createFerrySchema } from './create-ferry.dto';

export const updateFerrySchema = createFerrySchema.partial();

export type UpdateFerryDto = z.infer<typeof updateFerrySchema>;
