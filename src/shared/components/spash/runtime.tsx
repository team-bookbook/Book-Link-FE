import { useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import SplashSequence from './splash';
import { cn } from '@libs/cn';

type Props = {
  /** 전체 러닝타임(ms). 1→2(900) + 2→3(700) + 3→4(400) = 2000ms */
  totalMs?: number;
  children: React.ReactNode;
  className?: string;
};

/** 스토리지 없이, 앱 최초 마운트 시에만 1회 표시 */
export default function SplashGateRuntime({ totalMs = 2000, className, children }: Props) {
  const [visible, setVisible] = useState<boolean>(true);
  const shownRef = useRef<boolean>(false); // 재렌더 시 중복 방지
  const prefersReducedMotion = useReducedMotion();

  // 접근성: reduce-motion이면 스킵
  const shouldSkip = useMemo(() => Boolean(prefersReducedMotion), [prefersReducedMotion]);

  useEffect(() => {
    if (shownRef.current) return; // 이미 한 번 처리함
    shownRef.current = true;

    if (shouldSkip) {
      setVisible(false);
      return;
    }

    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';

    const t = window.setTimeout(() => {
      setVisible(false);
      document.documentElement.style.overflow = prev;
    }, totalMs + 50);

    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = prev;
    };
  }, [shouldSkip, totalMs]);

  return (
    <>
      {children}
      {visible && (
        <div className={cn('fixed inset-0 z-[9999] bg-white', className)} role='dialog' aria-modal='true'>
          <SplashSequence />
        </div>
      )}
    </>
  );
}
