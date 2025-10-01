import { useEffect } from 'react';
import { motion, useAnimationControls, cubicBezier, type Transition } from 'framer-motion';
import Icon from '@components/icon';
import SplashTitle from '@images/splash-title.png';

const MAX_W = '43rem';

/** 위치(모두 rem) */
const ELLIPSE_TOP_REM = 32.2; // 하단 타원 시작 y
const BOOK_CENTER_TOP_REM = 18; // 책이 중앙에 착지할 y

/** 사이즈(모두 rem) */
const BOOK_W_REM = 4.6;
const TITLE_W_REM = 18.2;
const GAP_REM = -2; // 디자인 상 겹치게(-2rem)
const GROUP_W_REM = BOOK_W_REM + GAP_REM + TITLE_W_REM;
const GROUP_HALF_REM = GROUP_W_REM / 2;

const EASE = cubicBezier(1, 0, 0, 1);
const SPRING_STRONG: Transition = { type: 'spring', stiffness: 600, damping: 17, mass: 1 };
const SPRING_SOFT: Transition = { type: 'spring', stiffness: 400, damping: 30, mass: 1 };

function remToPx(rem: number): number {
  const base = parseFloat(getComputedStyle(document.documentElement).fontSize || '16');
  return rem * base;
}

export default function SplashSequence() {
  const bgCtrl = useAnimationControls();
  const bigCircleCtrl = useAnimationControls();
  const ellipseCtrl = useAnimationControls();
  const fragmentsCtrl = useAnimationControls();
  const bookWrap = useAnimationControls(); // y/x/opacity
  const bookIcon = useAnimationControls(); // rotate/scale
  const titleCtrl = useAnimationControls();

  useEffect(() => {
    const run = async () => {
      const deltaUpPx = remToPx(BOOK_CENTER_TOP_REM - ELLIPSE_TOP_REM); // 타원y → 중앙y (음수)
      const overshootPx = remToPx(-16); // 위로 더 튀기
      const settleDipPx = remToPx(1.2); // 바운스용 살짝 눌림(+)
      const bookLeftShiftPx = remToPx(GROUP_HALF_REM); // 로고 등장 시 왼쪽 이동

      // 초기 상태
      await Promise.all([
        bgCtrl.set({ backgroundColor: 'var(--color-secondary-900)' }),
        bigCircleCtrl.set({ opacity: 1, display: 'block' }),
        ellipseCtrl.set({ scaleX: 1, scaleY: 1, opacity: 0.75, display: 'block' }),
        fragmentsCtrl.set({ opacity: 1, scale: 1, display: 'block' }),
        bookWrap.set({ y: 0, x: 0, opacity: 0 }),
        bookIcon.set({ rotate: 15, scale: 0.96 }),
        titleCtrl.set({ opacity: 0, x: -remToPx(1.6) }),
      ]);

      // ① 100ms 대기
      await new Promise((r) => setTimeout(r, 100));

      // ② 0.8s: 점프 + 배경 전환 + 파편/큰원 페이드
      await Promise.all([
        ellipseCtrl.start({
          scaleX: [1, 0.9, 0.7],
          scaleY: [1, 0.9, 0.7],
          opacity: [0.75, 0.6, 0.45],
          transition: { type: 'tween', duration: 0.8, ease: EASE, times: [0, 0.3, 1] },
        }),
        bookWrap.start({
          y: [0, overshootPx, deltaUpPx], // 아래→위 오버슈트→중앙
          opacity: [0, 0.2, 1],
          transition: { type: 'tween', duration: 0.8, ease: EASE, times: [0, 0.35, 1] },
        }),
        // (점프 중엔 회전 10°까지만 풀어둠)
        bookIcon.start({ rotate: 10, scale: 1, transition: { ...SPRING_STRONG, duration: 0.8 } }),
        bgCtrl.start({ backgroundColor: '#ffffff', transition: { type: 'tween', duration: 0.8, ease: EASE } }),
        bigCircleCtrl.start({ opacity: [1, 0.3, 0], transition: { type: 'tween', duration: 0.8, ease: EASE } }),
        fragmentsCtrl.start({
          opacity: [1, 0.2, 0],
          scale: [1, 0.92, 0.85],
          transition: { type: 'tween', duration: 0.5, ease: EASE, times: [0, 0.4, 1] },
          transitionEnd: { display: 'none' },
        }),
      ]);

      // ②-추가: 하단 타원/큰 원 제거(display:none)
      await Promise.all([
        ellipseCtrl.start({
          scaleX: 0,
          scaleY: 0,
          opacity: 0,
          transition: { type: 'tween', duration: 0.25, ease: EASE },
          transitionEnd: { display: 'none' },
        }),
        bigCircleCtrl.start({ opacity: 0, transitionEnd: { display: 'none' } }),
      ]);

      // ②b 센터 바운스(회전 0으로 정렬 + 살짝 눌렸다 되돌아오는 느낌)
      await bookWrap.start({ y: deltaUpPx + settleDipPx, transition: { ...SPRING_SOFT, duration: 0.18 } });
      await Promise.all([
        bookWrap.start({ y: deltaUpPx, transition: { ...SPRING_SOFT, duration: 0.32 } }),
        bookIcon.start({ rotate: 0, scale: 1, transition: { ...SPRING_SOFT, duration: 0.32 } }),
      ]);

      // ③ 로고 등장 + 책을 왼쪽으로 밀어 그룹 중앙 정렬
      await Promise.all([
        bookWrap.start({ x: -bookLeftShiftPx, transition: { ...SPRING_SOFT, duration: 0.4 } }),
        titleCtrl.start({ opacity: 1, x: 0, transition: { ...SPRING_SOFT, duration: 0.4, delay: 0.02 } }),
      ]);
    };

    run();
  }, [bgCtrl, bigCircleCtrl, ellipseCtrl, fragmentsCtrl, bookWrap, bookIcon, titleCtrl]);

  return (
    <motion.section className='relative h-dvh w-full overflow-hidden' animate={bgCtrl}>
      <div className='relative mx-auto h-full w-full' style={{ maxWidth: MAX_W }}>
        {/* 좌상 큰 원 */}
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

        {/* 하단 타원 */}
        <motion.div
          className='absolute'
          style={{ left: 'calc(50% - 12.7rem)', top: `${ELLIPSE_TOP_REM}rem`, width: '25.4rem', height: '7.5rem' }}
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

        {/* 책 */}
        <motion.div
          className='absolute z-[10] will-change-transform'
          style={{ left: `calc(50% - ${BOOK_W_REM / 2}rem)`, top: `${ELLIPSE_TOP_REM}rem` }}
          animate={bookWrap}
        >
          <motion.div animate={bookIcon} style={{ transformOrigin: '50% 100%' }}>
            <Icon name='booklink-open' className='h-[4.6rem] w-[4.6rem]' ariaHidden />
          </motion.div>
        </motion.div>

        {/* 타이틀(책 오른쪽, GAP 적용) */}
        <motion.div
          className='absolute z-[10] inline-flex items-center'
          style={{
            left: `calc(53% - ${GROUP_HALF_REM}rem + ${BOOK_W_REM + GAP_REM}rem)`,
            top: `${BOOK_CENTER_TOP_REM + 0.2}rem`,
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
