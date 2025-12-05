import { Link, useNavigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import Icon from '@components/icon';
import SearchBar from '@components/search-bar';
import { ROUTES } from '@routes/routes-config';
import { useMemo } from 'react';
import { modal } from '@libs/modal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authMutations } from '@apis/auth/auth-mutations';

type LeftKind = 'none' | 'back' | 'logo' | 'close';
export type ActionId = 'search' | 'cart' | 'share' | 'kebab' | 'bell' | 'close' | 'logout';

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
  logout: 'logout',
};

const ACTION_LABEL: Record<ActionId, string> = {
  search: '검색',
  cart: '장바구니',
  share: '공유',
  kebab: '더보기',
  bell: '알림',
  close: '닫기',
  logout: '로그아웃',
};

function isUnder(pathname: string, root: string) {
  return pathname === root || pathname.startsWith(root + '/');
}
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
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const queryClient = useQueryClient();
  const isSetting = useMemo(() => isUnder(pathname, ROUTES.SETTING), [pathname]);
  const isBoard = useMemo(() => isUnder(pathname, ROUTES.BOARD), [pathname]);
  const NoShadow = isSetting || isBoard;

  const logoutMutation = useMutation({
    ...authMutations.POST_LOGOUT(),
    onSuccess: () => {
      // 로그아웃 시 모든 캐시 초기화
      queryClient.clear();
    },
  });

  const handleAction = async (id: ActionId) => {
    if (id === 'bell') {
      navigate(ROUTES.NOTIFICATION);
      return;
    }
    if (id === 'close' && !onAction) {
      navigate(-1);
      return;
    }
    if (id === 'logout' && !onAction) {
      const result = await modal.confirm({
        title: '로그아웃 하시겠습니까?',
        confirmText: '로그아웃',
        cancelText: '취소',
      });

      if (result.ok) {
        try {
          await logoutMutation.mutateAsync();
          localStorage.removeItem('accessToken');
          navigate(ROUTES.LOGIN);
        } catch (error) {
          console.error('로그아웃 실패:', error);
          localStorage.removeItem('accessToken');
          navigate(ROUTES.LOGIN);
        }
      }
      return;
    }
    onAction?.(id);
  };

  return (
    <header
      role='banner'
      className={clsx(
        'bg-gray-white sticky top-0 z-[var(--z-header)]',
        safeTop && 'pt-[env(safe-area-inset-top)]',
        !NoShadow && 'shadow-top-fixed',
        className
      )}
    >
      <div className={clsx('mx-auto flex w-full items-center px-[2rem]', searchMode ? 'py-[0.5rem]' : 'py-[1.5rem]')}>
        {/* Left */}
        <div className='mr-2'>
          {left === 'logo' && (
            <Link to='/' aria-label='Home'>
              <Icon name='logo-header' width={11.3} height={3} />
            </Link>
          )}
          {left === 'back' && (
            <button
              className='cursor-pointer text-gray-900 hover:opacity-80'
              aria-label='뒤로가기'
              onClick={() => navigate(-1)}
            >
              <Icon name='back' size={2.4} ariaHidden />
            </button>
          )}
          {left === 'close' && (
            <button className='cursor-pointer' aria-label='닫기' onClick={() => handleAction('close')}>
              <Icon name='close' size={2.4} ariaHidden />
            </button>
          )}
          {left === 'none' && <span className='inline-block' />}
        </div>

        {/* Center */}
        <div className='min-w-0 flex-1'>
          {searchMode ? (
            <SearchBar placeholder={searchPlaceholder} onSubmit={onSearchSubmit} />
          ) : title != null ? (
            <h1 className='title5 truncate'>{title}</h1>
          ) : null}
        </div>

        {/* Right */}
        <div className='flex items-center gap-[1rem]'>
          {rightTextCTA ? (
            rightTextCTA.kind === 'link' ? (
              <Link to={rightTextCTA.to} className='caption1 text-primary-900 hover:opacity-80'>
                {rightTextCTA.label}
              </Link>
            ) : (
              <button
                type='button'
                onClick={rightTextCTA.onClick}
                className='caption1 text-primary-900 hover:opacity-80'
              >
                {rightTextCTA.label}
              </button>
            )
          ) : (
            actions.map((id) =>
              id === 'bell' ? (
                <BellButton
                  key='bell'
                  count={notificationCount}
                  label={ACTION_LABEL.bell}
                  onClick={() => handleAction('bell')}
                />
              ) : (
                <ActionButton
                  key={id}
                  icon={ACTION_ICON[id]}
                  label={ACTION_LABEL[id]}
                  onClick={() => handleAction(id)}
                />
              )
            )
          )}
        </div>
      </div>
    </header>
  );
}

function ActionButton({ icon, label, onClick }: { icon: string; label: string; onClick?: () => void }) {
  return (
    <button
      type='button'
      className='cursor-pointer text-gray-900 hover:opacity-80'
      aria-label={label}
      onClick={onClick}
    >
      <Icon name={icon} size={2.4} ariaHidden />
    </button>
  );
}

function BellButton({ count, label, onClick }: { count?: number; label: string; onClick?: () => void }) {
  return (
    <button type='button' aria-label={label} onClick={onClick} className='relative'>
      <Icon name='notification' size={2.4} ariaHidden className='cursor-pointer text-gray-900 hover:opacity-80' />
      {typeof count === 'number' && count > 0 && (
        <span className='absolute top-[-0.4rem] right-[-0.4rem] inline-flex h-[1.8rem] min-w-[1.8rem] items-center justify-center rounded-full bg-sky-400 px-[0.4rem] text-[1.0rem] leading-none font-bold text-white ring-[0.2rem] ring-white'>
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  );
}
