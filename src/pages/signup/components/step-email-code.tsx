import { useEffect, useState } from 'react';
import Input from '@components/input/input';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Icon from '@components/icon';
import { useFunnel } from '@libs/funnel';
import { useSignupData } from '@pages/signup/signup-data-context';
import { verifyEmailCode } from '@apis/auth';

export default function StepEmailCode() {
  const { data, setData } = useSignupData();
  const { goNext } = useFunnel();

  const [touched, setTouched] = useState(false);
  const [code, setCode] = useState(data.emailCode);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const codeValid = code.trim().length === 6;
  const showError = touched && !codeValid;

  useEffect(() => {
    const email = (localStorage.getItem('last_email') ?? '').trim();
    const saved = localStorage.getItem('last_email_code') ?? '';
    if (email && saved && email === data.email.trim().toLowerCase()) {
      setCode(saved);
    }
  }, [data.email]);

  useEffect(() => {
    setData({ emailCode: code });
  }, [code, setData]);
  useEffect(() => {
    setVerified(false);
  }, [code]);

  const onVerify = async () => {
    if (!codeValid) {
      setTouched(true);
      return;
    }
    setVerifying(true);
    try {
      const res = await verifyEmailCode(data.email, code);
      if (!res.verified) {
        setVerified(false);
        setTouched(true);
        return;
      }
      setVerified(true);
    } finally {
      setVerifying(false);
    }
  };

  const ctaLabel = verified ? '다음' : '인증하기';
  const onCta = verified ? goNext : onVerify;
  const ctaDisabled = verified ? false : !codeValid || verifying;

  return (
    <div className='min-h-dvh flex-col gap-[2.5rem] bg-white text-gray-900'>
      <div className='flex-col gap-[3.5rem] px-[2rem] py-[2rem]'>
        <h1 className='title3 text-gray-900'>이메일로 전송된 인증번호를 입력해 주세요.</h1>

        <div className='flex-col gap-[2.4rem]'>
          <div className='flex items-start gap-[0.8rem]'>
            <div className='flex-1'>
              <Input id='email' label='이메일' value={data.email} disabled={true} isError={false} />
            </div>
            <Button
              disabled
              typoStyle='button4'
              roundStyle='rounded-[12px]'
              variant='dangerSoft'
              className='mt-[3rem] px-[2.4rem] py-[1.8rem]'
            >
              인증하기
            </Button>
          </div>

          <Input
            id='email-code'
            label='인증번호'
            placeholder='인증번호를 입력해 주세요.'
            value={code}
            onChange={(e) => setCode(e.currentTarget.value.replace(/\D+/gu, '').slice(0, 6))}
            onBlur={() => setTouched(true)}
            maxLength={6}
            isError={showError}
            disabled={verified}
            validationMessage={showError ? '6자리 인증번호를 입력해 주세요.' : undefined}
          />

          {verified && (
            <div className='flex items-center gap-[0.8rem] rounded-[12px] bg-gray-800/10 px-[1.2rem] py-[1.0rem]'>
              <Icon name='info' width='1.8rem' height='1.8rem' className='text-gray-800' ariaHidden />
              <p className='caption2 text-gray-800'>인증번호가 등록되었습니다.</p>
            </div>
          )}
        </div>
      </div>

      <ButtonFrame>
        <Button fullWidth className='py-[1.2rem]' onClick={onCta} disabled={ctaDisabled}>
          {ctaLabel}
        </Button>
      </ButtonFrame>
    </div>
  );
}
