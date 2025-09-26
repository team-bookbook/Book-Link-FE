import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import Header from '@layouts/header';
import Footer from '@layouts/footer';
import BottomNav from '@layouts/bottom-nav';
import { getHeaderForRoute } from '@layouts/header-config';
import { ROUTES } from '@routes/routes-config';
import { cn } from '@libs/cn';
import CircleButton from '@components/button/circle-button';
import useFloatingButtonGuard from '@hooks/use-floating-button';

type FloatingBtn =
  | { name: 'back'; onClick: () => void }
  | { name: 'scan'; onClick: () => void }
  | { name: 'cart'; onClick: () => void }
  | null;

function isUnder(pathname: string, root: string) {
  return pathname === root || pathname.startsWith(root + '/');
}

export default function Layout() {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();

  const headerProps = useMemo(() => getHeaderForRoute(pathname, search), [pathname, search]);

  const isAuthOrOnboarding = useMemo(
    () =>
      isUnder(pathname, ROUTES.LOGIN) ||
      isUnder(pathname, ROUTES.SIGNUP) ||
      isUnder(pathname, ROUTES.NOTIFICATION) ||
      isUnder(pathname, ROUTES.ONBOARDING),
    [pathname]
  );

  const currentTab = useMemo(() => {
    const params = new URLSearchParams(search);
    return params.get('tab') ?? 'library';
  }, [search]);

  const floatingBtn: FloatingBtn = isAuthOrOnboarding
    ? null
    : (() => {
        if (isUnder(pathname, ROUTES.HOME)) {
          return {
            name: 'back',
            onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
          };
        }
        if (isUnder(pathname, ROUTES.LIBRARY)) {
          if (currentTab === 'library') {
            return {
              name: 'scan',
              onClick: () => navigate(ROUTES.SCAN),
            };
          }
          if (currentTab === 'book') {
            return {
              name: 'cart',
              onClick: () => navigate(ROUTES.CART),
            };
          }
        }
        return null;
      })();

  // 바텀시트 겹침/노출 제어 (전체 폭 기준)
  const { visible: floatVisible, bottomStyle } = useFloatingButtonGuard();

  return (
    <div
      className={cn(
        'bg-gray-white min-h-dvh flex-col text-gray-900',
        isAuthOrOnboarding ? 'h-dvh overflow-hidden' : 'h-full'
      )}
    >
      <Header {...headerProps} />

      <main
        id='content'
        className={cn('scrollbar-hide flex-1 overflow-x-hidden', isAuthOrOnboarding && 'h-dvh overflow-hidden')}
      >
        <div className='mx-auto w-full'>
          <Outlet />
        </div>
        {!isAuthOrOnboarding && <Footer />}
      </main>

      {!isAuthOrOnboarding && <BottomNav />}

      {floatingBtn && (
        <div
          className={cn(
            'pointer-events-none fixed inset-x-0 z-[110] transition-opacity duration-200',
            floatVisible ? 'opacity-100' : 'opacity-0'
          )}
          style={bottomStyle}
        >
          {/* 컨테이너 폭을 바텀내브와 동일하게 중앙 정렬 */}
          <div className='relative left-1/2 w-full max-w-[43rem] -translate-x-1/2'>
            <div className='pointer-events-auto absolute right-[1.6rem]'>
              {floatingBtn.name === 'back' ? (
                <CircleButton name='back' onClick={floatingBtn.onClick} ariaLabel='맨 위로' />
              ) : floatingBtn.name === 'scan' ? (
                <CircleButton name='scan' onClick={floatingBtn.onClick} ariaLabel='책 스캔' />
              ) : (
                <CircleButton name='cart' onClick={floatingBtn.onClick} ariaLabel='장바구니' />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
