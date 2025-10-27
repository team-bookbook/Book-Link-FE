import { useRef, useState, useEffect } from 'react';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Input from '@components/input/input';
import TimePicker, { type HMValue } from '@components/time-picker/time-picker';
import { libraryMutations } from '@apis/library/library-mutations';
import { libraryQueries } from '@apis/library/library-queries';
import { uploadImage } from '@apis/s3/s3-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';

export default function LibraryCreatePage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const libraryId = searchParams.get('id');
  const isEditMode = !!libraryId;

  // Todo : 도서관 id를 가지고 있지 않은 아이디로 접근 시 반환 필요

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [name, setName] = useState('');
  const [openAt, setOpenAt] = useState<HMValue | undefined>(undefined);
  const [closeAt, setCloseAt] = useState<HMValue | undefined>(undefined);
  const [intro, setIntro] = useState('');

  const { data: libraryInfo } = useQuery({
    ...libraryQueries.GET_LIBRARY_DETAIL(libraryId || ''),
    enabled: isEditMode,
  });

  const { mutate: createLibrary } = useMutation(libraryMutations.POST_LIBRARY());
  const { mutate: updateLibrary } = useMutation(libraryMutations.PUT_LIBRARY());

  useEffect(() => {
    if (isEditMode && libraryInfo) {
      setName(libraryInfo.name);
      setIntro(libraryInfo.description);
      setPreviewUrl(libraryInfo.thumbnailUrl);

      const [startHour, startMinute] = libraryInfo.startTime.split(':').map(Number);
      const [endHour, endMinute] = libraryInfo.endTime.split(':').map(Number);

      setOpenAt({ hour: startHour, minute: startMinute });
      setCloseAt({ hour: endHour, minute: endMinute });
    }
  }, [isEditMode, libraryInfo]);

  const canSubmit = name.trim().length > 0 && !!openAt && !!closeAt && intro.trim().length > 10;

  const onPickImage = () => fileRef.current?.click();

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.currentTarget.files?.[0];
    if (!f) return;

    setSelectedFile(f);

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
      let thumbnailUrl = previewUrl;

      // 새로운 파일이 선택된 경우에만 업로드
      if (selectedFile) {
        thumbnailUrl = await uploadImage(selectedFile);
        console.log('새 이미지 업로드:', thumbnailUrl);
      }

      if (isEditMode && libraryId) {
        // 수정 모드
        updateLibrary(
          {
            libraryId,
            name,
            description: intro,
            thumbnailUrl,
            startTime: formatTime(openAt),
            endTime: formatTime(closeAt),
            validOperatingHours: true,
          },
          {
            onSuccess: () => {
              alert('도서관이 수정되었습니다.');
              navigate(ROUTES.LIBRARY_DETAIL(libraryId));
            },
            onError: (error) => {
              console.error('도서관 수정 실패:', error);
              alert('도서관 수정에 실패했습니다. 다시 시도해 주세요.');
            },
          }
        );
      } else {
        // 생성 모드
        const library_location = JSON.parse(localStorage.getItem('library-location') || '0');
        const latitude = library_location.lat;
        const longitude = library_location.lng;

        createLibrary(
          {
            name,
            description: intro,
            thumbnailUrl,
            startTime: formatTime(openAt),
            endTime: formatTime(closeAt),
            latitude,
            longitude,
            validOperatingHours: true,
          },
          {
            onSuccess: () => {
              alert('도서관이 생성되었습니다.');
              navigate(ROUTES.LIBRARY);
            },
            onError: (error) => {
              console.error('도서관 생성 실패:', error);
              alert('도서관 생성에 실패했습니다. 다시 시도해 주세요.');
            },
          }
        );

        console.log(name, intro, thumbnailUrl, openAt, closeAt, latitude, longitude, true);
      }
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
          {isEditMode ? '수정하기' : '등록하기'}
        </Button>
      </ButtonFrame>
    </div>
  );
}
