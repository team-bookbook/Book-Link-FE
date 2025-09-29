import { useState } from 'react';
import Input from '@components/input/input';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import { useFunnel } from '@libs/funnel';
import { useSignupData } from '@pages/signup/signup-data-context';

function onlyDigits(v: string) {
  return v.replace(/\D+/gu, '');
}

function formatPhone(v: string) {
  const d = onlyDigits(v);
  if (d.length <= 3) return d;
  if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`;
}

function isValidPhone(v: string) {
  return /^01[0-9]-\d{3,4}-\d{4}$/u.test(v);
}

export default function StepPhone() {
  const { data, setData } = useSignupData();
  const { goNext } = useFunnel();

  const [touched, setTouched] = useState(false);

  const onChange = (val: string) => {
    const fmt = formatPhone(val);
    setData({ phone: fmt });
  };

  const valid = isValidPhone(data.phone);

  const onNext = () => {
    if (!valid) {
      setTouched(true);
      return;
    }
    goNext();
  };

  return (
    <div className='bg-gray-white min-h-dvh flex-col gap-[2.5rem] text-gray-900'>
      <div className='flex-col gap-[3.5rem] px-[2rem] py-[2rem]'>
        <h1 className='title3 text-gray-900'>전화번호를 입력해 주세요.</h1>
        <Input
          id='phone'
          label='휴대폰 번호'
          placeholder='휴대폰 번호를 입력해 주세요.'
          value={data.phone}
          onChange={(e) => onChange(e.currentTarget.value)}
          onBlur={() => setTouched(true)}
          isError={touched && !valid}
          validationMessage={touched && !valid ? '예: 010-1234-5678' : undefined}
        />
      </div>

      <ButtonFrame>
        <Button fullWidth className='py-[1.2rem]' onClick={onNext} disabled={!valid}>
          다음
        </Button>
      </ButtonFrame>
    </div>
  );
}
