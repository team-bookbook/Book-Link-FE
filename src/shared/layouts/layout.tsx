import { Outlet } from 'react-router-dom';
import Header from './header';
import BottomNav from './bottom-nav';

export default function Layout() {
  return (
    <div className='h-full min-h-dvh flex-col bg-white text-gray-900'>
      <Header />

      <main id='content' className='flex-1 overflow-x-hidden'>
        <div className='scrollbar-hide mx-auto w-full max-w-[43rem]'>
          <Outlet />
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
