import { useEffect } from 'react';
import { motion, useAnimationControls, cubicBezier, type Transition } from 'framer-motion';
import Icon from '@components/icon';
import SplashTitle from '@images/splash-title.png';

const MAX_W = '43rem';
const ELLIPSE_TOP_REM = 32.2;
const BOOK_W_REM = 4.6;
const TITLE_W_REM = 18.2;
const GAP_REM = -4;

const EASE = cubicBezier(1, 0, 0, 1);
const SPRING_BACK: Transition = { type: 'spring', stiffness: 820, damping: 16, mass: 1 };
const SPRING_SOFT: Transition = { type: 'spring', stiffness: 560, damping: 28, mass: 1 };

function remToPx(rem: number): number {
  const base = parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
  return rem * base;
}

export default function Splash() {
  const bgCtrl = useAnimationControls();
  const bigCircleCtrl = useAnimationControls();
  const ellipseSvgCtrl = useAnimationControls();
  const ellipseCtrl = useAnimationControls();
  const fragmentsCtrl = useAnimationControls();
  const bookWrap = useAnimationControls();
  const bookIcon = useAnimationControls();
  const titleCtrl = useAnimationControls();

  useEffect(() => {
    const run = async () => {
      const centerTopPx = window.innerHeight / 2 - remToPx(BOOK_W_REM / 2);
      const ellipseTopPx = remToPx(ELLIPSE_TOP_REM);
      const startYOffsetPx = ellipseTopPx - centerTopPx;
      const overshootUpPx = remToPx(12);
      const PUSH_EXTRA_REM = 2;
      const pushLeftPx = remToPx((TITLE_W_REM + GAP_REM) / 2 + PUSH_EXTRA_REM);
      const pushOvershootPx = pushLeftPx + remToPx(0.8);

      await Promise.all([
        bgCtrl.set({ backgroundColor: 'var(--color-secondary-900)' }),
        bigCircleCtrl.set({ opacity: 1, display: 'block' }),
        ellipseSvgCtrl.set({ opacity: 1, display: 'block' }),
        ellipseCtrl.set({ rx: 127, ry: 37.5 }),
        fragmentsCtrl.set({ opacity: 1, scale: 1, display: 'block' }),
        bookWrap.set({ x: 0, y: startYOffsetPx, opacity: 0 }),
        bookIcon.set({ rotate: 15, scale: 0.96 }),
        titleCtrl.set({ opacity: 0, x: remToPx(6) }),
      ]);

      await new Promise((r) => setTimeout(r, 80));

      await Promise.all([
        ellipseCtrl.start({
          rx: [127, 117, 110, 100, 90, 80, 70, 60, 24, 12, 8, 5, 0],
          ry: [37.5, 32, 25, 25, 21, 18, 12, 8, 3, 0],
          transition: { type: 'tween', duration: 0.5, ease: EASE, times: [0, 0.15, 0.3, 0.5, 0.72, 0.9, 1] },
        }),
        ellipseSvgCtrl.start({
          opacity: [1, 0.9, 0.5, 0.15, 0],
          transition: { type: 'tween', duration: 0.5, ease: EASE, times: [0, 0.3, 0.6, 0.85, 1] },
        }),
        fragmentsCtrl.start({
          opacity: [1, 0.15, 0],
          scale: [1, 0.9, 0.82],
          transition: { type: 'tween', duration: 0.36, ease: EASE, times: [0, 0.4, 1] },
          transitionEnd: { display: 'none' },
        }),
        bigCircleCtrl.start({ opacity: [1, 0.25, 0], transition: { type: 'tween', duration: 0.6, ease: EASE } }),
        bgCtrl.start({ backgroundColor: '#ffffff', transition: { type: 'tween', duration: 0.6, ease: EASE } }),
        bookWrap.start({ y: -overshootUpPx, opacity: 1, transition: { type: 'tween', duration: 0.38, ease: EASE } }),
        bookIcon.start({ rotate: 8, scale: 1, transition: { type: 'tween', duration: 0.38, ease: EASE } }),
      ]);

      await Promise.all([
        ellipseSvgCtrl.start({ opacity: 0, transitionEnd: { display: 'none' } }),
        bigCircleCtrl.start({ opacity: 0, transitionEnd: { display: 'none' } }),
      ]);

      await Promise.all([
        bookWrap.start({ y: 0, transition: { ...SPRING_BACK, duration: 0.18 } }),
        bookIcon.start({ rotate: 0, transition: { ...SPRING_SOFT, duration: 0.18 } }),
      ]);

      await Promise.all([
        bookWrap.start({
          x: [-pushOvershootPx, -pushLeftPx],
          transition: { type: 'tween', duration: 0.28, ease: EASE, times: [0, 1] },
        }),
        titleCtrl.start({ opacity: 1, x: 0, transition: { ...SPRING_SOFT, duration: 0.28 } }),
      ]);
    };

    run();
  }, [bgCtrl, bigCircleCtrl, ellipseSvgCtrl, ellipseCtrl, fragmentsCtrl, bookWrap, bookIcon, titleCtrl]);

  return (
    <motion.section className='relative h-dvh w-full overflow-hidden' animate={bgCtrl}>
      <div className='relative mx-auto h-full w-full' style={{ maxWidth: MAX_W }}>
        <motion.div
          className='absolute rounded-[9999px] will-change-transform'
          style={{
            width: '78.4rem',
            height: '78.4rem',
            left: '-20.5rem',
            top: '-5.8rem',
            background: 'var(--color-secondary-900)',
          }}
          animate={bigCircleCtrl}
        />

        <motion.svg
          className='absolute will-change-transform'
          style={{ left: 'calc(50% - 12.7rem)', top: `${ELLIPSE_TOP_REM}rem`, width: '25.4rem', height: '7.5rem' }}
          viewBox='0 0 254 75'
          animate={ellipseSvgCtrl}
        >
          <motion.ellipse
            cx='127'
            cy='37.5'
            animate={ellipseCtrl}
            style={{ transform: 'translateZ(0)' }}
            fill='#356B8E'
          />
        </motion.svg>

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

        <motion.div
          className='absolute z-[10] will-change-transform'
          style={{
            left: `calc(50% - ${BOOK_W_REM / 2}rem)`,
            top: `calc(48% - ${BOOK_W_REM / 2}rem)`,
          }}
          animate={bookWrap}
        >
          <motion.div animate={bookIcon} style={{ transformOrigin: '50% 50%' }}>
            <Icon name='booklink-open' size={7} ariaHidden />
          </motion.div>
        </motion.div>

        <motion.div
          className='absolute z-[10] flex items-center'
          style={{
            left: `calc(50% + ${GAP_REM}rem)`,
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
