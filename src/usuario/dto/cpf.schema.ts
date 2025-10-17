import z from 'zod';

export const cpfSchema = z
  .string()
  .regex(
    /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    'formato inválido, utilize obrigatoriamente 000.000.000-00',
  );
