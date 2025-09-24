import { useNavigate } from 'react-router-dom';
import NotFound from '@images/404.svg';

export default function ErrorPage() {
  const nav = useNavigate();

  return (
    <div className='flex-col-between bg-gray-white h-dvh px-[2rem] pb-[1.2rem]'>
      <div />

      <div className='flex-col-center gap-[2rem]'>
        <img src={NotFound} alt='404' className='h-auto w-[22rem]' />
        <p className='title3 text-center text-gray-900'>존재하지 않는 페이지입니다.</p>
      </div>

      <button
        type='button'
        onClick={() => nav('/')}
        className='text-gray-white bg-primary-700 active:bg-primary-800 button3 w-full cursor-pointer rounded-[12px] py-[1.2rem]'
      >
        메인으로 돌아가기
      </button>
    </div>
  );
}
