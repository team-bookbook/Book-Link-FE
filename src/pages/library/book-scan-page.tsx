import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';
import { toast } from '@libs/toast';
import Icon from '@components/icon';
import { validateISBN } from '@utils/isbn';
import { cn } from '@libs/cn';
import { useQuery } from '@tanstack/react-query';
import { bookQueries } from '@apis/book/book-queries';
import Button from '@components/button/button';
import { useBarcodeScanner } from '@hooks/use-barcode-scanner';

export default function BookScanPage() {
  const [scannedIsbn, setScannedIsbn] = useState<string>('');
  const navigate = useNavigate();

  const handleCapture = useCallback(
    (barcodes: { rawValue: string }[]) => {
      if (!barcodes || barcodes.length === 0) return;
      if (scannedIsbn) return;

      const barcode = barcodes[0];
      const barcodeValue = barcode.rawValue;

      const validation = validateISBN(barcodeValue);

      if (!validation.valid) {
        console.log('유효하지 않은 바코드:', barcodeValue, validation.reason);
        return;
      }

      setScannedIsbn(validation.isbn!);
      toast.success(`${validation.type} 스캔 완료`);
    },
    [scannedIsbn]
  );

  const {
    scannerRef,
    isSupported,
    error: scannerError,
  } = useBarcodeScanner({
    onCapture: handleCapture,
    decodeInterval: 200, // 200ms 간격으로 디코드
    qrBoxSize: 250, // 스캔 박스 크기 (픽셀)
  });

  // ISBN으로 도서 정보 조회
  const {
    data: bookInfo,
    isLoading: isLoadingBook,
    error: bookError,
  } = useQuery({
    ...bookQueries.GET_BOOK_BY_ISBN(scannedIsbn),
    enabled: !!scannedIsbn,
  });

  const handleNavigateToCreate = () => {
    navigate(ROUTES.BOOK_CREATE, {
      state: {
        isbn: scannedIsbn,
        bookInfo: bookInfo || null,
      },
    });
  };

  // 바코드 스캐너 미지원 또는 에러 처리
  if (!isSupported || scannerError) {
    return (
      <div className='flex h-[calc(100vh-55px)] flex-col items-center justify-center bg-gray-900 px-[2rem]'>
        <div className='flex-col-center text-gray-white gap-[1rem]'>
          <Icon name='alert-circle' size={4} className='text-system-error' ariaHidden />
          <p className='body5 text-center'>{scannerError || '이 브라우저는 바코드 스캔을 지원하지 않습니다.'}</p>
        </div>
      </div>
    );
  }

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
        <div className='relative h-[calc(100vh-55px)] w-full'>
          {/* html5-qrcode 스캔 영역 */}
          <div
            ref={scannerRef}
            className='h-[calc(100vh-55px)] w-full'
            style={{
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
            }}
          />

          {/* 스캔 가이드 오버레이 */}
          <div className='pointer-events-none absolute inset-0 flex-col items-center justify-center gap-[4rem] px-[2rem]'>
            <div className='relative min-h-[25rem] w-full'>
              <div className='absolute inset-0 rounded-3xl border-[0.2rem] border-gray-400' />

              {/* 그리드 선 */}
              <div className='absolute top-0 bottom-0 left-[33%] w-[0.1rem] bg-gray-50/30' />
              <div className='absolute top-0 bottom-0 left-[66%] w-[0.1rem] bg-gray-50/30' />
              <div className='absolute top-[33%] right-0 left-0 h-[0.1rem] bg-gray-50/30' />
              <div className='absolute top-[66%] right-0 left-0 h-[0.1rem] bg-gray-50/30' />

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
            <div className='min-h-[16.5rem] w-full rounded-[5px] bg-gray-800 px-[2rem] py-[1rem]'>
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
                <div className='flex-row-center h-full gap-[2rem]'>
                  {/* 이미지 영역 */}
                  <div className='rouded-[5px] h-full min-w-[10rem] bg-gray-500'></div>
                  <div className='flex-col gap-[5px]'>
                    <p className='title4 text-gray-white'>{bookInfo.title}</p>
                    <p className='body5 text-gray-100'>{bookInfo.author}</p>
                    <div className='flex flex-wrap gap-[0.4rem]'>
                      <span className='flex-row-center caption5 rounded-[2px] bg-gray-100 px-[7px] text-gray-600'>
                        {bookInfo.publisher}
                      </span>
                      <span className='flex-row-center caption5 text-system-error rounded-[2px] bg-gray-100 px-[7px]'>
                        {bookInfo.originalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <button className='min-h-[4rem] min-w-[4rem] rounded-full bg-gray-200'></button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
      `}</style>
    </div>
  );
}
