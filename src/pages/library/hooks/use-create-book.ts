import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { bookMutations } from '@apis/book/book-mutations';
import { libraryBookMutations } from '@apis/library/library-book-mutations';
import { uploadImage } from '@apis/s3/s3-api';
import { toast } from '@libs/toast';
import { ROUTES } from '@routes/routes-config';
import { get } from '@apis/base/client';
import { END_POINT } from '@constants/end-point';
import type { IBookInfo } from '@apis/book/book-queries';
import type { ImagePreview } from '@hooks/use-image-upload';
import { LIBRARY_MESSAGES } from '../constants/library-messages';

interface CreateBookData {
  images: ImagePreview[];
  title: string;
  author: string;
  publisher: string;
  price: string;
  category: string;
  isbn: string;
  deposit: string;
  description: string;
  copies: string;
}

export function useCreateBook() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: createBook } = useMutation(bookMutations.POST_BOOK());
  const { mutate: createLibraryBook } = useMutation(libraryBookMutations.POST_LIBRARY_BOOK());

  const submit = async (data: CreateBookData) => {
    const { images, title, author, publisher, price, category, isbn, deposit, copies, description } = data;

    if (!isbn.trim()) {
      toast.error(LIBRARY_MESSAGES.ISBN_REQUIRED);
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
              description: description,
            };

            console.log('도서관 도서 등록 요청 데이터:', libraryBookData);

            // 4. POST /library-book (도서관 도서 등록)
            createLibraryBook(libraryBookData, {
              onSuccess: () => {
                toast.success(LIBRARY_MESSAGES.BOOK_CREATE_SUCCESS);
                navigate(ROUTES.LIBRARY);
              },
              onError: (error) => {
                console.error('도서관 도서 등록 실패:', error);
                toast.error(LIBRARY_MESSAGES.LIBRARY_BOOK_CREATE_FAILED);
                setIsSubmitting(false);
              },
            });
          },
          onError: (error) => {
            console.error('도서 등록 실패:', error);
            console.error('에러 상세:', JSON.stringify(error, null, 2));
            toast.error(LIBRARY_MESSAGES.BOOK_CREATE_FAILED);
            setIsSubmitting(false);
          },
        });
      } else {
        // 4. bookId가 있으면 바로 POST /library-book (도서관 도서 등록)
        const libraryBookData = {
          id: bookId,
          copies: Number(copies) || 1,
          deposit: Number(deposit.trim()) || 0,
          description: description,
          previewImages: uploadedImageUrls,
        };

        console.log('도서관 도서 등록 요청 데이터 (기존 도서):', libraryBookData);

        createLibraryBook(libraryBookData, {
          onSuccess: () => {
            toast.success(LIBRARY_MESSAGES.BOOK_CREATE_SUCCESS);
            navigate(ROUTES.LIBRARY);
          },
          onError: (error) => {
            console.error('도서관 도서 등록 실패:', error);
            toast.error(LIBRARY_MESSAGES.LIBRARY_BOOK_CREATE_FAILED);
            setIsSubmitting(false);
          },
        });
      }
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      toast.error(LIBRARY_MESSAGES.IMAGE_UPLOAD_FAILED);
      setIsSubmitting(false);
    }
  };

  return {
    submit,
    isSubmitting,
  };
}
