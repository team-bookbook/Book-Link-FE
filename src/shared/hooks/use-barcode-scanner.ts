import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface UseBarcodeScanner {
  scannerRef: React.RefObject<HTMLDivElement | null>;
  isSupported: boolean;
  error: string | null;
  isScanning: boolean;
}

interface BarcodeScannerOptions {
  onCapture?: (barcodes: { rawValue: string }[]) => void;
  // 디코드 간격 (ms) - 기본 200ms
  decodeInterval?: number;
  // 스캔 박스 크기 (픽셀)
  qrBoxSize?: number;
}

export function useBarcodeScanner(options: BarcodeScannerOptions = {}): UseBarcodeScanner {
  const { onCapture, decodeInterval = 200, qrBoxSize = 250 } = options;

  const scannerRef = useRef<HTMLDivElement>(null);
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const mountedRef = useRef<boolean>(true);
  const scannerIdRef = useRef<string>(`qr-reader-${Date.now()}`);
  const isScannerStartedRef = useRef<boolean>(false); // 스캐너 시작 여부 추적

  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    mountedRef.current = true;

    const startScanning = async () => {
      if (!mountedRef.current || !scannerRef.current) {
        return;
      }

      try {
        console.log('바코드 스캐너 초기화 시작');

        // scannerRef에 id 설정 (없으면 자동 생성)
        if (!scannerRef.current.id) {
          scannerRef.current.id = scannerIdRef.current;
        } else {
          scannerIdRef.current = scannerRef.current.id;
        }

        // html5-qrcode 인스턴스 생성
        const html5QrCode = new Html5Qrcode(scannerIdRef.current);
        html5QrCodeRef.current = html5QrCode;

        // FPS 계산 (decodeInterval을 fps로 변환)
        const fps = Math.round(1000 / decodeInterval);

        // 카메라 설정
        const config = {
          fps: fps,
          qrbox: { width: qrBoxSize + 20, height: 250 },
          aspectRatio: 1.0,
          // 바코드 포맷 지정
          formatsToSupport: [
            13, // EAN_13
          ],
        };

        // 성공 콜백
        const qrCodeSuccessCallback = (decodedText: string) => {
          console.log('✅ 바코드 인식 성공:', decodedText);
          onCapture?.([{ rawValue: decodedText }]);
        };

        // 에러 콜백 (바코드를 찾지 못한 경우 - 정상 동작)
        const qrCodeErrorCallback = () => {
          console.log('동작 프레임');
          // 바코드를 찾지 못한 경우는 에러로 처리하지 않음
        };

        // 카메라 시작
        await html5QrCode.start(
          { facingMode: 'environment' }, // 후면 카메라
          config,
          qrCodeSuccessCallback,
          qrCodeErrorCallback
        );

        // start가 성공했음을 표시
        isScannerStartedRef.current = true;

        if (!mountedRef.current) {
          await html5QrCode.stop();
          isScannerStartedRef.current = false;
          return;
        }

        console.log('바코드 스캐너 시작 완료');
        setIsScanning(true);
        setError(null);
      } catch (err) {
        if (!mountedRef.current) {
          console.log('언마운트된 컴포넌트의 에러는 무시');
          return;
        }

        const error = err as Error;
        console.error('카메라 접근 오류:', error);

        let errorMessage = '카메라 접근에 실패했습니다';
        if (error.message.includes('NotFoundError') || error.message.includes('not found')) {
          errorMessage = '카메라를 찾을 수 없습니다. 카메라가 연결되어 있는지 확인해주세요.';
        } else if (error.message.includes('NotAllowedError') || error.message.includes('Permission')) {
          errorMessage = '카메라 접근 권한이 거부되었습니다. 브라우저 설정에서 카메라 권한을 허용해주세요.';
        } else if (error.message.includes('NotReadableError')) {
          errorMessage = '카메라가 이미 다른 곳에서 사용 중입니다.';
        }

        setError(errorMessage);
        setIsScanning(false);
        setIsSupported(false);
      }
    };

    startScanning();

    // 클린업
    return () => {
      console.log('바코드 스캐너 클린업 시작');
      mountedRef.current = false;

      // html5-qrcode 중지 (실제로 시작된 경우에만)
      if (html5QrCodeRef.current && isScannerStartedRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            console.log('바코드 스캐너 중지 완료');
            html5QrCodeRef.current?.clear();
            html5QrCodeRef.current = null;
            isScannerStartedRef.current = false;
          })
          .catch((err) => {
            console.error('바코드 스캐너 중지 오류:', err);
          });
      } else if (html5QrCodeRef.current) {
        // 시작되지 않았지만 인스턴스가 있는 경우 clear만 호출
        try {
          html5QrCodeRef.current.clear();
          html5QrCodeRef.current = null;
        } catch (err) {
          console.error('바코드 스캐너 clear 오류:', err);
        }
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    scannerRef,
    isSupported,
    error,
    isScanning,
  };
}
