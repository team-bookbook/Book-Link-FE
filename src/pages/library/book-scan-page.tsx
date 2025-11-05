import { useState, useCallback } from 'react';
import { BarcodeScanner } from 'react-barcode-scanner';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routes-config';
import { toast } from '@libs/toast';
import Button from '@components/button/button';
import Icon from '@components/icon';
import { validateISBN } from '@utils/isbn';
import { cn } from '@libs/cn';

export default function BookScanPage() {
  const [scanning, setScanning] = useState(true);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCapture = useCallback(
    (barcodes: { rawValue: string }[]) => {
      if (!barcodes || barcodes.length === 0) return;

      const barcode = barcodes[0];
      const barcodeValue = barcode.rawValue;

      const validation = validateISBN(barcodeValue);

      if (!validation.valid) {
        toast.error(`ISBN이 아닙니다: ${validation.reason}`);
        console.log('유효하지 않은 바코드:', barcodeValue, validation.reason);
        return;
      }

      // 유효한 ISBN 바코드 스캔 성공
      setScannedCode(validation.isbn!);
      setScanning(false);
      toast.success(`${validation.type} 스캔 완료`);

      // TODO: 바코드로 도서 정보 조회 API 호출
      // 현재는 book-create 페이지로 이동하며 ISBN을 전달
      setTimeout(() => {
        navigate(ROUTES.BOOK_CREATE, {
          state: { isbn: validation.isbn },
        });
      }, 1500);
    },
    [navigate]
  );

  const handleRescan = () => {
    setScannedCode(null);
    setScanning(true);
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
        {scanning ? (
          <div className='relative h-full w-full'>
            <BarcodeScanner
              onCapture={handleCapture}
              options={{
                formats: ['ean_13', 'ean_8', 'code_128', 'code_39'],
              }}
              className='w-full object-cover'
            />

            {/* 스캔 가이드 오버레이 */}
            <div className='absolute inset-0 mt-[10rem] flex-col items-center px-[2rem]'>
              <div className='relative h-[50%] w-full'>
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
            </div>
          </div>
        ) : (
          // 스캔 완료 상태
          <div className='flex flex-col items-center gap-[2.4rem] px-[2rem]'>
            <Icon name='check' size={6.4} className='text-primary-500' />
            <div className='flex flex-col items-center gap-[0.8rem]'>
              <h2 className='title3 text-gray-white'>스캔 완료</h2>
              <p className='body3 text-gray-300'>ISBN: {scannedCode}</p>
            </div>
            <Button variant='outline' onClick={handleRescan} className='min-w-[20rem]'>
              다시 스캔하기
            </Button>
          </div>
        )}
      </div>

      {/* 안내 텍스트 */}
      {scanning && (
        <div className='absolute right-0 bottom-[4rem] left-0 px-[2rem] text-center'>
          <p className='body4 text-gray-white'>바코드를 카메라에 비춰주세요</p>
          <p className='caption2 mt-[0.8rem] text-gray-400'>자동으로 바코드를 인식합니다</p>
        </div>
      )}

      {/* 스캔 라인 애니메이션 CSS */}
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
