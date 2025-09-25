import type { ButtonVariant } from '@components/button/types/button';

export const variants: Record<ButtonVariant, string> = {
  primarySoft: 'text-primary-700 bg-secondary-100',
  primary: 'text-gray-white bg-primary-700',
  neutral: 'text-gray-700 bg-gray-50',
  danger: 'text-gray-white bg-system-error',
  dangerSoft: 'text-system-error bg-system-error-15',
  success: 'text-system-success bg-system-success',
  outline: 'text-gray-900 bg-gray-white outline outline-1 outline-gray-300 outline-offset-[-1px]',
};

export const rounded = {
  lg: 'rounded-[12px]',
  md: 'rounded-[8px]',
} as const;

export const typo = {
  button3: 'button3',
  button4: 'button4',
} as const;
