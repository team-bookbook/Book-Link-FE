import { iconColorMap, inputClassMap } from '@components/input/styles/input-varients';
import { cn } from '@libs/cn';
import Icon from '@components/icon';
import React, { useId, useState } from 'react';
import { defineInputState } from '@components/input/utils/input-state';

type BaseProps = {
  label?: string;
  isError?: boolean;
  isValid?: boolean;
  hasLength?: boolean;
  maxLength?: number;
  defaultMessage?: string;
  validationMessage?: string;
  className?: string;
  length?: number;
  startIcon?: string;
  endIcon?: string;
  passwordToggle?: boolean;
  onPasswordToggleChange?: (show: boolean) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>) => void;
};

type InputLineProps = BaseProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onBlur' | 'children'> & {
    multiline?: false;
  };

type TextAreaProps = BaseProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onBlur' | 'children'> & {
    multiline: true;
  };

type InputProps = InputLineProps | TextAreaProps;

export default function Input(props: InputProps) {
  const autoId = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const {
    label,
    className,
    startIcon,
    endIcon,
    isError,
    isValid,
    hasLength = false,
    maxLength = 50,
    defaultMessage,
    validationMessage,
    onBlur,
    passwordToggle = false,
    onPasswordToggleChange,
    multiline,
    length,
    id: idProp,
    ...rest
  } = props;

  const id = idProp ?? autoId;

  const inputState = defineInputState(isError, isFocused, isValid);
  const messageToShow = validationMessage ?? defaultMessage;

  const borderClass = inputClassMap[inputState];
  const iconColorClass = iconColorMap[inputState];

  const handleBlur = (e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const togglePw = () => {
    const next = !showPw;
    setShowPw(next);
    onPasswordToggleChange?.(next);
  };

  const commonFieldClass = 'w-full bg-transparent text-gray-900 outline-none placeholder:text-gray-500';
  const isLine = !multiline;
  const hasRightAddon = isLine && (passwordToggle || !!endIcon);
  const leftPadding = startIcon ? 'pl-[3.6rem]' : 'pl-[1.6rem]';
  const rightPadding = hasRightAddon ? 'pr-[3.6rem]' : 'pr-[1.6rem]';

  return (
    <div className='flex-col gap-[0.8rem]'>
      {label && (
        <label htmlFor={id} className='body5'>
          {label}
        </label>
      )}

      <div
        className={cn(
          'caption1 relative w-full rounded-[12px] bg-gray-50',
          isLine ? 'flex h-[5.6rem] items-center' : 'min-h-[20rem]',
          borderClass,
          className
        )}
      >
        {startIcon && (
          <span className={cn('pointer-events-none absolute top-1/2 left-[1.2rem] -translate-y-1/2', iconColorClass)}>
            <Icon name={startIcon} width={2} height={2} ariaHidden />
          </span>
        )}

        {isLine ? (
          <input
            {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
            id={id}
            type={
              passwordToggle
                ? showPw
                  ? 'text'
                  : 'password'
                : ((rest as React.InputHTMLAttributes<HTMLInputElement>).type ?? 'text')
            }
            maxLength={maxLength}
            className={cn(commonFieldClass, 'h-full rounded-[12px] py-[1.6rem]', leftPadding, rightPadding)}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
          />
        ) : (
          <textarea
            {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            id={id}
            maxLength={maxLength}
            className={cn(
              commonFieldClass,
              'h-[20rem] resize-none rounded-[12px] py-[1.6rem] break-words whitespace-pre-wrap',
              leftPadding,
              rightPadding
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
          />
        )}

        {isLine && (
          <span className='absolute top-1/2 right-[1.2rem] -translate-y-1/2'>
            {passwordToggle ? (
              <button
                type='button'
                aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
                onClick={togglePw}
                className='rounded-md p-1 active:opacity-70'
              >
                <Icon
                  name={showPw ? 'pw-show-off' : 'pw-show-on'}
                  width={2}
                  height={2}
                  className={iconColorClass}
                  ariaHidden={false}
                />
              </button>
            ) : endIcon ? (
              <Icon name={endIcon} width={2} height={2} className={iconColorClass} ariaHidden />
            ) : null}
          </span>
        )}
      </div>

      {messageToShow && (
        <div className='flex w-full justify-between'>
          <p className={cn('caption3 text-gray-600', isLine && iconColorClass)}>{messageToShow}</p>
          {hasLength && (
            <p className='caption3 text-gray-600'>
              {typeof length === 'number' ? length : 0}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
