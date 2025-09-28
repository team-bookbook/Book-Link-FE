import { useState } from 'react';
import Input from '@components/input/input';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Icon from '@components/icon';
import { useFunnel } from '@libs/funnel';
import { useSignupData } from '@pages/signup/signup-data-context';
import { submitSignup } from '@apis/auth';

function isStrong(pw: string) {
  return pw.length >= 8 && /[A-Za-z]/u.test(pw) && /\d/u.test(pw);
}

export default function StepPassword() {
  const { data, setData } = useSignupData();
  const { goNext } = useFunnel();

  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [touched, setTouched] = useState<{ pw: boolean; pw2: boolean }>({ pw: false, pw2: false });
  const [submitting, setSubmitting] = useState(false);

  const pwValid = isStrong(data.password);
  const match = data.password.length > 0 && data.password === data.passwordConfirm;
  const canSubmit = pwValid && match && !submitting;

  const onSubmit = async () => {
    if (!canSubmit) {
      setTouched({ pw: true, pw2: true });
      return;
    }
    setSubmitting(true);
    try {
      await submitSignup({
        name: data.name,
        nickname: data.nickname,
        email: data.email,
        zip: data.zip,
        addr1: data.addr1,
        addr2: data.addr2,
        phone: data.phone,
        password: data.password,
      });
      goNext();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='min-h-dvh flex-col gap-[2.5rem] bg-white text-gray-900'>
      <div className='flex-col gap-[3.5rem] px-[2rem] py-[2rem]'>
        <h1 className='title3 text-gray-900'>비밀번호를 입력해 주세요.</h1>

        <div className='flex-col gap-[2.4rem]'>
          <div className='relative'>
            <Input
              id='password'
              label='비밀번호'
              type={showPw ? 'text' : 'password'}
              placeholder='비밀번호를 입력해 주세요.'
              value={data.password}
              onChange={(e) => setData({ password: e.currentTarget.value })}
              onBlur={() => setTouched((t) => ({ ...t, pw: true }))}
              isError={touched.pw && !pwValid}
              validationMessage={touched.pw && !pwValid ? '8자 이상, 영문과 숫자를 포함해 주세요.' : undefined}
            />
            <button
              type='button'
              onClick={() => setShowPw((s) => !s)}
              className='absolute right-[1.2rem] bottom-[1.2rem]'
              aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              <Icon name={showPw ? 'eye-off' : 'eye'} width='2.0rem' height='2.0rem' />
            </button>
          </div>

          <div className='relative'>
            <Input
              id='passwordConfirm'
              label='비밀번호 확인'
              type={showPw2 ? 'text' : 'password'}
              placeholder='비밀번호를 한 번 더 입력해 주세요.'
              value={data.passwordConfirm}
              onChange={(e) => setData({ passwordConfirm: e.currentTarget.value })}
              onBlur={() => setTouched((t) => ({ ...t, pw2: true }))}
              isError={touched.pw2 && !match}
              validationMessage={touched.pw2 && !match ? '비밀번호가 일치하지 않습니다.' : undefined}
            />
            <button
              type='button'
              onClick={() => setShowPw2((s) => !s)}
              className='absolute right-[1.2rem] bottom-[1.2rem]'
              aria-label={showPw2 ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              <Icon name={showPw2 ? 'eye-off' : 'eye'} width='2.0rem' height='2.0rem' />
            </button>
          </div>
        </div>
      </div>

      <ButtonFrame>
        <Button fullWidth className='py-[1.2rem]' onClick={onSubmit} disabled={!canSubmit}>
          가입하기
        </Button>
      </ButtonFrame>
    </div>
  );
}
