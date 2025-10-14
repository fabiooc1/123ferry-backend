import z from 'zod';
import { createUsuarioSchema } from './create-usuario.dto';

export const updateUsuarioSchema = createUsuarioSchema.partial();

export type UpdateUsuarioDtoType = z.infer<typeof updateUsuarioSchema>;
