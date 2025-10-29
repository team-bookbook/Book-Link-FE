import Input from '@components/input/input';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import { useState } from 'react';
import { passwordSchema } from '@/shared/types/auth/signup';
import Icon from '@components/icon';

function PasswordResetPage() {
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const validation = passwordSchema.safeParse({ password, passwordConfirm });
  const canSubmit = validation.success;

  const handleSubmit = () => {
    const result = passwordSchema.safeParse({ password, passwordConfirm });

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setPasswordError(errors.password?.[0] || '');
      setPasswordConfirmError(errors.passwordConfirm?.[0] || '');
      return;
    }

    setPasswordError('');
    setPasswordConfirmError('');

    // TODO: 비밀번호 변경 API 호출
    console.log('비밀번호 변경:', password);
  };

  return (
    <div>
      <div className='flex-col gap-[1.5rem] px-[2rem] pt-[2.5rem]'>
        <div className='flex-col-center mb-[1.5rem] pt-[1rem]'>
          <Icon name='pw-lock' className='mb-[1.5rem] text-gray-300' size={9} ariaHidden />
          <div className='flex-col-center gap-[1rem]'>
            <h1 className='body1 text-gray-900'>비밀번호 재설정</h1>
            <h2 className='body5 text-gray-500'>BookLink에서 새롭게 사용할 비밀번호를 입력해 주세요.</h2>
          </div>
        </div>

        <div className='flex-col gap-[2.4rem]'>
          <Input
            id='new-password'
            label='새로운 비밀번호'
            placeholder='비밀번호를 입력해 주세요.'
            value={password}
            passwordToggle
            onChange={(e) => {
              setPassword(e.currentTarget.value);
              if (passwordError) setPasswordError('');
            }}
            onBlur={() => {
              if (password) {
                const result = passwordSchema.shape.password.safeParse(password);
                if (!result.success) {
                  setPasswordError(result.error.issues[0]?.message || '');
                }
              }
            }}
            autoComplete='new-password'
            isError={!!passwordError}
            validationMessage={passwordError}
          />
          <Input
            id='new-password-check'
            label='새로운 비밀번호 확인'
            placeholder='비밀번호를 한 번 더 입력해 주세요.'
            value={passwordConfirm}
            passwordToggle
            onChange={(e) => {
              setPasswordConfirm(e.currentTarget.value);
              if (passwordConfirmError) setPasswordConfirmError('');
            }}
            onBlur={() => {
              if (passwordConfirm && password) {
                const result = passwordSchema.safeParse({ password, passwordConfirm });
                if (!result.success) {
                  const errors = result.error.flatten().fieldErrors;
                  if (errors.passwordConfirm?.[0]) {
                    setPasswordConfirmError(errors.passwordConfirm[0]);
                  }
                }
              }
            }}
            autoComplete='new-password'
            isError={!!passwordConfirmError}
            validationMessage={passwordConfirmError}
          />
        </div>
      </div>

      <ButtonFrame>
        <Button fullWidth className='py-[1.2rem]' onClick={handleSubmit} disabled={!canSubmit}>
          변경
        </Button>
      </ButtonFrame>
    </div>
  );
}

export default PasswordResetPage;
