import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Input from '@components/input/input';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useImageUpload from '@hooks/use-image-upload';
import { uploadImage } from '@apis/s3/s3-api';
import { groupMutations } from '@apis/group/group-mutations';
import { useMutation } from '@tanstack/react-query';
import { ROUTES } from '@routes/routes-config';
import { toast } from '@libs/toast';
import Icon from '@components/icon';

export default function GroupCreatePage() {
  const { fileRef, images, openFilePicker, handleFileChange } = useImageUpload({ mode: 'single' });
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [maxCapacity, setMaxCapacity] = useState('');
  const [password, setPassword] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const previewUrl = images[0]?.url || '';
  const selectedFile = images[0]?.file || null;

  const { mutate: createGroup, isPending } = useMutation(groupMutations.POST_CREATE_GROUP());

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('모임 이름을 입력해 주세요.');
      return;
    }

    if (!description.trim()) {
      toast.error('모임 설명을 입력해 주세요.');
      return;
    }

    if (!maxCapacity || Number(maxCapacity) <= 0) {
      toast.error('최대 인원을 입력해 주세요.');
      return;
    }

    if (!isPublic && !password.trim()) {
      toast.error('비공개 모임은 비밀번호를 입력해 주세요.');
      return;
    }

    try {
      let thumbnailUrl: string | undefined;

      if (selectedFile) {
        thumbnailUrl = await uploadImage(selectedFile);
      }

      createGroup(
        {
          thumbnail: thumbnailUrl,
          name: name.trim(),
          description: description.trim(),
          maxCapacity: Number(maxCapacity),
          password: !isPublic ? password.trim() : undefined,
        },
        {
          onSuccess: () => {
            toast.success('독서 모임이 생성되었습니다.');
            navigate(ROUTES.BOARD + '?tab=reading');
          },
          onError: (error) => {
            console.error('모임 생성 실패:', error);
            toast.error('모임 생성에 실패했습니다. 다시 시도해 주세요.');
          },
        }
      );
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      toast.error('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  return (
    <main>
      <div className='flex-col gap-[2.5rem] p-[1.5rem]'>
        <Input
          id='group-name'
          label='모임 이름'
          placeholder='독서 모임 이름을 입력해 주세요.'
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
        />

        <Input
          id='group-description'
          label='독서 모임 설명'
          placeholder='설명글을 작성해 주세요. (최대 200자)'
          multiline
          maxLength={200}
          hasLength
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          length={description.length}
        />

        <Input
          id='group-max-capacity'
          label='최대 인원'
          placeholder='최대 인원을 입력해 주세요.'
          type='number'
          value={maxCapacity}
          onChange={(e) => setMaxCapacity(e.currentTarget.value)}
        />

        <div className='flex-col gap-[0.8rem]'>
          <label className='body5'>모임 이미지</label>
          <Button
            variant='primary'
            fullWidth
            className='py-[1.2rem]'
            roundStyle='rounded-[12px]'
            onClick={openFilePicker}
          >
            이미지 업로드
          </Button>
          <input ref={fileRef} type='file' accept='image/*' onChange={handleFileChange} className='hidden' />
          {previewUrl ? (
            <img src={previewUrl} alt='모임 이미지 미리보기' className='h-[15rem] w-full object-cover' />
          ) : (
            <div className='flex-row-center h-[15rem] w-full bg-gray-100'>
              <Icon name='logo-alt' size={5} className='text-[#b5b5b5]' />
            </div>
          )}
        </div>

        <div className='flex-col gap-[0.8rem]'>
          <label className='body5'>공개 여부</label>
          <div className='flex-row-between gap-[1rem]'>
            <button
              type='button'
              onClick={() => setIsPublic(true)}
              className={`button3 min-h-[3.8rem] flex-1 cursor-pointer rounded-[12px] border-1 ${
                isPublic ? 'border-secondary-900 bg-secondary-100 text-primary-700' : 'border-gray-200 text-gray-600'
              }`}
            >
              공개
            </button>
            <button
              type='button'
              onClick={() => setIsPublic(false)}
              className={`button3 min-h-[3.8rem] flex-1 cursor-pointer rounded-[12px] border-1 ${
                !isPublic ? 'border-secondary-900 bg-secondary-100 text-primary-700' : 'border-gray-200 text-gray-600'
              }`}
            >
              비공개
            </button>
          </div>
        </div>

        {!isPublic && (
          <Input
            id='group-password'
            label='모임 비밀번호'
            placeholder='비밀번호를 입력해 주세요.'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        )}
      </div>
      <ButtonFrame>
        <Button
          fullWidth
          roundStyle='rounded-[12px]'
          className='py-[1.2rem]'
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? '생성 중...' : '등록하기'}
        </Button>
      </ButtonFrame>
    </main>
  );
}
