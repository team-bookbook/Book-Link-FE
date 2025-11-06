import { useState, useCallback } from 'react';
import { BarcodeScanner } from 'react-barcode-scanner';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';
import { toast } from '@libs/toast';
import Icon from '@components/icon';
import { validateISBN } from '@utils/isbn';
import { cn } from '@libs/cn';
import { useQuery } from '@tanstack/react-query';
import { bookQueries } from '@apis/book/book-queries';
import Button from '@components/button/button';

export default function BookScanPage() {
  const [scannedIsbn, setScannedIsbn] = useState<string>('');
  const navigate = useNavigate();

  // ISBN으로 도서 정보 조회
  const {
    data: bookInfo,
    isLoading: isLoadingBook,
    error: bookError,
  } = useQuery({
    ...bookQueries.GET_BOOK_BY_ISBN(scannedIsbn),
    enabled: !!scannedIsbn,
  });

  const handleCapture = useCallback(
    (barcodes: { rawValue: string }[]) => {
      if (!barcodes || barcodes.length === 0) return;
      if (scannedIsbn) return; // 이미 스캔된 경우 중복 방지

      const barcode = barcodes[0];
      const barcodeValue = barcode.rawValue;

      const validation = validateISBN(barcodeValue);

      if (!validation.valid) {
        toast.error(`ISBN이 아닙니다: ${validation.reason}`);
        console.log('유효하지 않은 바코드:', barcodeValue, validation.reason);
        return;
      }

      setScannedIsbn(validation.isbn!);
      toast.success(`${validation.type} 스캔 완료`);
    },
    [scannedIsbn]
  );

  const handleNavigateToCreate = () => {
    navigate(ROUTES.BOOK_CREATE, {
      state: {
        isbn: scannedIsbn,
        bookInfo: bookInfo || null,
      },
    });
  };

  return (
    <div className='flex h-[calc(100vh-55px)] flex-col bg-gray-900'>
      <div
        className={cn(
          'fixed top-[5.5rem] left-1/2 min-h-[4.5rem] w-full max-w-[43rem] -translate-x-1/2 bg-[#FAEAEA]',
          'z-1',
          'px-[1.6rem] py-[1.2rem]',
          'transition-all duration-300 ease-out'
        )}
      >
        <div className='flex-row-center'>
          <p className='text-system-error body5 flex-row-center gap-[0.4rem]'>
            <Icon name='clock' size={2} />
            바코드가 정렬될 수 있도록 카메라를 맞춰주세요!
          </p>
        </div>
      </div>

      <div className='flex flex-1 items-center justify-center'>
        <div className='relative h-full w-full'>
          <BarcodeScanner
            onCapture={handleCapture}
            options={{
              formats: ['ean_13', 'ean_8', 'code_128', 'code_39'],
            }}
            className='w-full object-cover'
          />

          {/* 스캔 가이드 오버레이 */}
          <div className='absolute inset-0 flex-col items-center justify-center gap-[6rem] px-[2rem] py-[5rem] pt-[10rem]'>
            <div className='relative min-h-[31rem] w-full'>
              <div className='absolute inset-0 rounded-3xl border-[0.3rem] border-gray-400' />

              {/* 그리드 선 */}
              <div className='absolute top-0 bottom-0 left-[25%] w-[0.1rem] bg-gray-50/30' />
              <div className='absolute top-0 bottom-0 left-[50%] w-[0.1rem] bg-gray-50/30' />
              <div className='absolute top-0 bottom-0 left-[75%] w-[0.1rem] bg-gray-50/30' />
              <div className='absolute top-[25%] right-0 left-0 h-[0.1rem] bg-gray-50/30' />
              <div className='absolute top-[50%] right-0 left-0 h-[0.1rem] bg-gray-50/30' />
              <div className='absolute top-[75%] right-0 left-0 h-[0.1rem] bg-gray-50/30' />

              {/* 모서리 강조 */}
              {/* 왼쪽 위 */}
              <div className='bg-gray-white absolute top-0 left-0 h-[0.5rem] w-[30%] rounded-tl-3xl' />
              <div className='bg-gray-white absolute top-0 left-0 h-[30%] w-[0.5rem] rounded-tl-3xl' />
              {/* 오른쪽 위 */}
              <div className='bg-gray-white absolute top-0 right-0 h-[0.5rem] w-[30%] rounded-tr-3xl' />
              <div className='bg-gray-white absolute top-0 right-0 h-[30%] w-[0.5rem] rounded-tr-3xl' />
              {/* 왼쪽 아래 */}
              <div className='bg-gray-white absolute bottom-0 left-0 h-[0.5rem] w-[30%] rounded-bl-3xl' />
              <div className='bg-gray-white absolute bottom-0 left-0 h-[30%] w-[0.5rem] rounded-bl-3xl' />
              {/* 오른쪽 아래 */}
              <div className='bg-gray-white absolute right-0 bottom-0 h-[0.5rem] w-[30%] rounded-br-3xl' />
              <div className='bg-gray-white absolute right-0 bottom-0 h-[30%] w-[0.5rem] rounded-br-3xl' />

              {/* 스캔 라인 애니메이션 */}
              <div className='scan-line absolute right-0 left-0 h-[0.2rem] bg-gray-50' />
            </div>
            {/* 하단 도서 미리보기 영역 */}
            <div className='min-h-[16.5rem] w-full rounded-[5px] bg-gray-800 px-[2rem] py-[2rem]'>
              {!scannedIsbn && (
                <div className='flex-col-center h-full gap-[1rem] text-gray-400'>
                  <Icon name='book' size={4} ariaHidden />
                  <p className='body5'>바코드를 스캔하면 도서 정보가 표시됩니다</p>
                </div>
              )}

              {scannedIsbn && isLoadingBook && (
                <div className='flex-col-center text-gray-white h-full gap-[1rem]'>
                  <Icon name='clock' size={4} ariaHidden className='animate-spin' />
                  <p className='body5'>도서 정보를 조회하는 중...</p>
                </div>
              )}

              {scannedIsbn && !isLoadingBook && bookError && (
                <div className='h-full flex-col justify-between'>
                  <div className='flex-col gap-[1rem]'>
                    <div className='flex-row items-start gap-[0.8rem]'>
                      <Icon name='alert-circle' size={2.4} className='text-system-error' ariaHidden />
                      <div className='flex-col gap-[0.4rem]'>
                        <p className='body5 text-gray-white'>도서 정보를 찾을 수 없습니다</p>
                        <p className='caption2 text-gray-400'>ISBN: {scannedIsbn}</p>
                      </div>
                    </div>
                    <p className='caption2 text-gray-400'>수동으로 도서 정보를 입력해주세요</p>
                  </div>
                  <Button
                    variant='primary'
                    fullWidth
                    onClick={handleNavigateToCreate}
                    className='py-[1.2rem]'
                    roundStyle='rounded-[12px]'
                  >
                    수동 입력하러 가기
                  </Button>
                </div>
              )}

              {scannedIsbn && bookInfo && !isLoadingBook && (
                <div className='h-full flex-col justify-between'>
                  <div className='flex-col gap-[1.2rem]'>
                    <div className='flex-row items-start gap-[0.8rem]'>
                      <Icon name='check' size={2.4} className='text-system-success' ariaHidden />
                      <div className='flex-1 flex-col gap-[0.4rem]'>
                        <p className='body5 text-gray-white'>{bookInfo.title}</p>
                        <p className='caption2 text-gray-400'>
                          {bookInfo.author} · {bookInfo.publisher}
                        </p>
                        <p className='caption2 text-gray-400'>정가: {bookInfo.originalPrice.toLocaleString()}원</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant='primary'
                    fullWidth
                    onClick={handleNavigateToCreate}
                    className='py-[1.2rem]'
                    roundStyle='rounded-[12px]'
                  >
                    도서 등록 계속하기
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 스캔 라인 애니메이션 CSS
      <style>{`
        @keyframes scan {
          0% {
            top: 0;
          }
          50% {
            top: calc(100% - 0.2rem);
          }
          100% {
            top: 0;
          }
        }

        .scan-line {
          animation: scan 2s ease-in-out infinite;
        }
      `}</style> */}
    </div>
  );
}
