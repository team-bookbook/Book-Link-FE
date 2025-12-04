import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { libraryBookMutations } from '@apis/library/library-book-mutations';
import { uploadImage } from '@apis/s3/s3-api';
import { toast } from '@libs/toast';
import type { ImagePreview } from '@hooks/use-image-upload';

interface UseUpdateBookParams {
  libraryBookId: string;
}

interface UpdateBookData {
  images: ImagePreview[];
  copies: string;
  deposit: string;
}

export function useUpdateBook({ libraryBookId }: UseUpdateBookParams) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: updateLibraryBook } = useMutation(libraryBookMutations.PATCH_LIBRARY_BOOK());

  const submit = async (data: UpdateBookData) => {
    const { images, copies, deposit } = data;

    try {
      setIsSubmitting(true);

      const uploadedImageUrls = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            return await uploadImage(img.file);
          }
          return img.url || '';
        })
      );

      const updateData = {
        id: libraryBookId,
        copies: Number(copies) || 1,
        deposit: Number(deposit.trim()) || 0,
        previewImages: uploadedImageUrls.filter((url) => url !== ''),
      };

      updateLibraryBook(updateData, {
        onSuccess: () => {
          toast.success('도서 수정이 완료되었어요');
          navigate(`/book/${libraryBookId}`);
        },
        onError: (error) => {
          console.error('도서 수정 실패:', error);
          toast.error('도서 수정에 실패했어요');
          setIsSubmitting(false);
        },
      });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      toast.error('이미지 업로드에 실패했어요');
      setIsSubmitting(false);
    }
  };

  return {
    submit,
    isSubmitting,
  };
}
