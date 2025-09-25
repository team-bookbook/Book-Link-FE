import { useMemo, useState, useCallback, type ReactNode } from 'react';
import { cn } from '@libs/cn';
import Icon from '@components/icon';

export type FaqItem = {
  id: string;
  question: string;
  answer: ReactNode;
  defaultOpen?: boolean;
};

type Props = {
  items: FaqItem[];
  className?: string;
  singleOpen?: boolean;
};

export default function Faq({ items, className = '', singleOpen = false }: Props) {
  const initialOpen = useMemo(() => {
    const set = new Set<string>();
    items.forEach((it) => {
      if (it.defaultOpen) set.add(it.id);
    });
    return set;
  }, [items]);

  const [openSet, setOpenSet] = useState<Set<string>>(initialOpen);

  const toggle = useCallback(
    (id: string) => {
      setOpenSet((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id);
        else {
          if (singleOpen) next.clear();
          next.add(id);
        }
        return next;
      });
    },
    [singleOpen]
  );

  return (
    <section className={cn('flex-col gap-[2.4rem]', className)} aria-label='자주 묻는 질문'>
      {items.map((it) => {
        const isOpen = openSet.has(it.id);
        const panelId = `faq-panel-${it.id}`;
        const btnId = `faq-btn-${it.id}`;

        return (
          <article key={it.id} className='rounded-[16px] p-[0.4rem]'>
            <div className='bg-gray-white rounded-[16px] p-[2rem]'>
              <button
                id={btnId}
                type='button'
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(it.id)}
                className='flex-row-between w-full text-left'
              >
                <h3 className='title6 pr-[1.2rem] text-gray-900'>{it.question}</h3>
                <Icon
                  name='arrow'
                  size={1.8}
                  ariaHidden
                  className={cn('transition-transform', isOpen ? 'rotate-90' : 'rotate-270')}
                />
              </button>

              <div
                id={panelId}
                role='region'
                aria-labelledby={btnId}
                className={cn(
                  'overflow-hidden transition-[grid-template-rows] duration-200 ease-out',
                  isOpen ? 'grid grid-rows-[1fr]' : 'grid grid-rows-[0fr]'
                )}
              >
                <div className='min-h-0'>
                  {typeof it.answer === 'string' ? (
                    <p className='body5 mt-[1.2rem] whitespace-pre-line text-gray-700'>{it.answer}</p>
                  ) : (
                    <div className='body5 mt-[1.2rem] text-gray-700'>{it.answer}</div>
                  )}
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
