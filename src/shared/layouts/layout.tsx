import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import Header from '@layouts/header';
import Footer from '@layouts/footer';
import BottomNav from '@layouts/bottom-nav';
import { getHeaderForRoute } from '@layouts/header-config';
import { ROUTES } from '@routes/routes-config';
import { cn } from '@libs/cn';

function isUnder(pathname: string, root: string) {
  return pathname === root || pathname.startsWith(root + '/');
}

export default function Layout() {
  const { pathname, search } = useLocation();

  const headerProps = useMemo(() => getHeaderForRoute(pathname, search), [pathname, search]);

  const isAuthOrOnboarding = useMemo(
    () =>
      isUnder(pathname, ROUTES.LOGIN) ||
      isUnder(pathname, ROUTES.SIGNUP) ||
      isUnder(pathname, ROUTES.NOTIFICATION) ||
      isUnder(pathname, ROUTES.ONBOARDING),
    [pathname]
  );

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
    </div>
  );
}
