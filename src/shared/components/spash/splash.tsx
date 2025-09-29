import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, type Transition, type Variants, cubicBezier } from 'framer-motion';
import Icon from '@components/icon';

type Step = 1 | 2 | 3 | 4;

const EASE_BEZIER = cubicBezier(1, 0, 0, 1);
const SPRING_STRONG = { type: 'spring', stiffness: 600, damping: 17, mass: 1 } satisfies Transition;
const SPRING_SOFT = { type: 'spring', stiffness: 400, damping: 30, mass: 1 } satisfies Transition;

export default function SplashSequence() {
  const [step, setStep] = useState<Step>(1);

  useEffect(() => {
    const timers: number[] = [];
    // 1 -> 2
    timers.push(window.setTimeout(() => setStep(2), 100 + 800));
    // 2 -> 3
    timers.push(window.setTimeout(() => setStep(3), 100 + 800 + 700));
    // 3 -> 4
    timers.push(window.setTimeout(() => setStep(4), 100 + 800 + 700 + 400));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className='bg-gray-white relative h-dvh w-full overflow-hidden'>
      <AnimatePresence initial={false} mode='wait'>
        {step === 1 && <Scene1 key='s1' />}
        {step === 2 && <Scene2 key='s2' />}
        {step === 3 && <Scene3 key='s3' />}
        {step === 4 && <Scene4 key='s4' />}
      </AnimatePresence>
    </div>
  );
}

/* ================= Scene 1 =================
   - 좌상에 큰 원(배경), 바닥 타원 그림자, 물방울 파편
   - 책 아이콘이 30deg 기울어진 채 작게 등장
*/
function Scene1() {
  const variants: Variants = useMemo(
    () => ({
      initial: { opacity: 1 },
      animate: { opacity: 1, transition: { duration: 0.8, ease: EASE_BEZIER } },
      exit: { opacity: 1 },
    }),
    []
  );

  return (
    <motion.section
      className='relative h-full w-full overflow-hidden'
      style={{ background: 'var(--color-secondary-900)' }} // #71C6FF
      variants={variants}
      initial='initial'
      animate='animate'
      exit='exit'
    >
      {/* 좌상 대원 */}
      <div
        className='absolute rounded-[9999px]'
        style={{
          width: '78.4rem',
          height: '78.4rem',
          left: '-20.5rem',
          top: '-5.8rem',
          background: 'var(--color-secondary-900)',
        }}
      />
      {/* 바닥 타원 그림자 */}
      <div className='absolute'>
        <svg width='254' height='75' viewBox='0 0 254 75' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <ellipse cx='127' cy='37.5' rx='127' ry='37.5' fill='#356B8E' />
        </svg>
      </div>

      {/* 스플래시 파편 (간단화) */}
      <div className='absolute top-[42rem] left-[16rem]'>
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
      </div>

      {/* 책 아이콘 (작게, 15deg 기울임) */}
      <motion.div
        className='absolute top-[18rem] left-1/2 -translate-x-1/2'
        initial={{ rotate: 15, scale: 0.9, y: 0, opacity: 0.95 }}
        animate={{ rotate: 15, scale: 1, y: 0, opacity: 1, transition: { duration: 0.8, ease: EASE_BEZIER } }}
      >
        <Icon name='booklink-open' size={4.6} ariaHidden />
      </motion.div>
    </motion.section>
  );
}

/* ================= Scene 2 =================
   - 흰 배경 + 책이 화면 가운데로 이동하며 살짝 기울어짐 (베지어 800ms)
*/
function Scene2() {
  return (
    <motion.section
      className='relative h-full w-full bg-white'
      initial={{ opacity: 1 }}
      animate={{ opacity: 1, transition: { duration: 0.8, ease: EASE_BEZIER } }}
      exit={{ opacity: 1 }}
    >
      <motion.div
        className='absolute top-[18rem] left-1/2 -translate-x-1/2'
        initial={{ y: 10, rotate: 15, scale: 1 }}
        animate={{ y: 0, rotate: 15, scale: 1, transition: { duration: 0.8, ease: EASE_BEZIER } }}
      >
        <Icon name='booklink-open' size={4.6} ariaHidden />
      </motion.div>
    </motion.section>
  );
}

/* ================= Scene 3 =================
   - 같은 흰 배경 + 책이 오른쪽으로 스르륵 이동하며 스프링(700ms 근사)
*/
function Scene3() {
  return (
    <motion.section className='relative h-full w-full bg-white'>
      <motion.div
        className='absolute top-[18rem] left-1/2'
        initial={{ x: '-50%', y: 0, rotate: 0, scale: 1 }}
        animate={{ x: '10rem', y: 0, rotate: 0, scale: 1, transition: { ...SPRING_STRONG, duration: 0.7 } }}
      >
        <Icon name='booklink-open' size={4.6} ariaHidden />
      </motion.div>
    </motion.section>
  );
}

/* ================= Scene 4 =================
   - 로고 타이프가 왼쪽에서 나타나며 책 아이콘과 간격 맞춤, 부드러운 스프링(400ms)
*/
function Scene4() {
  return (
    <motion.section className='relative h-full w-full bg-white'>
      {/* 책 아이콘: 최종 자리 */}
      <motion.div
        className='absolute top-[18rem] left-[15.6rem]'
        initial={{ opacity: 0, x: '-2rem', scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1, transition: { ...SPRING_SOFT, duration: 0.4 } }}
      >
        <Icon name='booklink-open' size={4.6} ariaHidden />
      </motion.div>

      {/* BOOK + Link 두 톤 로고텍스트 (프로젝트 폰트 사용) */}
      <motion.h1
        className='absolute top-[18.2rem] ml-[2rem] inline-flex items-center gap-[0.8rem] text-[3.2rem] leading-[1.2] font-semibold'
        initial={{ opacity: 0, x: '-1.6rem' }}
        animate={{ opacity: 1, x: 0, transition: { ...SPRING_SOFT, duration: 0.4 } }}
        style={{ left: 'calc(15.6rem + 4.6rem)' }}
      >
        <Icon name='splash-title' width={18.2} />
      </motion.h1>
    </motion.section>
  );
}
