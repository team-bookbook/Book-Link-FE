import { useNavigate } from 'react-router-dom';
import NotFound from '@images/404.svg';
import Button from '@components/button/button';

export default function ErrorPage() {
  const nav = useNavigate();

  return (
    <div className='flex-col-between bg-gray-white h-dvh px-[2rem] pb-[1.2rem]'>
      <div />

      <div className='flex-col-center gap-[2rem]'>
        <img src={NotFound} alt='404' className='h-auto w-[22rem]' />
        <p className='title3 text-center text-gray-900'>존재하지 않는 페이지입니다.</p>
      </div>

      <Button fullWidth={true} onClick={() => nav('/')}>
        메인으로 돌아가기
      </Button>
    </div>
  );
}
