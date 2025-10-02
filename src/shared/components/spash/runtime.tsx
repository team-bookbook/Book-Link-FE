import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import SplashSequence from './splash';
import { cn } from '@libs/cn';

type Props = {
  totalMs?: number;
  children: React.ReactNode;
  className?: string;
};

export default function SplashGateRuntime({ totalMs = 2000, className, children }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const shouldSkip = useMemo(() => Boolean(prefersReducedMotion), [prefersReducedMotion]);

  const [visible, setVisible] = useState<boolean>(() => !shouldSkip);

  useEffect(() => {
    if (shouldSkip) {
      setVisible(false);
      return;
    }

    setVisible(true);

    const t = window.setTimeout(
      () => {
        setVisible(false);
      },
      Math.max(0, totalMs)
    );

    return () => {
      window.clearTimeout(t);
    };
  }, [shouldSkip, totalMs]);

  useEffect(() => {
    const { style } = document.documentElement;
    const prevOverflow = style.overflow;

    if (visible) {
      style.overflow = 'hidden';
    } else {
      style.overflow = prevOverflow || '';
    }

    return () => {
      style.overflow = prevOverflow || '';
    };
  }, [visible]);

  return (
    <>
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            key='splash-overlay'
            className={cn('fixed inset-0 z-[9999] overflow-hidden', className)}
            role='dialog'
            aria-modal='true'
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'linear' }}
          >
            <SplashSequence />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
