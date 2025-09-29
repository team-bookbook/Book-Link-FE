import { useCallback, useRef } from 'react';

type DaumPostcodeData = {
  zonecode: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  bname: string;
  sido: string;
  sigungu: string;
};

type DaumPostcodeCtor = new (options: { oncomplete: (data: DaumPostcodeData) => void }) => { open: () => void };

type DaumNamespace = { Postcode: DaumPostcodeCtor };

declare global {
  interface Window {
    daum?: DaumNamespace;
  }
}

export default function useDaumPostcode() {
  const loadingRef = useRef(false);
  const loadedRef = useRef(false);
  const waitersRef = useRef<Array<() => void>>([]);

  const ensureScript = useCallback(() => {
    if (loadedRef.current) {
      return Promise.resolve();
    }
    if (loadingRef.current) {
      return new Promise<void>((resolve) => {
        waitersRef.current.push(resolve);
      });
    }

    loadingRef.current = true;

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      script.async = true;
      script.onload = () => {
        loadedRef.current = true;
        loadingRef.current = false;
        resolve();
        waitersRef.current.forEach((fn) => fn());
        waitersRef.current = [];
      };
      script.onerror = () => {
        loadingRef.current = false;
        reject(new Error('Failed to load Daum Postcode script'));
      };
      document.head.appendChild(script);
    });
  }, []);

  const openPostcode = useCallback(
    async (onComplete: (d: DaumPostcodeData) => void) => {
      await ensureScript();
      const ns = window.daum;
      if (!ns) throw new Error('Daum namespace not found after script load');
      const instance = new ns.Postcode({ oncomplete: onComplete });
      instance.open();
    },
    [ensureScript]
  );

  return openPostcode;
}
