import { useEffect } from 'react';
import { motion, useAnimationControls, cubicBezier, type Transition } from 'framer-motion';
import Icon from '@components/icon';
import SplashTitle from '@images/splash-title.png';

const MAX_W = '43rem';

/** 레이아웃/사이즈(rem) */
const ELLIPSE_TOP_REM = 32.2;
const BOOK_W_REM = 4.6;
const TITLE_W_REM = 18.2;
const GAP_REM = -4;

/** 이징/스프링(빠르고 통통) */
const EASE = cubicBezier(1, 0, 0, 1);
const SPRING_BACK: Transition = { type: 'spring', stiffness: 820, damping: 16, mass: 1 }; // 중앙 복귀
const SPRING_SOFT: Transition = { type: 'spring', stiffness: 560, damping: 28, mass: 1 }; // 회전/슬라이드

/** rem → px */
function remToPx(rem: number): number {
  const base = parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
  return rem * base;
}

export default function SplashSequence() {
  const bgCtrl = useAnimationControls();
  const bigCircleCtrl = useAnimationControls();
  const ellipseCtrl = useAnimationControls();
  const fragmentsCtrl = useAnimationControls();
  const bookWrap = useAnimationControls(); // x, y, opacity
  const bookIcon = useAnimationControls(); // rotate, scale
  const titleCtrl = useAnimationControls(); // opacity, x

  useEffect(() => {
    const run = async () => {
      // 중앙(top) 기준
      const centerTopPx = window.innerHeight / 2 - remToPx(BOOK_W_REM / 2);
      const ellipseTopPx = remToPx(ELLIPSE_TOP_REM);
      const startYOffsetPx = ellipseTopPx - centerTopPx; // 아래에서 시작(양수)
      const overshootUpPx = remToPx(12); // 중앙 위로 6rem까지 튐

      // 타이틀이 들어오며 책이 중앙 기준 왼쪽으로 밀려야 하는 양
      const pushLeftPx = remToPx((TITLE_W_REM + GAP_REM) / 2); // ≈ 8.1rem
      const pushOvershootPx = pushLeftPx + remToPx(0.8); // 살짝 더 밀렸다가 돌아오게

      // 초기 상태(첫 화면 하늘색)
      await Promise.all([
        bgCtrl.set({ backgroundColor: 'var(--color-secondary-900)' }),
        bigCircleCtrl.set({ opacity: 1, display: 'block' }),
        ellipseCtrl.set({ scaleX: 1, scaleY: 1, opacity: 0.75, display: 'block' }),
        fragmentsCtrl.set({ opacity: 1, scale: 1, display: 'block' }),
        bookWrap.set({ x: 0, y: startYOffsetPx, opacity: 0 }),
        bookIcon.set({ rotate: 15, scale: 0.96 }),
        titleCtrl.set({ opacity: 0, x: remToPx(6) }), // 오른쪽 대기
      ]);

      // ① 아주 짧게 대기
      await new Promise((r) => setTimeout(r, 80));

      // ② 점프(오버슈트) + 배경전환 + 보조요소 페이드
      await Promise.all([
        ellipseCtrl.start({
          scaleX: [1, 0.9, 0.75, 0.6],
          scaleY: [1, 0.8, 0.65, 0.5],
          opacity: [0.75, 0.55, 0.4, 0],
          transition: { type: 'tween', duration: 0.6, ease: EASE, times: [0, 0.35, 0.7, 1] },
        }),
        fragmentsCtrl.start({
          opacity: [1, 0.15, 0],
          scale: [1, 0.9, 0.82],
          transition: { type: 'tween', duration: 0.36, ease: EASE, times: [0, 0.4, 1] },
          transitionEnd: { display: 'none' },
        }),
        bigCircleCtrl.start({ opacity: [1, 0.25, 0], transition: { type: 'tween', duration: 0.6, ease: EASE } }),
        bgCtrl.start({ backgroundColor: '#ffffff', transition: { type: 'tween', duration: 0.6, ease: EASE } }),
        // 책: 중앙을 지나 위로(오버슈트), 빠르게
        bookWrap.start({ y: -overshootUpPx, opacity: 1, transition: { type: 'tween', duration: 0.36, ease: EASE } }),
        bookIcon.start({ rotate: 8, scale: 1, transition: { type: 'tween', duration: 0.36, ease: EASE } }),
      ]);

      // 보조요소 제거
      await Promise.all([
        ellipseCtrl.start({ scaleX: 0, scaleY: 0, opacity: 0, transitionEnd: { display: 'none' } }),
        bigCircleCtrl.start({ opacity: 0, transitionEnd: { display: 'none' } }),
      ]);

      // ③ 중앙으로 스프링 복귀 + 회전 0°
      await Promise.all([
        bookWrap.start({ y: 0, transition: { ...SPRING_BACK, duration: 0.18 } }),
        bookIcon.start({ rotate: 0, transition: { ...SPRING_SOFT, duration: 0.18 } }),
      ]);

      // ④ 타이틀 인 + 책 '밀림'(오버슈트 → 최종)
      await Promise.all([
        // 책: 0 → -pushOvershootPx → -pushLeftPx
        bookWrap.start({
          x: [-pushOvershootPx, -pushLeftPx],
          transition: { type: 'tween', duration: 0.28, ease: EASE, times: [0, 1] },
        }),
        // 타이틀: 오른쪽에서 슬라이드 인
        titleCtrl.start({ opacity: 1, x: 0, transition: { ...SPRING_SOFT, duration: 0.28 } }),
      ]);
    };

    run();
  }, [bgCtrl, bigCircleCtrl, ellipseCtrl, fragmentsCtrl, bookWrap, bookIcon, titleCtrl]);

  return (
    <motion.section className='relative h-dvh w-full overflow-hidden' animate={bgCtrl}>
      <div className='relative mx-auto h-full w-full' style={{ maxWidth: MAX_W }}>
        {/* 좌상 큰 원(첫 화면 전용) */}
        <motion.div
          className='absolute rounded-[9999px]'
          style={{
            width: '78.4rem',
            height: '78.4rem',
            left: '-20.5rem',
            top: '-5.8rem',
            background: 'var(--color-secondary-900)',
          }}
          animate={bigCircleCtrl}
        />

        {/* 하단 타원(첫 화면 전용) */}
        <motion.div
          className='absolute'
          style={{ left: 'calc(50% - 12.7rem)', top: '32.2rem', width: '25.4rem', height: '7.5rem' }}
          animate={ellipseCtrl}
        >
          <svg viewBox='0 0 254 75' width='100%' height='100%'>
            <ellipse cx='127' cy='37.5' rx='127' ry='37.5' fill='#356B8E' />
          </svg>
        </motion.div>

        {/* 파편 */}
        <motion.div className='absolute' style={{ left: 'calc(50% - 5rem)', top: '42rem' }} animate={fragmentsCtrl}>
          <span
            className='absolute block h-[5.76rem] w-[5.76rem] rounded-[9999px] border-[0.6rem]'
            style={{ borderColor: 'var(--color-secondary-900)' }}
          />
          <span
            className='absolute top-[-2rem] left-[2.8rem] block h-[2.44rem] w-[2.44rem] rotate-[30deg] rounded-[0.16rem]'
            style={{ background: 'var(--color-secondary-900)' }}
          />
          <span
            className='absolute top-[7.7rem] left-[3rem] block h-[2.46rem] w-[2.46rem] rotate-[-150deg] rounded-[0.16rem]'
            style={{ background: 'var(--color-secondary-900)' }}
          />
        </motion.div>

        {/* 책 — 항상 정중앙 기준. y로 점프, 마지막에만 x로 밀림 */}
        <motion.div
          className='absolute z-[10] will-change-transform'
          style={{
            left: `calc(50% - ${BOOK_W_REM / 2}rem)`,
            top: `calc(50% - ${BOOK_W_REM / 2}rem)`,
          }}
          animate={bookWrap}
        >
          <motion.div animate={bookIcon} style={{ transformOrigin: '50% 50%' }}>
            <Icon name='booklink-open' className='h-[4.6rem] w-[4.6rem]' ariaHidden />
          </motion.div>
        </motion.div>

        {/* 타이틀 — 책은 중앙 고정, 타이틀만 오른쪽에서 등장 */}
        <motion.div
          className='absolute z-[10] flex items-center'
          style={{
            left: `calc(50%  + ${GAP_REM}rem)`,
            top: `calc(50% - ${BOOK_W_REM / 2}rem + 0.2rem)`,
          }}
          animate={titleCtrl}
          aria-label='BookLink'
          role='img'
        >
          <img src={SplashTitle} alt='타이틀로고' className='h-auto w-[18.2rem]' />
        </motion.div>
      </div>
    </motion.section>
  );
}
