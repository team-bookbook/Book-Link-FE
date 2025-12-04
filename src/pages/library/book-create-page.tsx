import { useState, useEffect } from 'react';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Input from '@components/input/input';
import Icon from '@components/icon';
import useImageUpload from '@hooks/use-image-upload';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { bookMutations } from '@apis/book/book-mutations';
import { libraryBookMutations } from '@apis/library/library-book-mutations';
import { uploadImage } from '@apis/s3/s3-api';
import { toast } from '@libs/toast';
import { useNavigate, useLocation } from 'react-router-dom';
import useBottomSheet from '@components/bottom-sheet/hooks/use-bottom-sheet';
import SelectBottomSheet from '@components/bottom-sheet/select-bottom-sheet';
import { BOOK_CATEGORY_CREATE_OPTIONS } from '@components/dropdown/constants/select-options';
import { ROUTES } from '@routes/routes-config';
import type { IBookInfo } from '@apis/book/book-queries';
import { memberQueries } from '@apis/member/member-queries';
import { isAuthenticated } from '@utils/auth';
import { get } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';

interface LocationState {
  isbn: string;
  bookInfo?: IBookInfo | null;
}

export default function BookCreatePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const state = location.state as LocationState | null;

  const { data: memberData } = useQuery({
    ...memberQueries.GET_ME(),
    enabled: isAuthenticated(),
  });

  const { fileRef, images, openFilePicker, handleFileChange, removeImage } = useImageUpload({ mode: 'multiple' });

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publisher, setPublisher] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [desc, setDesc] = useState('');
  const [deposit, setDeposit] = useState('');
  const [isbn, setIsbn] = useState('');
  const [copies, setCopies] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isOpen, open, close } = useBottomSheet();
  const { mutate: createBook } = useMutation(bookMutations.POST_BOOK());
  const { mutate: createLibraryBook } = useMutation(libraryBookMutations.POST_LIBRARY_BOOK(queryClient));

  const canSubmit = images.length >= 3 && title.trim().length > 0;

  // location.state에서 받은 bookInfo로 폼 미리 채우기
  useEffect(() => {
    if (state?.isbn) {
      setIsbn(state.isbn);
    }

    if (state?.bookInfo) {
      const bookInfo = state.bookInfo;
      setTitle(bookInfo.title);
      setAuthor(bookInfo.author);
      setPublisher(bookInfo.publisher);
      setCategory(bookInfo.category);
      setPrice(bookInfo.originalPrice.toString());
    }
  }, [state]);

  const categoryLabel = category
    ? BOOK_CATEGORY_CREATE_OPTIONS.find((option) => option.value === category)?.label || '카테고리'
    : '카테고리';

  const submit = async () => {
    if (!canSubmit || isSubmitting) return;

    if (!memberData?.libraryId) {
      toast.error('도서관 정보를 찾을 수 없습니다');
      return;
    }

    if (!isbn.trim()) {
      toast.error('ISBN을 입력해 주세요');
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. 이미지 S3에 업로드
      const uploadedImageUrls = await Promise.all(
        images.map(async (img) => {
          if (img.file) {
            return await uploadImage(img.file);
          }
          return '';
        })
      );

      // 2. GET /book/{isbn} - ISBN으로 도서 조회
      let bookId: string | null = null;

      try {
        const existingBook = await get<IBookInfo>(END_POINT.BOOK_BY_ISBN(isbn.trim()), {
          headers: {
            'Trace-Id': crypto.randomUUID(),
          },
        });
        if (existingBook?.id) {
          bookId = existingBook.id;
          console.log('기존 도서 발견:', bookId);
        }
      } catch (error) {
        console.log('기존 도서 없음, 새로 등록합니다.', error);
      }

      // 3. bookId가 없으면 POST /book (새 도서 등록)
      if (!bookId) {
        const bookData = {
          title: title.trim(),
          author: author.trim(),
          publisher: publisher.trim(),
          category: category.trim(),
          originalPrice: Number(price.trim()) || 0,
          publishedDate: new Date().toISOString().split('T')[0],
          isbn: isbn.trim(),
        };

        console.log('도서 등록 요청 데이터:', bookData);

        createBook(bookData, {
          onSuccess: async (response) => {
            console.log('도서 등록 성공:', response);
            bookId = response;
            const libraryBookData = {
              id: bookId,
              copies: Number(copies) || 1,
              deposit: Number(deposit.trim()) || 0,
              previewImages: uploadedImageUrls,
            };

            console.log('도서관 도서 등록 요청 데이터:', libraryBookData);

            // 4. POST /library-book (도서관 도서 등록)
            createLibraryBook(libraryBookData, {
              onSuccess: () => {
                toast.success('도서 등록이 완료되었어요');
                navigate(ROUTES.LIBRARY);
              },
              onError: (error) => {
                console.error('도서관 도서 등록 실패:', error);
                toast.error('도서관 도서 등록에 실패했어요');
                setIsSubmitting(false);
              },
            });
          },
          onError: (error) => {
            console.error('도서 등록 실패:', error);
            console.error('에러 상세:', JSON.stringify(error, null, 2));
            toast.error('도서 등록에 실패했어요');
            setIsSubmitting(false);
          },
        });
      } else {
        // 4. bookId가 있으면 바로 POST /library-book (도서관 도서 등록)
        const libraryBookData = {
          id: bookId,
          copies: Number(copies) || 1,
          deposit: Number(deposit.trim()) || 0,
          previewImages: uploadedImageUrls,
        };

        console.log('도서관 도서 등록 요청 데이터 (기존 도서):', libraryBookData);

        createLibraryBook(libraryBookData, {
          onSuccess: () => {
            toast.success('도서 등록이 완료되었어요');
            navigate(ROUTES.LIBRARY);
          },
          onError: (error) => {
            console.error('도서관 도서 등록 실패:', error);
            toast.error('도서관 도서 등록에 실패했어요');
            setIsSubmitting(false);
          },
        });
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      toast.error('이미지 업로드에 실패했어요');
      setIsSubmitting(false);
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
          readOnly={!!state?.bookInfo}
        />

        <Input
          id='book-author'
          label='작가'
          placeholder='작가를 입력해 주세요.'
          value={author}
          onChange={(e) => setAuthor(e.currentTarget.value)}
          readOnly={!!state?.bookInfo}
        />

        <Input
          id='book-publisher'
          label='출판사'
          placeholder='출판사를 입력해 주세요.'
          value={publisher}
          onChange={(e) => setPublisher(e.currentTarget.value)}
          readOnly={!!state?.bookInfo}
        />

        <Input
          id='book-price'
          label='정가'
          placeholder='정가를 입력해 주세요.'
          inputMode='numeric'
          value={price}
          onChange={(e) => setPrice(e.currentTarget.value.replace(/[^\d]/g, ''))}
          readOnly={!!state?.bookInfo}
        />

        <Input
          id='book-category'
          label='카테고리'
          value={categoryLabel}
          endIcon='dropdown'
          readOnly
          onClick={state?.bookInfo ? undefined : open}
        />

        <Input
          id='book-isbn'
          label='ISBN'
          placeholder='ISBN을 입력해 주세요.'
          value={isbn}
          onChange={(e) => setIsbn(e.currentTarget.value)}
          readOnly={!!state?.bookInfo}
        />

        <Input
          id='book-desc'
          label='상세 설명'
          placeholder='상세 설명을 작성해 주세요.'
          multiline
          maxLength={1000}
          hasLength
          value={desc}
          onChange={(e) => setDesc(e.currentTarget.value)}
          length={desc.length}
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
          {isSubmitting ? '등록 중...' : '도서 등록'}
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
