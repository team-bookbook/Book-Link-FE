import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import { useSignupData } from '@pages/signup/signup-data-context';

import signupImg from '@images/signup-complete.png';

export default function StepComplete() {
  const { reset } = useSignupData();

  const onFinish = () => {
    try {
      window.localStorage.removeItem('signup_draft');
      window.localStorage.removeItem('last_email');
      window.localStorage.removeItem('last_email_code');
    } catch {}
    reset();
    window.location.assign('/onboarding');
  };

  return (
    <div className='h-dvh flex-col gap-[6rem] pt-[2.4rem] text-gray-900'>
      <section className='flex-col-center gap-[1rem]'>
        <h1 className='title3 text-center text-gray-900'>회원가입이 완료되었습니다.</h1>
        <p className='body5 text-center text-gray-500'>이제 사진 몇 장으로 나만의 도서관을 바로 운영할 수 있어요.</p>
      </section>
      <img src={signupImg} alt='Welcome illustration' className='mx-auto block h-auto w-[25rem]' />
      <ButtonFrame>
        <Button fullWidth className='py-[1.2rem]' onClick={onFinish}>
          완료
        </Button>
      </ButtonFrame>
    </div>
  );
}
