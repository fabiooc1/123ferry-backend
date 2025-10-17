import z from 'zod';

export const dataNascimentoSchema = z.coerce
  .date('formato inválido')
  .max(new Date(), 'a data não pode ser no futuro');
