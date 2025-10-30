import Button from '@components/button/button';
import Icon from '@components/icon';
import { useRef } from 'react';
import { EDIT_PROFILE_TEXT } from '../constants/edit-profile.constants';

type Preview = { id: string; url: string };

interface ProfileImageSectionProps {
  image: Preview | null;
  onImageChange: (image: Preview | null) => void;
}

function ProfileImageSection({ image, onImageChange }: ProfileImageSectionProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPickImage = () => fileRef.current?.click();

  const onResetToDefault = () => {
    onImageChange(null);
    // TODO: 기본 이미지로 변경 API 호출
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    const reader = new FileReader();
    reader.onload = () => {
      onImageChange({
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
        url: typeof reader.result === 'string' ? reader.result : '',
      });
    };
    reader.readAsDataURL(file);

    e.currentTarget.value = '';
  };

  return (
    <div className='flex-col'>
      <h2 className='body5 mb-[1rem] text-gray-900'>{EDIT_PROFILE_TEXT.PROFILE_IMAGE}</h2>
      <div className='flex-col-center'>
        <input ref={fileRef} type='file' accept='image/*' onChange={onFileChange} className='hidden' />
        <div className='relative mb-[1.5rem] h-[8rem] w-[8rem] overflow-hidden rounded-full'>
          {image ? (
            <img src={image.url} alt='사용자 프로필 사진' className='h-full w-full object-cover' />
          ) : (
            <Icon name='cat-profile' className='mb-[1.5rem] text-gray-300' size={8} ariaHidden />
          )}
        </div>
        <h2 className='caption3 mb-[2rem] text-gray-900'>{EDIT_PROFILE_TEXT.PROFILE_IMAGE_DESC}</h2>
      </div>
      <div className='flex gap-[1rem]'>
        <Button fullWidth variant='outline' className='min-h-[3.6rem] py-[1.2rem]' onClick={onResetToDefault}>
          {EDIT_PROFILE_TEXT.RESET_TO_DEFAULT}
        </Button>
        <Button fullWidth variant='outline' className='min-h-[3.6rem] py-[1.2rem]' onClick={onPickImage}>
          {EDIT_PROFILE_TEXT.CHANGE_IMAGE}
        </Button>
      </div>
    </div>
  );
}

export default ProfileImageSection;
