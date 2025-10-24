import { useRef, useState } from 'react';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Input from '@components/input/input';
import TimePicker, { type HMValue } from '@components/time-picker/time-picker';
import { libraryMutations } from '@apis/library/library-mutations';
import { uploadImage } from '@apis/s3/s3-api';
import { useMutation } from '@tanstack/react-query';

export default function LibraryCreatePage() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [name, setName] = useState('');
  const [openAt, setOpenAt] = useState<HMValue | undefined>(undefined);
  const [closeAt, setCloseAt] = useState<HMValue | undefined>(undefined);
  const [intro, setIntro] = useState('');

  const { mutate: createLibrary } = useMutation(libraryMutations.POST_LIBRARY());

  const canSubmit = name.trim().length > 0 && !!openAt && !!closeAt && intro.trim().length > 10;

  const onPickImage = () => fileRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.currentTarget.files?.[0];
    if (!f) return;

    // 선택한 파일 저장
    setSelectedFile(f);

    // 미리보기를 위한 data URL 생성
    const reader = new FileReader();
    reader.onload = () => {
      const url = typeof reader.result === 'string' ? reader.result : '';
      setPreviewUrl(url);
    };
    reader.readAsDataURL(f);
  };

  const formatTime = (time: HMValue): string => {
    const hours = String(time.hour).padStart(2, '0');
    const minutes = String(time.minute).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const submit = async () => {
    if (!openAt || !closeAt) return;

    try {
      let thumbnailUrl = '';
      if (selectedFile) {
        thumbnailUrl = await uploadImage(selectedFile);
        console.log(thumbnailUrl);
      }
      const library_location = JSON.parse(localStorage.getItem('library-location') || '0');
      const latitude = library_location.lat;
      const longitude = library_location.lng;

      createLibrary({
        name,
        description: intro,
        thumbnailUrl,
        startTime: formatTime(openAt),
        endTime: formatTime(closeAt),
        latitude,
        longitude,
        validOperatingHours: true,
      });

      console.log(name, intro, thumbnailUrl, openAt, closeAt, latitude, longitude, true);
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
    }
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
          {previewUrl && (
            <img src={previewUrl} alt='도서관 이미지 미리보기' className='h-[15rem] w-full object-cover' />
          )}
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
