import Icon from '@components/icon';

type Props = {
  onClick: () => void;
};

export default function KakaoLoginButton({ onClick }: Props) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label='카카오 로그인'
      className='bg-etc-kakao relative w-full cursor-pointer rounded-[12px] py-[1.2rem] pr-[1.2rem] pl-[4.8rem] text-gray-900 hover:opacity-90'
    >
      <span className='pointer-events-none absolute top-1/2 left-[1.6rem] -translate-y-1/2'>
        <Icon name='kakao' width='2.0rem' height='2.0rem' ariaHidden />
      </span>

      <span className='button2 block pr-[2rem] text-center'>카카오 로그인</span>
    </button>
  );
}
