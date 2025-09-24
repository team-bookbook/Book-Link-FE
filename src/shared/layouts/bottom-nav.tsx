import { NAV_ITEMS } from '@constants/bottom-nav';
import Icon from '@components/icon';
import { cn } from '@libs/cn';
import { useLocation, useNavigate } from 'react-router-dom';

const BottomNav = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => pathname === path;

  return (
    <div className='bg-gray-white shadow-bottom-fixed sticky bottom-0 flex w-full justify-between px-[1.6rem] pt-[1.2rem] pb-[2.7rem]'>
      {NAV_ITEMS.map(({ label, path, icon }) => {
        const active = isActive(path);

        return (
          <button
            key={label}
            type='button'
            className='flex-col-center h-[4.2rem] w-[6rem] cursor-pointer gap-[0.2rem]'
            onClick={() => navigate(path)}
          >
            <Icon name={icon} className={active ? 'text-primary-900' : 'text-gray-400'} size={2.4} />
            <p className={cn('caption6 text-gray-400', active && 'text-primary-900')}>{label}</p>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
