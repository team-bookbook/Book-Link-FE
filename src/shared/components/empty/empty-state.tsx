import { type ReactNode } from 'react';
import { cn } from '@libs/cn';
import Icon from '@components/icon';
import { getEmptyContent, type EmptyKey, type EmptyTips } from '@components/empty/constants/empty-state';

type EmptyStateProps = {
  kind: EmptyKey;
  titleOverride?: string;
  descriptionOverride?: ReactNode;
  tipsOverride?: EmptyTips;
  actions?: ReactNode;
  className?: string;
  illustrationAlt?: string;
};

function Tips({ title, items, className }: { title: string; items: string[]; className?: string }) {
  return (
    <section className={cn('flex w-full flex-col gap-[1.2rem] rounded-[12px] bg-gray-50 p-[1.6rem]', className)}>
      <div className='flex items-center gap-[0.6rem]'>
        <Icon name='info' size={1.6} ariaHidden className='text-gray-600' />
        <h3 className='subtitle3 text-gray-700'>{title}</h3>
      </div>
      <ul className='list-disc space-y-[0.6rem] pl-[1.6rem]'>
        {items.map((t) => (
          <li key={t} className='body3 text-gray-600'>
            {t}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function EmptyState({
  kind,
  titleOverride,
  descriptionOverride,
  tipsOverride,
  actions,
  className = '',
  illustrationAlt,
}: EmptyStateProps) {
  const c = getEmptyContent(kind);

  const title = titleOverride ?? c.title;
  const descNode =
    descriptionOverride ??
    (c.description
      ? c.description.split('\n').map((line) => (
          <span key={line}>
            {line}
            <br />
          </span>
        ))
      : null);
  const tips = tipsOverride ?? c.tips;

  return (
    <div className={cn('flex w-full flex-col items-center gap-[2rem] p-[2.4rem] text-center', className)} role='status'>
      <div className='select-none'>
        <img src={c.image} alt={illustrationAlt ?? title} className='h-auto w-[24rem] max-w-full' draggable={false} />
      </div>

      <div className='flex flex-col items-center gap-[0.8rem]'>
        <h2 className='title3 text-gray-900'>{title}</h2>
        {descNode ? <p className='body2 text-gray-600'>{descNode}</p> : null}
      </div>

      {actions ? <div className='flex items-center gap-[0.8rem]'>{actions}</div> : null}

      {tips ? <Tips title={tips.title} items={tips.items} className='mt-[0.4rem] max-w-[44rem]' /> : null}
    </div>
  );
}
