import { useState } from 'react';
import Input from '@components/input/input';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import { useFunnel } from '@libs/funnel';
import { useSignupData } from '@pages/signup/signup-data-context';
import { submitSignup } from '@apis/auth';

function isStrong(pw: string) {
  return pw.length >= 8 && /[A-Za-z]/u.test(pw) && /\d/u.test(pw);
}

export default function StepPassword() {
  const { data, setData } = useSignupData();
  const { goNext } = useFunnel();

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
          <Input
            id='password'
            label='비밀번호'
            placeholder='비밀번호를 입력해 주세요.'
            value={data.password}
            passwordToggle
            onChange={(e) => setData({ password: e.currentTarget.value })}
            onBlur={() => setTouched((t) => ({ ...t, pw: true }))}
            isError={touched.pw && !pwValid}
            validationMessage={touched.pw && !pwValid ? '8자 이상, 영문과 숫자를 포함해 주세요.' : undefined}
          />

          <Input
            id='passwordConfirm'
            label='비밀번호 확인'
            placeholder='비밀번호를 한 번 더 입력해 주세요.'
            value={data.passwordConfirm}
            onChange={(e) => setData({ passwordConfirm: e.currentTarget.value })}
            onBlur={() => setTouched((t) => ({ ...t, pw2: true }))}
            isError={touched.pw2 && !match}
            validationMessage={touched.pw2 && !match ? '비밀번호가 일치하지 않습니다.' : undefined}
            passwordToggle
          />
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
