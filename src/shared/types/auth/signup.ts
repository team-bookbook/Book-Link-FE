import { z } from 'zod';

export const nameNickSchema = z.object({
  name: z.string().trim().min(1, '이름을 입력해 주세요.'),
  nickname: z.string().trim().min(2, '닉네임은 2자 이상입니다.'),
});

export const emailSchema = z.object({
  email: z.string().trim().email('올바른 이메일 형식이 아닙니다.'),
});

export const emailCodeSchema = z.object({
  email: z.string().trim().email(),
  code: z.string().trim().length(6, '6자리 인증코드를 입력해 주세요.'),
});

export const addressSchema = z.object({
  zip: z.string().trim().min(1, '우편번호를 입력해 주세요.'),
  addr1: z.string().trim().min(1, '기본 주소를 입력해 주세요.'),
  addr2: z.string().trim().optional(),
});

export const phoneSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^0\d{1,2}-\d{3,4}-\d{4}$/, '예: 010-1234-5678'),
});

const passwordValidation = z
  .string()
  .min(8, '8자 이상 입력해 주세요.')
  .regex(/[A-Za-z]/, '영문을 포함해 주세요.')
  .regex(/\d/, '숫자를 포함해 주세요.');

export const passwordSchema = z
  .object({
    password: passwordValidation,
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
  })
  .refine((v) => v.password === v.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  });

export const loginSchema = emailSchema.and(
  z.object({
    password: passwordValidation,
  })
);

export const signupSchema = nameNickSchema.and(emailSchema).and(addressSchema).and(phoneSchema).and(passwordSchema);

export type NameNick = z.infer<typeof nameNickSchema>;
export type EmailOnly = z.infer<typeof emailSchema>;
export type EmailCode = z.infer<typeof emailCodeSchema>;
export type Address = z.infer<typeof addressSchema>;
export type Phone = z.infer<typeof phoneSchema>;
export type Passwords = z.infer<typeof passwordSchema>;
export type LoginPayload = z.infer<typeof loginSchema>;
export type SignupPayload = z.infer<typeof signupSchema>;
