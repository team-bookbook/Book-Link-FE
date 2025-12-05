import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';
import { toast } from '@libs/toast';
import { modal } from '@libs/modal';
import Icon from '@components/icon';
import { validateISBN } from '@utils/isbn';
import { cn } from '@libs/cn';
import { useQuery } from '@tanstack/react-query';
import { bookQueries } from '@apis/book/book-queries';
import Button from '@components/button/button';
import { useBarcodeScanner } from '@hooks/use-barcode-scanner';
import { memberQueries } from '@apis/member/member-queries';
import { isAuthenticated } from '@utils/auth';

export default function BookScanPage() {
  const [scannedIsbn, setScannedIsbn] = useState<string>('');
  const [invalidBarcode, setInvalidBarcode] = useState<string>('');
  const navigate = useNavigate();

  const { data: memberData } = useQuery({
    ...memberQueries.GET_ME(),
    enabled: isAuthenticated(),
  });

  const handleCapture = useCallback(
    (barcodes: { rawValue: string }[]) => {
      if (!barcodes || barcodes.length === 0) return;
      if (scannedIsbn) return;

      const barcode = barcodes[0];
      const barcodeValue = barcode.rawValue;
      const validation = validateISBN(barcodeValue);

      if (!validation.valid) {
        console.log('유효하지 않은 바코드:', barcodeValue, validation.reason);
        setScannedIsbn('');
        setInvalidBarcode(barcodeValue);
        toast.error('유효하지 않은 바코드입니다');
        return;
      }

      setInvalidBarcode('');
      setScannedIsbn(validation.isbn!);
      toast.success(`${validation.type} 스캔 완료`);
    },
    [scannedIsbn]
  );

  const { scannerRef, error: cameraError } = useBarcodeScanner({
    onCapture: handleCapture,
    decodeInterval: 200,
    qrBoxSize: 300,
  });

  // 도서관 등록 여부 확인
  useEffect(() => {
    if (memberData && memberData.libraryId === null) {
      const handleNoLibrary = async () => {
        const confirmed = await modal.confirm({
          title: '도서관 등록 필요',
          description: '도서를 등록하려면 먼저 도서관을 생성해야 합니다.\n도서관을 생성하시겠습니까?',
          confirmText: '생성하기',
        });

        if (confirmed.ok) {
          navigate(ROUTES.LIBRARY_CREATE);
        } else {
          navigate(ROUTES.LIBRARY);
        }
      };

      handleNoLibrary();
    }
  }, [memberData, navigate]);

  // 카메라 에러 처리 (카메라를 찾을 수 없는 경우만)
  useEffect(() => {
    console.log(cameraError);
    if (cameraError) {
      const handleCameraError = async () => {
        const confirmed = await modal.confirm({
          title: '카메라 연결 실패',
          description: `카메라가 연결되어있지 않습니다. \n직접 입력하시겠습니까?`,
        });

        if (confirmed.ok) {
          navigate(ROUTES.BOOK_CREATE, {
            state: {
              isbn: '',
              bookInfo: null,
            },
          });
        } else {
          navigate(ROUTES.LIBRARY, {
            state: {
              isbn: '',
              bookInfo: null,
            },
          });
        }
      };

      handleCameraError();
    }
  }, [cameraError, navigate]);

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
    <div className='flex w-full flex-col bg-black' style={{ height: 'calc(100vh - 5.5rem)' }}>
      <div
        className={cn(
          'relative right-0 left-0 min-h-[4.5rem] w-full bg-[#FAEAEA]',
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

      <div className='relative flex flex-1 flex-col overflow-hidden'>
        <div className='flex w-full flex-1 flex-col'>
          <div
            ref={scannerRef}
            className='min-h-[300px] w-full flex-shrink-0'
            style={{
              WebkitTransform: 'translateZ(0)',
              transform: 'translateZ(0)',
            }}
          />

          <div className='absolute right-0 bottom-[1.5rem] left-0 w-full px-[2rem]'>
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
