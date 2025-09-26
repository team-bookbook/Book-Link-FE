import { useEffect, useMemo, useRef, useState } from 'react';

type GuardResult = { visible: boolean; bottomStyle: React.CSSProperties };

export default function useFloatingButtonGuard(): GuardResult {
  const [sheetOverlapPx, setSheetOverlapPx] = useState(0);
  const [sheetOpenedRatio, setSheetOpenedRatio] = useState(0);
  const [navVisiblePx, setNavVisiblePx] = useState(0);

  const [dirUp, setDirUp] = useState(true);
  const lastPosRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const getSheet = () =>
      (typeof document === 'undefined' ? null : document.querySelector('[data-bottom-sheet]')) as Element | null;
    const getNav = () => (typeof document === 'undefined' ? null : document.getElementById('bottom-nav'));
    const getScroller = () => (typeof document === 'undefined' ? null : document.getElementById('content'));

    const readScroll = () => {
      const scroller = getScroller();
      return scroller ? scroller.scrollTop : typeof window !== 'undefined' ? window.scrollY : 0;
    };

    const updateSheet = () => {
      const sheet = getSheet();
      if (!sheet) {
        setSheetOverlapPx(0);
        setSheetOpenedRatio(0);
        return;
      }
      const rect = sheet.getBoundingClientRect();
      const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
      const overlap = rect.top < vh ? Math.max(0, vh - rect.top) : 0; // 실제 노출분
      const opened = rect.height > 0 ? Math.min(1, overlap / rect.height) : 0;
      setSheetOverlapPx(overlap);
      setSheetOpenedRatio(opened);
    };

    const updateNav = () => {
      const nav = getNav();
      if (!nav) {
        setNavVisiblePx(0);
        return;
      }
      const rect = nav.getBoundingClientRect();
      const vh = typeof window !== 'undefined' ? window.innerHeight : 0;
      const visible = Math.min(Math.max(0, vh - rect.top), rect.height);
      setNavVisiblePx(visible);
    };

    const updateAll = () => {
      updateSheet();
      updateNav();
    };

    const HIDE_THRESHOLD = 10; // 아래로 이만큼 내려가면 down
    const REVEAL_THRESHOLD = 6; // 위로 이만큼 올리면 up

    const onScroll: EventListener = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const current = readScroll();
        const delta = current - lastPosRef.current;

        if (delta > HIDE_THRESHOLD && current > 16) {
          if (dirUp) setDirUp(false); // down
          lastPosRef.current = current;
        } else if (delta < -REVEAL_THRESHOLD) {
          if (!dirUp) setDirUp(true); // up
          lastPosRef.current = current;
        }

        updateAll();
        tickingRef.current = false;
      });
    };

    const onResize = () => updateAll();
    const onTouchMove = () => updateAll();

    lastPosRef.current = readScroll();
    updateAll();

    const scroller = getScroller();
    if (scroller) {
      scroller.addEventListener('scroll', onScroll, { passive: true });
    } else if (typeof window !== 'undefined') {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', onResize);
      window.addEventListener('touchmove', onTouchMove, { passive: true });
    }

    let roSheet: ResizeObserver | null = null;
    let roNav: ResizeObserver | null = null;
    let moSheet: MutationObserver | null = null;
    let moNav: MutationObserver | null = null;

    if (typeof ResizeObserver !== 'undefined') {
      const s = getSheet();
      const n = getNav();
      if (s) {
        roSheet = new ResizeObserver(updateSheet);
        roSheet.observe(s);
      }
      if (n) {
        roNav = new ResizeObserver(updateNav);
        roNav.observe(n);
      }
    }
    if (typeof MutationObserver !== 'undefined') {
      const s = getSheet();
      const n = getNav();
      if (s) {
        moSheet = new MutationObserver(updateSheet);
        moSheet.observe(s, { attributes: true, attributeFilter: ['style', 'class', 'inert', 'aria-hidden'] });
      }
      if (n) {
        moNav = new MutationObserver(updateNav);
        moNav.observe(n, { attributes: true, attributeFilter: ['style', 'class', 'aria-hidden'] });
      }
    }

    return () => {
      if (scroller) scroller.removeEventListener('scroll', onScroll);
      else if (typeof window !== 'undefined') window.removeEventListener('scroll', onScroll);
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', onResize);
        window.removeEventListener('touchmove', onTouchMove);
      }
      if (roSheet) roSheet.disconnect();
      if (roNav) roNav.disconnect();
      if (moSheet) moSheet.disconnect();
      if (moNav) moNav.disconnect();
    };
  }, [dirUp]);

  const visible = sheetOpenedRatio < 0.35;

  const gapRem = 1.6;
  const downBiasRem = 3.5;
  const liftWhenUpRem = 3.5;

  const bottomStyle: React.CSSProperties = useMemo(() => {
    const base = `calc(${gapRem}rem + ${navVisiblePx}px + ${sheetOverlapPx}px + env(safe-area-inset-bottom))`;
    return { bottom: dirUp ? `calc(${base} + ${liftWhenUpRem}rem)` : `calc(${base} + ${downBiasRem}rem)` };
  }, [dirUp, navVisiblePx, sheetOverlapPx]);

  return { visible, bottomStyle };
}
