import z from 'zod';

const MIN_LENGTH = 5;
const MIN_LENGTH_MSG = `deve ter no mínimo ${MIN_LENGTH} caracteres.`;

const HAS_DIGIT = /(?=.*\d)/;
const HAS_DIGIT_MSG = 'deve conter pelo menos um número.';

const HAS_UPPER = /(?=.*[A-Z])/;
const HAS_UPPER_MSG = 'deve conter pelo menos uma letra maiúscula.';

const HAS_LOWER = /(?=.*[a-z])/;
const HAS_LOWER_MSG = 'deve conter pelo menos uma letra minúscula.';

const HAS_SPECIAL = /(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/;
const HAS_SPECIAL_MSG = 'deve conter pelo menos um caractere especial.';

export const createUsuarioSchema = z.object({
  nomeCompleto: z.string('campo inválido').max(100, 'no máximo 100 caracteres'),
  email: z.email('formato do e-mail é inválido'),
  cpf: z
    .string()
    .regex(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      'formato inválido, utilize obrigatoriamente 000.000.000-00',
    ),
  dataNascimento: z.coerce
    .date('formato inválido')
    .max(new Date(), 'a data não pode ser no futuro'),
  senha: z
    .string('formato inválido')
    .min(MIN_LENGTH, MIN_LENGTH_MSG)
    .refine((val) => HAS_DIGIT.test(val), HAS_DIGIT_MSG)
    .refine((val) => HAS_UPPER.test(val), HAS_UPPER_MSG)
    .refine((val) => HAS_LOWER.test(val), HAS_LOWER_MSG)
    .refine((val) => HAS_SPECIAL.test(val), HAS_SPECIAL_MSG),
});

export type CreateUsuarioDtoType = z.infer<typeof createUsuarioSchema>;
