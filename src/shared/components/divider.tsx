import { cn } from '@libs/cn';

type Props = {
  className?: string;
  'aria-label'?: string;
};

export default function Divider({ className = '', 'aria-label': ariaLabel }: Props) {
  return (
    <hr
      role='separator'
      aria-orientation='horizontal'
      aria-label={ariaLabel}
      className={cn('h-[0.3rem] w-full border-0 bg-gray-100', className)}
    />
  );
}
