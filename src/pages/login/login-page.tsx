import { useState } from 'react';
import Input from '@components/input/input';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import KakaoLoginButton from '@pages/login/components/kakao-login-button';
import GoogleLoginButton from '@pages/login/components/google-login-button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');

  return (
    <div className='flex-col-between bg-gray-white min-h-dvh text-gray-900'>
      <div className='mx-auto w-full flex-col gap-[3.5rem] px-[2rem] pt-[2rem] pb-[1.6rem]'>
        <h1 className='title3 text-gray-900'>로그인</h1>

        <div className='flex-col gap-[2.0rem]'>
          <Input
            id='login-email'
            label='이메일'
            placeholder='이메일을 입력해 주세요.'
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            inputMode='email'
            autoCapitalize='none'
            autoCorrect='off'
            autoComplete='email'
          />

          <Input
            id='login-password'
            label='비밀번호'
            placeholder='비밀번호를 입력해 주세요.'
            value={pw}
            passwordToggle
            onChange={(e) => setPw(e.currentTarget.value)}
            autoComplete='current-password'
          />
        </div>

        <div className='flex items-center gap-[1.2rem]'>
          <div className='h-[0.1rem] flex-1 bg-gray-200' />
          <span className='caption2 text-gray-500'>또는</span>
          <div className='h-[0.1rem] flex-1 bg-gray-200' />
        </div>

        <div className='flex-col gap-[1.2rem]'>
          <KakaoLoginButton
            onClick={() => {
              /* TODO: 카카오 auth */
            }}
          />
          <GoogleLoginButton
            onClick={() => {
              /* TODO: 구글 auth */
            }}
          />
        </div>
      </div>

      <ButtonFrame>
        <Button fullWidth className='py-[1.2rem]'>
          로그인
        </Button>
      </ButtonFrame>
    </div>
  );
}
