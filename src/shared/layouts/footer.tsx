import { ROUTES } from '@routes/routes-config';
import { useMemo } from 'react';
import { cn } from '@libs/cn';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@components/icon';
function isUnder(pathname: string, root: string) {
  return pathname === root || pathname.startsWith(root + '/');
}
export default function Footer() {
  const { pathname } = useLocation();
  const isSetting = useMemo(() => isUnder(pathname, ROUTES.SETTING), [pathname]);
  const isHome = useMemo(() => isUnder(pathname, ROUTES.HOME), [pathname]);
  const BackgroundGray = isSetting || isHome;
  return (
    <footer className={cn('flex-col-items-start gap-[2.5rem] px-[2.5rem] py-[4rem]', BackgroundGray && 'bg-gray-50')}>
      <div className='flex-col gap-[0.8rem]'>
        <Icon className='text-[#B5B5B5]' name='footer' width={16.5} height={4.5} />
        <p className='caption5 text-gray-500'>booklink@gmail.com</p>
      </div>

      <div className='flex-col pb-[3rem]'>
        <nav aria-label='legal' className='mb-[0.6rem]'>
          <ul className='caption5 flex gap-[0.8rem] font-semibold'>
            <li>
              <Link to='/privacy' className='inline-block py-[0.4rem] text-gray-700 focus:underline focus:outline-none'>
                개인정보처리방침
              </Link>
            </li>
            <li>
              <Link
                to='/terms-of-service'
                className='inline-block py-[0.4rem] text-gray-700 focus:underline focus:outline-none'
              >
                이용약관
              </Link>
            </li>
          </ul>
        </nav>

        <p className='caption5 text-gray-500'>© 2025 BookLink. All rights reserved.</p>
      </div>
    </footer>
  );
}
