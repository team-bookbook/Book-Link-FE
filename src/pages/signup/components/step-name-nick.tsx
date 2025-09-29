import { useState } from 'react';
import { cn } from '@libs/cn';
import Input from '@components/input/input';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import { useFunnel } from '@libs/funnel';
import { useSignupData } from '@pages/signup/signup-data-context';
import { checkNickname } from '@apis/auth';

export default function StepNameNick() {
  const { data, setData } = useSignupData();
  const { goNext } = useFunnel();

  const [touched, setTouched] = useState({ name: false, nickname: false });
  const [nickState, setNickState] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');

  const isNameValid = data.name.trim().length > 0;
  const isNickBasicValid = /^[\p{Script=Hangul}A-Za-z0-9_]{2,12}$/u.test(data.nickname.trim());

  const nameError = touched.name && !isNameValid;
  const nickFormatError = touched.nickname && !isNickBasicValid;
  const dupError = nickState === 'invalid' && isNickBasicValid;
  const showNickMessage = nickFormatError || dupError;

  const handleDupCheck = async () => {
    if (!isNickBasicValid) {
      setTouched((t) => ({ ...t, nickname: true }));
      setNickState('idle');
      return;
    }
    setNickState('checking');
    const res = await checkNickname(data.nickname);
    setNickState(res.available ? 'valid' : 'invalid');
  };

  const canNext = isNameValid && isNickBasicValid && nickState === 'valid';
  const dupBtnDisabled = !isNickBasicValid || nickState === 'checking';

  const onNext = () => {
    if (!canNext) {
      setTouched({ name: true, nickname: true });
      if (nickState === 'idle') void handleDupCheck();
      return;
    }
    goNext();
  };

  return (
    <div className='min-h-dvh flex-col gap-[2.5rem] text-gray-900'>
      <div className='flex-col gap-[3.5rem] px-[2rem] py-[2rem]'>
        <h1 className='title3 text-gray-900'>이름과 닉네임을 입력해 주세요.</h1>

        <div className='flex-col gap-[3rem]'>
          <Input
            id='name'
            label='이름'
            placeholder='이름을 입력해 주세요.'
            value={data.name}
            onChange={(e) => setData({ name: e.currentTarget.value })}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            isError={nameError}
            validationMessage={nameError ? '이름을 입력해 주세요.' : undefined}
          />

          <div className={cn('flex gap-[0.8rem]', showNickMessage ? 'items-start' : 'items-end')}>
            <div className='flex-1'>
              <Input
                id='nickname'
                label='닉네임'
                placeholder='닉네임을 입력해 주세요.'
                value={data.nickname}
                onChange={(e) => {
                  setData({ nickname: e.currentTarget.value });
                  setNickState('idle');
                }}
                onBlur={() => setTouched((t) => ({ ...t, nickname: true }))}
                maxLength={12}
                hasLength
                length={data.nickname.length}
                isError={showNickMessage}
                validationMessage={
                  nickFormatError
                    ? '2–12자, 한글/영문/숫자/언더스코어만 가능해요.'
                    : dupError
                      ? '이미 사용 중인 닉네임입니다.'
                      : undefined
                }
              />
            </div>

            <Button
              onClick={handleDupCheck}
              disabled={dupBtnDisabled}
              typoStyle='button4'
              roundStyle='rounded-[12px]'
              variant='dangerSoft'
              className='mt-[3rem] px-[2.4rem] py-[1.8rem]'
            >
              {nickState === 'checking' ? '확인중…' : nickState === 'valid' ? '사용가능' : '중복확인'}
            </Button>
          </div>
        </div>
      </div>

      <ButtonFrame>
        <Button fullWidth={true} className='py-[1.2rem]' onClick={onNext} disabled={!canNext}>
          다음
        </Button>
      </ButtonFrame>
    </div>
  );
}
