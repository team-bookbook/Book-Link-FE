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
  const [invalidBarcode, setInvalidBarcode] = useState<string>('');
  const navigate = useNavigate();

  const handleCapture = useCallback(
    (barcodes: { rawValue: string }[]) => {
      if (!barcodes || barcodes.length === 0) return;
      if (scannedIsbn) return;

      console.log(scannedIsbn);
      const barcode = barcodes[0];
      const barcodeValue = barcode.rawValue;
      console.log(barcode, barcodeValue);
      const validation = validateISBN(barcodeValue);

      if (!validation.valid) {
        console.log('유효하지 않은 바코드:', barcodeValue, validation.reason);
        // 새 스캔 시 이전 상태 초기화
        setScannedIsbn('');
        setInvalidBarcode(barcodeValue);
        toast.error('유효하지 않은 바코드입니다');
        return;
      }

      // 새 스캔 시 이전 상태 초기화
      setInvalidBarcode('');
      setScannedIsbn(validation.isbn!);
      toast.success(`${validation.type} 스캔 완료`);
    },
    [scannedIsbn]
  );

  const { scannerRef } = useBarcodeScanner({
    onCapture: handleCapture,
    decodeInterval: 200,
    qrBoxSize: 300,
  });

  // ISBN으로 도서 정보 조회
  const {
    data: bookInfo,
    isLoading: isLoadingBook,
    error: bookError,
  } = useQuery({
    ...bookQueries.GET_BOOK_BY_ISBN(scannedIsbn),
    enabled: !!scannedIsbn,
    throwOnError: false,
  });

  const handleNavigateToCreate = () => {
    console.log(scannedIsbn, bookInfo);
    navigate(ROUTES.BOOK_CREATE, {
      state: {
        isbn: scannedIsbn,
        bookInfo: bookInfo || null,
      },
    });
  };

  return (
    <div className='bg-black' style={{ height: 'calc(100vh - 5.5rem - 5.7rem)' }}>
      <div
        className={cn(
          'fixed top-[5.5rem] right-0 left-0 min-h-[4.5rem] bg-[#FAEAEA]',
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

      <div className='flex pt-[4.5rem]'>
        <div className='w-full'>
          <div
            ref={scannerRef}
            className='w-full'
            style={{
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
              zIndex: 88,
            }}
          />

          <div className='mt-[1.5rem] w-full px-[2rem]'>
            <div className='flex-row-center h-full min-h-[14.5rem] w-full rounded-[5px] bg-gray-800 px-[2rem]'>
              {!scannedIsbn && !invalidBarcode && (
                <div className='flex-col-center gap-[1rem] text-gray-400'>
                  <p className='body5'>바코드를 스캔하면 도서 정보가 표시됩니다</p>
                </div>
              )}

              {invalidBarcode && (
                <div className='h-full flex-col py-[2rem]'>
                  <div className='flex-col gap-[1rem]'>
                    <div className='flex-row-center gap-[0.8rem]'>
                      <div className='gap-[0.4rem] text-center'>
                        <p className='body5 text-gray-white'>유효하지 않은 바코드입니다</p>
                        <p className='caption5 text-gray-400'>바코드: {invalidBarcode}</p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant='primary'
                    fullWidth
                    onClick={handleNavigateToCreate}
                    className='mt-[2rem] py-[1.2rem]'
                    roundStyle='rounded-[12px]'
                  >
                    직접 입력하기
                  </Button>
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
                  </div>
                  <Button
                    variant='primary'
                    fullWidth
                    onClick={handleNavigateToCreate}
                    className='mt-[2rem] py-[1.2rem]'
                    roundStyle='rounded-[12px]'
                  >
                    직접 입력하기
                  </Button>
                </div>
              )}

              {scannedIsbn && bookInfo && !isLoadingBook && (
                <div className='flex-row-center realtive h-full gap-[2rem]'>
                  {/* 이미지 영역 */}
                  <div className='h-[12.5rem] min-w-[10rem] rounded-2xl bg-gray-50'></div>
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
                  <button
                    className='min-h-[4rem] min-w-[4rem] rounded-full bg-gray-200'
                    onClick={handleNavigateToCreate}
                  >
                    <Icon name='back' size={2.4} className='text-primary-900 scale-x-[-1]'></Icon>
                  </button>
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
