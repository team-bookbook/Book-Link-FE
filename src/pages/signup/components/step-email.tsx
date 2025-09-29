import { useState } from 'react';
import Input from '@components/input/input';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import { useFunnel } from '@libs/funnel';
import { useSignupData } from '@pages/signup/signup-data-context';
import { sendEmailCode } from '@apis/auth';

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(v.trim());
}

export default function StepEmail() {
  const { data, setData } = useSignupData();
  const { to } = useFunnel();

  const [touched, setTouched] = useState(false);
  const [sending, setSending] = useState(false);

  const valid = isValidEmail(data.email);
  const showError = touched && !valid;

  const requestCode = async () => {
    if (!valid) {
      setTouched(true);
      return;
    }
    setSending(true);
    try {
      const res = await sendEmailCode(data.email);
      alert(`인증코드: ${res.code}`);
      to('emailCode');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className='min-h-dvh flex-col gap-[2.5rem] text-gray-900'>
      <div className='flex-col gap-[3.5rem] px-[2rem] py-[2rem]'>
        <h1 className='title3 text-gray-900'>이메일 인증을 위해 이메일을 입력해 주세요.</h1>

        <div className='flex-col gap-[3rem]'>
          <div className='flex items-start gap-[0.8rem]'>
            <div className='flex-1'>
              <Input
                id='email'
                label='이메일'
                type='email'
                placeholder='example@gmail.com'
                value={data.email}
                onChange={(e) => setData({ email: e.currentTarget.value })}
                onBlur={() => setTouched(true)}
                isError={showError}
                validationMessage={showError ? '올바른 이메일 형식을 입력해 주세요.' : undefined}
              />
            </div>

            <Button
              onClick={requestCode}
              disabled={!valid || sending}
              typoStyle='button4'
              roundStyle='rounded-[12px]'
              variant='dangerSoft'
              className='mt-[3rem] px-[2.4rem] py-[1.8rem]'
            >
              {sending ? '전송중…' : '인증하기'}
            </Button>
          </div>
        </div>
      </div>

      <ButtonFrame>
        <Button fullWidth={true} className='py-[1.2rem]' onClick={requestCode} disabled={!valid || sending}>
          인증하기
        </Button>
      </ButtonFrame>
    </div>
  );
}
