import { useState, useEffect } from 'react';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Input from '@components/input/input';
import Icon from '@components/icon';
import useImageUpload from '@hooks/use-image-upload';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@libs/toast';
import { useSearchParams } from 'react-router-dom';
import useBottomSheet from '@components/bottom-sheet/hooks/use-bottom-sheet';
import SelectBottomSheet from '@components/bottom-sheet/select-bottom-sheet';
import { BOOK_CATEGORY_CREATE_OPTIONS } from '@components/dropdown/constants/select-options';
import { memberQueries } from '@apis/member/member-queries';
import { isAuthenticated } from '@utils/auth';
import { libraryBookQueries } from '@apis/library/library-book-queries';
import { useCreateBook } from './hooks/use-create-book';
import { useUpdateBook } from './hooks/use-update-book';

export default function BookCreatePage() {
  const [searchParams] = useSearchParams();
  const libraryBookId = searchParams.get('id');
  const isEditMode = !!libraryBookId;

  const { data: memberData } = useQuery({
    ...memberQueries.GET_ME(),
    enabled: isAuthenticated(),
  });

  const { data: bookDetail } = useQuery({
    ...libraryBookQueries.GET_LIBRARY_BOOK_DETAIL(libraryBookId!),
    enabled: isEditMode,
  });

  const { fileRef, images, openFilePicker, handleFileChange, removeImage, setImages } = useImageUpload({
    mode: 'multiple',
  });

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setdescription] = useState('');
  const [deposit, setDeposit] = useState('');
  const [isbn, setIsbn] = useState('');
  const [copies, setCopies] = useState('1');

  const { isOpen, open, close } = useBottomSheet();

  const { submit: createBookSubmit, isSubmitting: isCreating } = useCreateBook();

  const { submit: updateBookSubmit, isSubmitting: isUpdating } = useUpdateBook({
    libraryBookId: libraryBookId || '',
  });

  const isSubmitting = isCreating || isUpdating;
  const canSubmit = images.length >= 3 && title.trim().length > 0;

  // editMode: bookDetail로 폼 미리 채우기
  useEffect(() => {
    if (isEditMode && bookDetail) {
      const { libraryBookDetailDto, bookDetailDto } = bookDetail;

      setTitle(bookDetailDto.title);
      setAuthor(bookDetailDto.author);
      setPublisher(bookDetailDto.publisher);
      setCategory(bookDetailDto.category);

      setPrice(bookDetailDto.originalPrice.toString());
      setIsbn(bookDetailDto.isbn);
      setDeposit(libraryBookDetailDto.deposit.toString());
      setCopies(libraryBookDetailDto.copies.toString());

      // 기존 이미지 설정
      if (libraryBookDetailDto.previewImages) {
        const previewImages = JSON.parse(libraryBookDetailDto.previewImages);
        setImages(
          previewImages.map((url: string, index: number) => ({
            id: `existing-${index}`,
            url,
            file: null,
          }))
        );
      }
    }
  }, [isEditMode, bookDetail, setImages]);

  const categoryLabel = category
    ? BOOK_CATEGORY_CREATE_OPTIONS.find((option) => option.value === category)?.label || '카테고리'
    : '카테고리';

  const submit = async () => {
    if (!canSubmit || isSubmitting) return;

    if (isEditMode) {
      await updateBookSubmit({
        images,
        copies,
        deposit,
        description,
      });
    } else {
      if (!memberData?.libraryId) {
        toast.error('도서관 정보를 찾을 수 없습니다');
        return;
      }

      await createBookSubmit({
        images,
        title,
        author,
        publisher,
        price,
        category,
        isbn,
        deposit,
        description,
        copies,
      });
    }
  };

  return (
    <div className='bg-gray-white min-h-dvh text-gray-900'>
      <div className='mx-auto w-full space-y-[3.5rem] px-[2rem] pt-[2rem] pb-[10rem]'>
        <div className='flex-col gap-[0.8rem]'>
          <label className='body5'>책 이미지 (최소 3장으로 앞, 뒤, 내부 사진 업로드)</label>

          <Button
            variant='primary'
            fullWidth
            className='py-[1.2rem]'
            onClick={openFilePicker}
            roundStyle='rounded-[12px]'
          >
            이미지 업로드
          </Button>
          <input ref={fileRef} type='file' accept='image/*' multiple onChange={handleFileChange} className='hidden' />
          {images.length > 0 && (
            <div className='grid grid-cols-2 gap-[0.8rem]'>
              {images.map((img) => (
                <div
                  key={img.id}
                  className='relative grid h-[15rem] w-full place-items-center overflow-hidden rounded-[12px] bg-gray-100'
                >
                  <Icon
                    name='cancel'
                    size={1.5}
                    className='absolute top-[1rem] right-[1rem] cursor-pointer text-gray-400'
                    ariaHidden
                    onClick={() => removeImage(img.id)}
                  ></Icon>
                  {img.url ? (
                    <img src={img.url} alt='' className='h-full w-full object-cover' />
                  ) : (
                    <Icon name='book' size={3.2} className='text-gray-400' ariaHidden />
                  )}
                </div>
              ))}
            </div>
          )}
          <p className='body5 text-primary-700'>처음에 등록한 사진이 목록에 노출됩니다.</p>
        </div>

        <Input
          id='book-title'
          label='책 제목'
          placeholder='책 제목을 입력해 주세요.'
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          readOnly={isEditMode}
        />

        <Input
          id='book-author'
          label='작가'
          placeholder='작가를 입력해 주세요.'
          value={author}
          onChange={(e) => setAuthor(e.currentTarget.value)}
          readOnly={isEditMode}
        />

        <Input
          id='book-publisher'
          label='출판사'
          placeholder='출판사를 입력해 주세요.'
          value={publisher}
          onChange={(e) => setPublisher(e.currentTarget.value)}
          readOnly={isEditMode}
        />

        <Input
          id='book-price'
          label='정가'
          placeholder='정가를 입력해 주세요.'
          inputMode='numeric'
          value={price}
          onChange={(e) => setPrice(e.currentTarget.value.replace(/[^\d]/g, ''))}
          readOnly={isEditMode}
        />

        <Input
          id='book-category'
          label='카테고리'
          value={categoryLabel}
          endIcon='dropdown'
          readOnly
          onClick={isEditMode ? undefined : open}
        />

        <Input
          id='book-isbn'
          label='ISBN'
          placeholder='ISBN을 입력해 주세요.'
          value={isbn}
          onChange={(e) => setIsbn(e.currentTarget.value)}
          readOnly={isEditMode}
        />

        <Input
          id='book-description'
          label='상세 설명'
          placeholder='상세 설명을 작성해 주세요.'
          multiline
          maxLength={1000}
          hasLength
          value={description}
          onChange={(e) => setdescription(e.currentTarget.value)}
          length={description.length}
        />
        <Input
          id='book-copies'
          label='도서 수량'
          placeholder='도서 수량을 입력해 주세요.'
          inputMode='numeric'
          value={copies}
          onChange={(e) => setCopies(e.currentTarget.value.replace(/[^\d]/g, ''))}
        />

        <div className='flex-col gap-[0.8rem]'>
          <Input
            id='book-deposit'
            label='보증금'
            placeholder='숫자만 입력해 주세요.'
            inputMode='numeric'
            value={deposit}
            onChange={(e) => setDeposit(e.currentTarget.value.replace(/[^\d]/g, ''))}
          />
          <p className='body5 text-primary-700'>보증금은 정가의 10%가 일반적입니다.</p>
        </div>
      </div>

      <ButtonFrame>
        <Button
          fullWidth
          roundStyle='rounded-[12px]'
          className='py-[1.2rem]'
          disabled={!canSubmit || isSubmitting}
          onClick={submit}
        >
          {isSubmitting ? (isEditMode ? '수정 중...' : '등록 중...') : isEditMode ? '도서 수정' : '도서 등록'}
        </Button>
      </ButtonFrame>

      <SelectBottomSheet
        open={isOpen}
        onClose={close}
        options={BOOK_CATEGORY_CREATE_OPTIONS}
        value={category}
        onChange={setCategory}
      />
    </div>
  );
}
