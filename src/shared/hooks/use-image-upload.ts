import { toast } from '@libs/toast';
import { useRef, useState } from 'react';

export type ImagePreview = { id: string; url: string; file?: File };

interface UseImageUploadOptions {
  mode?: 'single' | 'multiple';
  maxCount?: number;
}

interface UseImageUploadReturn {
  fileRef: React.RefObject<HTMLInputElement | null>;
  images: ImagePreview[];
  openFilePicker: () => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (id: string) => void;
  resetImages: () => void;
  setImages: React.Dispatch<React.SetStateAction<ImagePreview[]>>;
}

function useImageUpload({ mode = 'single', maxCount = 4 }: UseImageUploadOptions): UseImageUploadReturn {
  const fileRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImagePreview[]>([]);

  const openFilePicker = () => fileRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    const readFiles = fileArray.map(
      (file) =>
        new Promise<ImagePreview>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const url = typeof reader.result === 'string' ? reader.result : '';
            resolve({
              id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
              url,
              file,
            });
          };
          reader.readAsDataURL(file);
        })
    );

    const newImages = await Promise.all(readFiles);

    setImages((prev) => {
      if (mode === 'single') return newImages;

      const combined = [...prev, ...newImages];
      if (maxCount && combined.length > maxCount) {
        toast.error(`이미지는 최대 ${maxCount}장 까지 올릴 수 있어요.`);
        return combined.slice(0, maxCount);
      }
      return combined;
    });
  };

  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  };

  const resetImages = () => {
    setImages([]);
  };

  return {
    fileRef,
    images,
    openFilePicker,
    handleFileChange,
    removeImage,
    resetImages,
    setImages,
  };
}

export default useImageUpload;
