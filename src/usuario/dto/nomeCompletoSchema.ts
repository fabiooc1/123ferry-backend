import z from 'zod';

export const nomeCompletoSchema = z
  .string('formato inválido')
  .max(100, 'no máximo 100 caracteres');
