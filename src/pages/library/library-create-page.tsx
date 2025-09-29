import { useRef, useState } from 'react';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Input from '@components/input/input';
import TimePicker, { type HMValue } from '@components/time-picker/time-picker';

export default function LibraryCreatePage() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [imageUrl, setImageUrl] = useState('');
  const [name, setName] = useState('');
  const [openAt, setOpenAt] = useState<HMValue | undefined>(undefined);
  const [closeAt, setCloseAt] = useState<HMValue | undefined>(undefined);
  const [intro, setIntro] = useState('');

  const canSubmit = name.trim().length > 0 && !!openAt && !!closeAt && intro.trim().length > 10;

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
    <div className='bg-gray-white min-h-dvh text-gray-900'>
      <div className='mx-auto w-full space-y-[3.5rem] px-[2rem] pt-[2.5rem] pb-[10rem]'>
        <div className='flex-col gap-[0.8rem]'>
          <label className='body5'>도서관 이미지</label>
          <Button variant='primary' fullWidth className='py-[1.2rem]' roundStyle='rounded-[12px]' onClick={onPickImage}>
            이미지 업로드
          </Button>
          <input ref={fileRef} type='file' accept='image/*' onChange={onFile} className='hidden' />
          {imageUrl && <img src={imageUrl} alt='도서관 이미지 미리보기' className='h-[15rem] w-full object-cover' />}
        </div>

        <Input
          id='lib-name'
          label='도서관 이름'
          placeholder='도서관 이름을 입력해 주세요.'
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <div>
          <p className='body5 text-gray-900'>영업 시간 (연락 가능한 시간)</p>
          <div className='flex items-center gap-[1.2rem]'>
            <TimePicker value={openAt} onChange={setOpenAt} placeholder='시간 선택' className='w-[18rem]' />
            <span className='body5 text-gray-400'>—</span>
            <TimePicker value={closeAt} onChange={setCloseAt} placeholder='시간 선택' className='w-[18rem]' />
          </div>
        </div>

        <Input
          id='lib-intro'
          label='소개'
          placeholder='도서관 소개 글을 작성해 주세요.'
          multiline
          maxLength={500}
          hasLength
          length={intro.length}
          value={intro}
          onChange={(e) => setIntro(e.currentTarget.value)}
          className='bg-gray-50'
        />
      </div>

      <ButtonFrame>
        <Button fullWidth roundStyle='rounded-[12px]' className='py-[1.2rem]' disabled={!canSubmit} onClick={submit}>
          등록하기
        </Button>
      </ButtonFrame>
    </div>
  );
}
