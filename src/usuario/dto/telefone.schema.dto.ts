import z from 'zod';

const phoneRegex = /^\(\d{2}\) \d{5}-\d{4}$/;

export const telefoneSchema = z
  .string()
  .min(1, 'O celular é obrigatório') // Primeiro checa se não está vazio
  .regex(phoneRegex, 'O formato do celular é inválido (use (99) 99999-9999)');
