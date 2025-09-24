import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Icon from '@components/icon';

type LeftKind = 'none' | 'back' | 'logo' | 'close';
type ActionId = 'search' | 'cart' | 'share' | 'kebab' | 'bell' | 'close';

type TextCTA = { kind: 'link'; label: string; to: string } | { kind: 'button'; label: string; onClick: () => void };

export type HeaderProps = {
  left?: LeftKind;
  title?: React.ReactNode;
  actions?: ActionId[];
  notificationCount?: number;
  rightTextCTA?: TextCTA;
  searchMode?: boolean;
  searchPlaceholder?: string;
  onSearchSubmit?: (value: string) => void;
  onAction?: (id: ActionId) => void;
  safeTop?: boolean;
  className?: string;
};

const ACTION_ICON: Record<ActionId, string> = {
  search: 'search',
  cart: 'cart',
  share: 'share',
  kebab: 'more',
  bell: 'notification',
  close: 'close',
};

const ACTION_LABEL: Record<ActionId, string> = {
  search: '검색',
  cart: '장바구니',
  share: '공유',
  kebab: '더보기',
  bell: '알림',
  close: '닫기',
};

export default function Header({
  left = 'none',
  title,
  actions = [],
  notificationCount,
  rightTextCTA,
  searchMode = false,
  searchPlaceholder = '검색',
  onSearchSubmit,
  onAction,
  safeTop = true,
  className,
}: HeaderProps) {
  const nav = useNavigate();

  const handleAction = (id: ActionId) => {
    if (id === 'close' && !onAction) {
      nav(-1);
      return;
    }
    onAction?.(id);
  };

  return (
    <header
      role='banner'
      className={clsx(
        'shadow-top-fixed bg-gray-white sticky top-0 z-[var(--z-header)]',
        safeTop && 'pt-[env(safe-area-inset-top)]',
        className
      )}
    >
      <div className='mx-auto flex w-full items-center px-4'>
        {/* Left */}
        <div className='mr-2'>
          {left === 'logo' && (
            <Link to='/' aria-label='Home' className='flex items-center gap-2'>
              <img src='/logo-booklink.svg' alt='BookLink' className='h-6 w-auto' />
            </Link>
          )}

          {left === 'back' && (
            <RoundIconButton ariaLabel='뒤로가기' onClick={() => nav(-1)}>
              <Icon name='arrow-left' size={1.25} ariaHidden />
            </RoundIconButton>
          )}

          {left === 'close' && (
            <RoundIconButton ariaLabel='닫기' onClick={() => handleAction('close')}>
              <Icon name='close' size={1.25} ariaHidden />
            </RoundIconButton>
          )}

          {left === 'none' && <span className='inline-block h-9 w-9' />}
        </div>

        {/* Center */}
        <div className='min-w-0 flex-1'>
          {searchMode ? (
            <SearchPill placeholder={searchPlaceholder} onSubmit={onSearchSubmit} />
          ) : title != null ? (
            <h1 className='truncate text-base font-semibold'>{title}</h1>
          ) : null}
        </div>

        {/* Right */}
        <div className='ml-2 flex items-center gap-1'>
          {rightTextCTA ? (
            rightTextCTA.kind === 'link' ? (
              <Link to={rightTextCTA.to} className='ml-1 text-sm font-semibold text-sky-800 hover:opacity-80'>
                {rightTextCTA.label}
              </Link>
            ) : (
              <button
                type='button'
                onClick={rightTextCTA.onClick}
                className='ml-1 text-sm font-semibold text-sky-800 hover:opacity-80'
              >
                {rightTextCTA.label}
              </button>
            )
          ) : (
            actions.map((id) => (
              <ActionButton
                key={id}
                id={id}
                icon={ACTION_ICON[id]}
                label={ACTION_LABEL[id]}
                badge={id === 'bell' ? notificationCount : undefined}
                onClick={() => handleAction(id)}
              />
            ))
          )}
        </div>
      </div>
    </header>
  );
}

function RoundIconButton({
  children,
  ariaLabel,
  onClick,
}: {
  children: React.ReactNode;
  ariaLabel: string;
  onClick?: () => void;
}) {
  return (
    <button
      type='button'
      aria-label={ariaLabel}
      onClick={onClick}
      className='inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-black/5 active:opacity-80'
    >
      {children}
    </button>
  );
}

function ActionButton({
  icon,
  label,
  badge,
  onClick,
}: {
  id: ActionId;
  icon: string;
  label: string;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type='button'
      aria-label={label}
      className='relative inline-flex h-9 w-9 items-center justify-center rounded-xl hover:bg-black/5 active:opacity-80'
      onClick={onClick}
    >
      <Icon name={icon} size={1.25} ariaHidden />
      {typeof badge === 'number' && badge > 0 && (
        <span className='absolute -top-0.5 -right-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-400 px-1 text-[10px] leading-none font-bold text-white ring-2 ring-white'>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}

function SearchPill({ placeholder, onSubmit }: { placeholder: string; onSubmit?: (v: string) => void }) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = String(new FormData(e.currentTarget).get('q') ?? '');
        onSubmit?.(v);
      }}
    >
      <label className='group flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 py-2 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] focus-within:ring-2 focus-within:ring-sky-200'>
        <input
          name='q'
          inputMode='search'
          placeholder={placeholder}
          className='min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-gray-400'
        />
        <Icon name='search' size={1.25} ariaHidden />
      </label>
    </form>
  );
}
