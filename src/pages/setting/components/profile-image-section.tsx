import Button from '@components/button/button';
import Icon from '@components/icon';
import { useEffect } from 'react';
import { EDIT_PROFILE_TEXT } from '../constants/edit-profile.constants';
import useImageUpload, { type ImagePreview } from '@hooks/use-image-upload';

interface ProfileImageSectionProps {
  image: ImagePreview | null;
  onImageChange: (image: ImagePreview | null) => void;
}

function ProfileImageSection({ image, onImageChange }: ProfileImageSectionProps) {
  const { fileRef, images, openFilePicker, handleFileChange, resetImages, setImages } = useImageUpload({
    mode: 'single',
  });

  const currentImage = images[0] || null;
  const previewUrl = currentImage?.url || '';

  useEffect(() => {
    if (image?.url) {
      setImages([image]);
    }
  }, [image, setImages]);

  useEffect(() => {
    if (currentImage) {
      onImageChange(currentImage);
    }
  }, [currentImage, onImageChange]);

  const onResetToDefault = () => {
    resetImages();
    onImageChange(null);
    // TODO: 기본 이미지로 변경 API 호출
  };

  return (
    <div className='flex-col'>
      <h2 className='body5 mb-[1rem] text-gray-900'>{EDIT_PROFILE_TEXT.PROFILE_IMAGE}</h2>
      <div className='flex-col-center'>
        <input ref={fileRef} type='file' accept='image/*' onChange={handleFileChange} className='hidden' />
        <div className='relative mb-[1.5rem] h-[8rem] w-[8rem] overflow-hidden rounded-full'>
          {previewUrl ? (
            <img src={previewUrl} alt='사용자 프로필 사진' className='h-full w-full object-cover' />
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
        <Button fullWidth variant='outline' className='min-h-[3.6rem] py-[1.2rem]' onClick={openFilePicker}>
          {EDIT_PROFILE_TEXT.CHANGE_IMAGE}
        </Button>
      </div>
    </div>
  );
}

export default ProfileImageSection;
