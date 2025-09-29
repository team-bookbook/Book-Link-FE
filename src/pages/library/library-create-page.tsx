import { useRef, useState } from 'react';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Input from '@components/input/input';
import Icon from '@components/icon';
import TimePicker, { type HMValue } from '@components/time-picker/time-picker';

export default function LibraryCreatePage() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [imageUrl, setImageUrl] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [openAt, setOpenAt] = useState<HMValue | undefined>(undefined);
  const [closeAt, setCloseAt] = useState<HMValue | undefined>(undefined);
  const [intro, setIntro] = useState<string>('');

  const canSubmit = name.trim().length > 0 && !!openAt && !!closeAt;

  const onPickImage = () => fileRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.currentTarget.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : '';
      setImageUrl(url);
    };
    reader.readAsDataURL(f);
  };

  const submit = () => {
    if (!canSubmit) return;
    // TODO: 실제 API 연동 자리 (지금은 콘솔만)
    const payload: {
      name: string;
      intro: string;
      openAt: HMValue;
      closeAt: HMValue;
      imageUrl?: string;
    } = {
      name: name.trim(),
      intro: intro.trim(),
      openAt: openAt as HMValue,
      closeAt: closeAt as HMValue,
      imageUrl: imageUrl || undefined,
    };
    console.log('create library payload ->', payload);
  };

  return (
    <div className='bg-gray-white h-full min-h-dvh text-gray-900'>
      <div className='mx-auto w-full max-w-[43rem] px-[2rem] pt-[2rem] pb-[10rem]'>
        <div className='flex-col gap-[1.2rem]'>
          <label className='body5'>도서관 이미지</label>

          <Button variant='primary' fullWidth className='py-[1.2rem]' roundStyle='rounded-[12px]' onClick={onPickImage}>
            이미지 업로드
          </Button>
          <input ref={fileRef} type='file' accept='image/*' onChange={onFile} className='hidden' />

          <div className='mt-[1.2rem] rounded-[20px] bg-gray-100 p-[1.2rem]'>
            <div className='grid h-[20rem] place-items-center rounded-[20px] bg-gray-100'>
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt='도서관 이미지 미리보기'
                  className='h-full w-full rounded-[20px] object-cover'
                />
              ) : (
                <div className='flex-col-center gap-[0.8rem] text-gray-400'>
                  <Icon name='book' size={4} ariaHidden />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='mt-[2.4rem]'>
          <Input
            id='lib-name'
            label='도서관 이름'
            placeholder='도서관 이름을 입력해 주세요.'
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </div>

        <div className='mt-[2.8rem]'>
          <p className='body5 text-gray-900'>영업 시간 (연락 가능한 시간)</p>

          <div className='mt-[1.2rem] flex items-center gap-[1.2rem]'>
            <TimePicker value={openAt} onChange={setOpenAt} placeholder='시간 선택' className='w-[18rem]' />
            <span className='body5 text-gray-400'>—</span>
            <TimePicker value={closeAt} onChange={setCloseAt} placeholder='시간 선택' className='w-[18rem]' />
          </div>
        </div>

        <div className='mt-[2.8rem]'>
          <Input
            id='lib-intro'
            label='소개'
            placeholder='도서관 소개 글을 작성해 주세요.'
            multiline
            maxLength={800}
            hasLength
            length={intro.length}
            value={intro}
            onChange={(e) => setIntro(e.currentTarget.value)}
            className='bg-gray-50'
          />
        </div>
      </div>

      <ButtonFrame>
        <Button fullWidth roundStyle='rounded-[12px]' className='py-[1.2rem]' disabled={!canSubmit} onClick={submit}>
          등록하기
        </Button>
      </ButtonFrame>
    </div>
  );
}
