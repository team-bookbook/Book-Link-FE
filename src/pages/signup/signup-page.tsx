import { useState } from 'react';
import Input from '@components/input/input';
import ProgressBar from '@pages/signup/components/progress-bar';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');

  const [nickState, setNickState] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle');

  const isNameValid = name.trim().length > 0;
  const isNickBasicValid = /^[\p{Script=Hangul}A-Za-z0-9_]{2,12}$/u.test(nickname.trim());
  const canNext = isNameValid && nickState === 'valid';

  const handleDupCheck = async () => {
    if (!isNickBasicValid) {
      setNickState('invalid');
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
            isError={!isNameValid && name.length > 0}
            validationMessage={!isNameValid && name.length > 0 ? '이름을 입력해 주세요.' : undefined}
          />

          <div className='flex items-end gap-3'>
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
                maxLength={12}
                hasLength
                length={nickname.length}
                isError={nickState === 'invalid'}
                endIcon='cancel'
                validationMessage={
                  nickState === 'invalid' ? '2–12자, 한글/영문/숫자/언더스코어만 가능해요.' : undefined
                }
              />
            </div>

            <button
              type='button'
              onClick={handleDupCheck}
              disabled={dupBtnDisabled}
              className={[
                'h-[56px] shrink-0 rounded-[12px] px-4 text-[15px] font-semibold',
                'transition-opacity',
                dupBtnDisabled ? 'cursor-not-allowed opacity-40' : '',
                'bg-red-50 text-red-500',
              ].join(' ')}
            >
              {nickState === 'checking' ? '확인중…' : '중복확인'}
            </button>
          </div>
        </div>
      </div>
      <div className='pointer-events-none mt-auto bg-gradient-to-t from-white to-transparent px-5 pt-12 pb-8'>
        <button
          disabled={!canNext}
          className={[
            'pointer-events-auto h-[56px] w-full rounded-[18px] text-[17px] font-bold',
            canNext ? 'bg-primary-700 text-white active:opacity-90' : 'bg-gray-300 text-white',
          ].join(' ')}
        >
          다음
        </button>
      </div>
    </div>
  );
}
