import { useState } from 'react';
import { cn } from '@libs/cn';
import Input from '@components/input/input';
import ProgressBar from '@pages/signup/components/progress-bar';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [touched, setTouched] = useState({ name: false, nickname: false });

  const [nickState, setNickState] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');

  const isNameValid = name.trim().length > 0;
  const isNickBasicValid = /^[\p{Script=Hangul}A-Za-z0-9_]{2,12}$/u.test(nickname.trim());

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
    await new Promise((r) => setTimeout(r, 600));
    setNickState('valid');
  };

  const dupBtnDisabled = !isNickBasicValid || nickState === 'checking';

  return (
    <div className='min-h-dvh flex-col gap-[2.5rem] bg-white text-gray-900'>
      <ProgressBar
        step={1}
        steps={5}
        heightClassName='h-[0.6rem]'
        roundedClassName='rounded-full'
        trackClassName='bg-gray-200'
        barClassName='bg-system-success'
        ariaLabel='회원가입 진행률'
      />

      <div className='flex-col gap-[3.5rem] px-[2rem]'>
        <h1 className='title3 text-gray-900'>이름과 닉네임을 입력해 주세요.</h1>

        <div className='flex-col gap-[3rem]'>
          <Input
            id='name'
            label='이름'
            placeholder='이름을 입력해 주세요.'
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            isError={nameError}
            validationMessage={nameError ? '이름을 입력해 주세요.' : undefined}
          />

          <div className={cn('flex gap-3', showNickMessage ? 'items-center' : 'items-end')}>
            <div className='flex-1'>
              <Input
                id='nickname'
                label='닉네임'
                placeholder='닉네임을 입력해 주세요.'
                value={nickname}
                onChange={(e) => {
                  setNickname(e.currentTarget.value);
                  setNickState('idle');
                }}
                onBlur={() => setTouched((t) => ({ ...t, nickname: true }))}
                maxLength={12}
                hasLength
                length={nickname.length}
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
              className='px-[2.4rem] py-[1.8rem]'
            >
              {nickState === 'checking' ? '확인중…' : '중복확인'}
            </Button>
          </div>
        </div>
      </div>

      <ButtonFrame>
        <Button fullWidth={true} className='py-[1.2rem]'>
          다음
        </Button>
      </ButtonFrame>
    </div>
  );
}
