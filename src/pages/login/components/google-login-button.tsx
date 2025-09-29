import Icon from '@components/icon';

type Props = {
  onClick: () => void;
};

export default function GoogleLoginButton({ onClick }: Props) {
  return (
    <button
      type='button'
      onClick={onClick}
      aria-label='구글 로그인'
      className='bg-gray-white relative w-full cursor-pointer rounded-[12px] border border-gray-200 py-[1.2rem] pr-[1.2rem] pl-[4.8rem] text-gray-900 hover:bg-gray-50/30'
    >
      <span className='pointer-events-none absolute top-1/2 left-[1.6rem] -translate-y-1/2'>
        <Icon name='google' width='2.0rem' height='2.0rem' ariaHidden />
      </span>

      <span className='button2 block pr-[2rem] text-center'>구글 로그인</span>
    </button>
  );
}
