import { iconColorMap, inputClassMap } from '@components/input/styles/input-varients';
import { cn } from '@libs/cn';
import Icon from '@components/icon';
import React, { useId, useState, forwardRef } from 'react';
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
  /** 글자수 카운터 표시 시 현재 길이 */
  length?: number;
  /** 좌측 아이콘 이름 (예: 'name') */
  startIcon?: string;
  /** 우측 고정 아이콘(비밀번호 토글 이외) */
  endIcon?: string;
  /** 비밀번호 보기 토글 사용 여부 */
  passwordToggle?: boolean;
  /** 비밀번호 토글 상태 변경 콜백 */
  onPasswordToggleChange?: (show: boolean) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLTextAreaElement>) => void;
};

/** 단일 라인 인풋 전용 props */
type InputLineProps = BaseProps &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onBlur' | 'children' | 'ref'> & {
    multiline?: false;
  };

/** 멀티라인(텍스트에어리어) 전용 props */
type TextAreaProps = BaseProps &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onBlur' | 'children' | 'ref'> & {
    multiline: true;
  };

type InputProps = InputLineProps | TextAreaProps;

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(function Input(props, ref) {
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
  } = props;

  const id = 'id' in props && props.id ? props.id : autoId;

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

  const hasRightAddon = (!('multiline' in props) || props.multiline === false) && (passwordToggle || !!endIcon);

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
          props.multiline ? 'min-h-[20rem]' : 'flex h-[5.6rem] items-center',
          borderClass,
          className
        )}
      >
        {startIcon && (
          <span className={cn('pointer-events-none absolute top-1/2 left-[1.2rem] -translate-y-1/2', iconColorClass)}>
            <Icon name={startIcon} width={2} height={2} ariaHidden />
          </span>
        )}

        {props.multiline ? (
          <textarea
            id={id}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            maxLength={props.maxLength ?? maxLength}
            className={cn(
              commonFieldClass,
              'h-[20rem] resize-none rounded-[12px] py-[1.6rem] break-words whitespace-pre-wrap',
              leftPadding,
              rightPadding
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            {...(props as TextAreaProps)}
          />
        ) : (
          <input
            id={id}
            ref={ref as React.Ref<HTMLInputElement>}
            type={passwordToggle ? (showPw ? 'text' : 'password') : (props.type ?? 'text')}
            maxLength={props.maxLength ?? maxLength}
            className={cn(commonFieldClass, 'h-full rounded-[12px] py-[1.6rem]', leftPadding, rightPadding)}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            {...(props as InputLineProps)}
          />
        )}

        {!props.multiline && (
          <span className='absolute top-1/2 right-[1.2rem] -translate-y-1/2'>
            {passwordToggle ? (
              <button
                type='button'
                aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
                onClick={togglePw}
                className='rounded-md p-1 active:opacity-70'
              >
                <Icon
                  name={showPw ? 'pw-show-on' : 'pw-show-off'}
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
          <p className={cn('caption3 text-gray-600', !props.multiline && iconColorClass)}>{messageToShow}</p>
          {hasLength && (
            <p className='caption3 text-gray-600'>
              {(props as { length?: number }).length ?? 0}/{props.maxLength ?? maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

export default Input;
