import { Outlet, useLocation, useNavigate, matchPath } from 'react-router-dom';
import { useMemo } from 'react';
import Header from '@layouts/header';
import Footer from '@layouts/footer';
import BottomNav from '@layouts/bottom-nav';
import { getHeaderForRoute } from '@layouts/header-config';
import { ROUTES } from '@routes/routes-config';
import { cn } from '@libs/cn';
import CircleButton from '@components/button/circle-button';
import useFloatingButtonGuard from '@hooks/use-floating-button';
import { HeaderProvider, useHeaderContext } from '@contexts/header-context';

type FloatingBtn =
  | { name: 'back'; onClick: () => void }
  | { name: 'scan'; onClick: () => void }
  | { name: 'cart'; onClick: () => void }
  | { name: 'create'; onClick: () => void }
  | { name: 'add'; onClick: () => void }
  | null;

function isUnder(pathname: string, root: string) {
  return pathname === root || pathname.startsWith(root + '/');
}

export default function Layout() {
  return (
    <HeaderProvider>
      <LayoutContent />
    </HeaderProvider>
  );
}

function LayoutContent() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { override } = useHeaderContext();

  const isOnboarding = useMemo(() => isUnder(pathname, ROUTES.ONBOARDING), [pathname]);
  const isChat = useMemo(() => isUnder(pathname, ROUTES.CHAT), [pathname]);
  const isCart = useMemo(() => isUnder(pathname, ROUTES.CART), [pathname]);
  const isChatRoom = useMemo(() => {
    const pattern = typeof ROUTES.CHAT_ROOM === 'function' ? ROUTES.CHAT_ROOM(':id') : `${ROUTES.CHAT}/:id`;
    return matchPath({ path: pattern, end: true }, pathname) != null;
  }, [pathname]);
  const isReviewCreate = useMemo(() => {
    return matchPath({ path: ROUTES.REVIEW_CREATE(':id') }, pathname) != null;
  }, [pathname]);
  const isBoardCreate = useMemo(() => {
    return matchPath({ path: ROUTES.BOARD_DETAIL(':id') }, pathname) != null;
  }, [pathname]);

  const isNoneFooter = useMemo(
    () =>
      isUnder(pathname, ROUTES.LOGIN) ||
      isUnder(pathname, ROUTES.SIGNUP) ||
      isUnder(pathname, ROUTES.NOTIFICATION) ||
      isUnder(pathname, ROUTES.LIBRARY_CREATE) ||
      isUnder(pathname, ROUTES.BOOK_CREATE) ||
      isUnder(pathname, ROUTES.PASSWORD_RESET) ||
      isUnder(pathname, ROUTES.EDIT_PROFILE) ||
      isUnder(pathname, ROUTES.BOARD_CREATE) ||
      isReviewCreate ||
      isOnboarding ||
      isBoardCreate,
    [pathname]
  );

  // 헤더는 온보딩에서만 숨김
  const showHeader = !isOnboarding;

  // override가 있으면 override 사용, 없으면 기본 헤더 설정 사용
  const baseHeaderProps = useMemo(
    () => (showHeader ? getHeaderForRoute(pathname, search) : null),
    [pathname, search, showHeader]
  );

  const headerProps = useMemo(() => {
    if (!showHeader) return null;
    if (override) {
      return {
        ...override,
      };
    }
    return baseHeaderProps;
  }, [showHeader, override, baseHeaderProps]);

  const currentTab = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get('tab') ?? 'books';
  }, [search]);

  const floatingBtn: FloatingBtn = isNoneFooter
    ? null
    : (() => {
        if (isUnder(pathname, ROUTES.BOARD)) {
          const params = new URLSearchParams(search);
          const boardTab = params.get('tab');
          const targetRoute = boardTab === 'reading' ? ROUTES.GROUP_CREATE : ROUTES.BOARD_CREATE;
          return { name: 'add', onClick: () => navigate(targetRoute) };
        }
        if (isUnder(pathname, ROUTES.HOME)) {
          return { name: 'back', onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }) };
        }
        if (isUnder(pathname, ROUTES.LIBRARY)) {
          if (currentTab === 'libraries') {
            return { name: 'scan', onClick: () => navigate(ROUTES.SCAN) };
          }
          if (currentTab === 'books') {
            return { name: 'cart', onClick: () => navigate(ROUTES.CART) };
          }
        }
        return null;
      })();

  const { visible: floatVisible, bottomStyle } = useFloatingButtonGuard();

  return (
    <div
      className={cn(
        'bg-gray-white min-h-dvh flex-col text-gray-900',
        isNoneFooter ? 'h-dvh overflow-hidden' : 'h-full'
      )}
    >
      {showHeader && headerProps && <Header {...headerProps} />}

      <main id='content' className={cn('scrollbar-hide h-full flex-1 overflow-x-hidden')}>
        <div className='mx-auto w-full'>
          <Outlet />
        </div>
        {!isNoneFooter && !isChat && !isCart && <Footer />}
      </main>

      {!isNoneFooter && !isChatRoom && <BottomNav />}

      {floatingBtn && (
        <div
          className={cn(
            'pointer-events-none fixed inset-x-0 z-[var(--z-bottom-nav)] transition-opacity duration-200',
            floatVisible ? 'opacity-100' : 'opacity-0'
          )}
          style={bottomStyle}
        >
          <div className='relative left-1/2 w-full max-w-[43rem] -translate-x-1/2'>
            <div className='pointer-events-auto absolute right-[1.6rem]'>
              {floatingBtn.name === 'back' ? (
                <CircleButton name='back' onClick={floatingBtn.onClick} ariaLabel='맨 위로' />
              ) : floatingBtn.name === 'scan' ? (
                <CircleButton name='scan' onClick={floatingBtn.onClick} ariaLabel='책 스캔' />
              ) : floatingBtn.name === 'cart' ? (
                <CircleButton name='cart' onClick={floatingBtn.onClick} ariaLabel='장바구니' />
              ) : floatingBtn.name === 'add' ? (
                <CircleButton name='add' onClick={floatingBtn.onClick} ariaLabel='게시글 추가' />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
