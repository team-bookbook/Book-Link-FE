import { Outlet, useLocation } from 'react-router-dom';
import Header from '@layouts/header';
import BottomNav from '@layouts/bottom-nav';
import { useMemo } from 'react';
import { getHeaderForRoute } from '@layouts/header-config';

export default function Layout() {
  const { pathname, search } = useLocation();

  const headerProps = useMemo(() => getHeaderForRoute(pathname, search), [pathname, search]);

  return (
    <div className='flex h-full min-h-dvh flex-col bg-white text-gray-900'>
      <Header {...headerProps} />

      <main id='content' className='flex-1 overflow-x-hidden'>
        <div className='mx-auto w-full max-w-[43rem]'>
          <Outlet />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
