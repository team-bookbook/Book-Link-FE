import { cn } from '@libs/cn';
import Icon from '@components/icon';
import React from 'react';

type CircleButtonName = 'cart' | 'back' | 'scan';

type Props = {
  name: CircleButtonName;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  rotate?: 90 | 180 | 270;
  iconSize?: number;
  ariaLabel?: string;
};

const iconName = (n: CircleButtonName) => n;

const base = 'flex-row-center rounded-full w-[4rem] h-[4rem] shadow-scroll-fixed';

export default function CircleButton({ name, className = '', onClick, rotate, iconSize = 2.0, ariaLabel }: Props) {
  const r: 90 | 180 | 270 | undefined = name === 'back' ? (rotate ?? 90) : undefined;

  const palette =
    name === 'scan'
      ? 'bg-primary-900 text-gray-white'
      : 'bg-gray-white text-gray-900 outline outline-gray-200 outline-offset-[-1px]';

  return (
    <button type='button' onClick={onClick} className={cn(base, palette, className)} aria-label={ariaLabel}>
      {r ? (
        <Icon name={iconName(name)} size={iconSize} rotate={r} ariaHidden />
      ) : (
        <Icon name={iconName(name)} size={iconSize} ariaHidden />
      )}
    </button>
  );
}
