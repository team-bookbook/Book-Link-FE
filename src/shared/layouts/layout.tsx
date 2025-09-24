import { Outlet, useLocation } from 'react-router-dom';
import Header from '@layouts/header';
import BottomNav from '@layouts/bottom-nav';
import { useMemo } from 'react';
import { getHeaderForRoute } from '@layouts/header-config';
import Footer from './footer';

export default function Layout() {
  const { pathname, search } = useLocation();

  const headerProps = useMemo(() => getHeaderForRoute(pathname, search), [pathname, search]);

  return (
    <div className='bg-gray-white flex h-full min-h-dvh flex-col text-gray-900'>
      <Header {...headerProps} />

      <main id='content' className='scrollbar-hide flex-1 overflow-x-hidden'>
        <div className='mx-auto w-full'>
          <Outlet />
        </div>
        <Footer />
      </main>

      <BottomNav />
    </div>
  );
}
