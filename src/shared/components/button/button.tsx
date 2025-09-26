import React from 'react';
import { cn } from '@libs/cn';
import { BUTTON_TOKENS } from '@components/button/styles/token';
import { variants, rounded, typo } from '@components/button/styles/button-varients';
import type { ButtonVariant, Typo, Rounded } from '@components/button/types/button';

export type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
  variant?: ButtonVariant;
  typoStyle?: Typo;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  roundStyle?: Rounded;
};

export default function Button({
  variant = 'primary',
  typoStyle = 'button3',
  fullWidth = false,
  roundStyle = 'rounded-[12px]',
  loading = false,
  className = 'p-[1.2rem]',
  children,
  onClick,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const disabledOverride = disabled ? BUTTON_TOKENS.disabled : '';

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
        BUTTON_TOKENS.base,
        variants[variant],
        fullWidth ? 'w-full' : 'w-auto',
        rounded[roundStyle === 'rounded-[8px]' ? 'md' : 'lg'],
        typo[typoStyle],
        disabledOverride,
        className
      )}
    >
      <span className='truncate'>{children}</span>
    </button>
  );
}
