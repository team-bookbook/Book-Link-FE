import { createContext, useContext, useMemo, useRef, useState, useEffect } from 'react';
import type { HeaderProps } from '@layouts/header';

type HeaderContextValue = {
  header: HeaderProps;
  setHeader: (next: HeaderProps) => void;
  patchHeader: (next: Partial<HeaderProps>) => void;
  resetHeader: () => void;
};

const defaultHeader: HeaderProps = {
  left: 'logo',
  title: 'BookLink',
  actions: ['search', 'bell'],
  notificationCount: 0,
  searchMode: false,
  safeTop: true,
};

const HeaderContext = createContext<HeaderContextValue | null>(null);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [header, setHeader] = useState<HeaderProps>(defaultHeader);
  const initialRef = useRef(defaultHeader);

  const api = useMemo<HeaderContextValue>(
    () => ({
      header,
      setHeader,
      patchHeader: (next) => setHeader((prev) => ({ ...prev, ...next })),
      resetHeader: () => setHeader(initialRef.current),
    }),
    [header]
  );

  return <HeaderContext.Provider value={api}>{children}</HeaderContext.Provider>;
}

export function useHeaderStore() {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error('useHeaderStore must be used within <HeaderProvider>');
  return ctx;
}

/** 페이지에서 한 번에 설정/언마운트시 자동 복구 */
export function useHeaderEffect(next: Partial<HeaderProps>, deps: React.DependencyList = []) {
  const { patchHeader, header, setHeader } = useHeaderStore();
  const prevRef = useRef<HeaderProps | null>(null);

  useEffect(() => {
    // 이전 상태 백업 후 패치
    if (!prevRef.current) prevRef.current = header;
    patchHeader(next);

    return () => {
      // 언마운트 시 원복
      if (prevRef.current) setHeader(prevRef.current);
      prevRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps); // 의존성은 호출 측에서 컨트롤
}
