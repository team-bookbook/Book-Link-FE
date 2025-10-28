import { useState } from 'react';
import Input from '@components/input/input';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import KakaoLoginButton from '@pages/login/components/kakao-login-button';
import GoogleLoginButton from '@pages/login/components/google-login-button';
import { authMutations } from '@apis/auth/auth-mutations';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<'format' | 'login' | null>(null);
  const [pw, setPw] = useState('');
  const [pwError, setPwError] = useState(false);
  const navigate = useNavigate();

  const loginMutation = useMutation(authMutations.POST_LOGIN());

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const getEmailErrorMessage = () => {
    if (emailError === 'format') return '이메일 형식을 확인해주세요.';
    if (emailError === 'login') return '이메일 또는 비밀번호를 확인해주세요.';
    return '';
  };

  const submit = () => {
    const isEmailValid = validateEmail(email);
    const isPwValid = pw.length > 0;

    setEmailError(isEmailValid ? null : 'format');
    setPwError(!isPwValid);

    if (!isEmailValid || !isPwValid) {
      return;
    }

    loginMutation.mutate(
      {
        email,
        password: pw,
      },
      {
        onSuccess: (data) => {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          navigate(ROUTES.HOME);
        },
        onError: (error) => {
          console.error('로그인 실패:', error);
          setEmailError('login');
          setPwError(false);
        },
      }
    );
  };

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
            onChange={(e) => {
              setEmail(e.currentTarget.value);
              if (emailError) setEmailError(null);
            }}
            onBlur={() => {
              if (email && !validateEmail(email)) {
                setEmailError('format');
              }
            }}
            inputMode='email'
            autoCapitalize='none'
            autoCorrect='off'
            autoComplete='email'
            isError={!!emailError}
            validationMessage={getEmailErrorMessage()}
          />

          <Input
            id='login-password'
            label='비밀번호'
            placeholder='비밀번호를 입력해 주세요.'
            value={pw}
            passwordToggle
            onChange={(e) => {
              setPw(e.currentTarget.value);
              if (pwError) setPwError(false);
            }}
            autoComplete='current-password'
            isError={pwError}
            validationMessage={pwError ? '비밀번호를 입력해주세요.' : ''}
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
        <Button fullWidth className='py-[1.2rem]' onClick={submit} disabled={loginMutation.isPending}>
          {loginMutation.isPending ? '로그인 중...' : '로그인'}
        </Button>
      </ButtonFrame>
    </div>
  );
}
