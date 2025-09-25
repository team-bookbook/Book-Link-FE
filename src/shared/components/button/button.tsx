import React from 'react';
import { cn } from '@libs/cn';

type Variant = 'primarySoft' | 'primary' | 'neutral' | 'danger' | 'dangerSoft' | 'success' | 'outline';
type Typo = 'button4' | 'button3';
type Rounded = 'rounded-[12px]' | 'rounded-[8px]';

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: Variant;
  typoStyle?: Typo;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  roundStyle?: Rounded;
};

const base = 'flex-row-center transition active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed';

const variants: Record<Variant, string> = {
  primarySoft: 'text-primary-700 bg-secondary-100',
  primary: 'text-gray-white bg-primary-700',
  neutral: 'text-gray-700 bg-gray-50',
  danger: 'text-gray-white bg-system-error',
  dangerSoft: 'text-system-error bg-system-error-15',
  success: 'text-system-success bg-system-success',
  outline: 'text-gray-900 bg-gray-white outline outline-1 outline-gray-300 outline-offset-[-1px]',
};

export default function Button({
  variant = 'primary',
  typoStyle = 'button4',
  fullWidth = false,
  roundStyle = 'rounded-[12px]',
  loading = false,
  className,
  children,
  onClick,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const disabledOverride = (disabled ?? false) ? 'bg-gray-300 text-gray-white outline-0' : '';

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        base,
        variants[variant],
        fullWidth ? 'w-full' : 'w-auto',
        roundStyle,
        disabledOverride,
        typoStyle,
        className
      )}
    >
      <span className='truncate'>{children}</span>
    </button>
  );
}
