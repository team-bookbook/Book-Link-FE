// src/pages/onboarding/OnboardingPage.tsx
import { useEffect, useRef, useState } from 'react';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Icon from '@components/icon';
import { ONBOARDING_PAGES, type OnboardingSlide, type SlideId } from '@pages/onboarding/constants/onboarding-text';

const STORAGE_KEY = 'onboarding_seen';

function isSlideId(value: string, all: ReadonlyArray<OnboardingSlide>): value is SlideId {
  return all.some((p) => p.id === value);
}

export default function OnboardingPage() {
  const pages: ReadonlyArray<OnboardingSlide> = ONBOARDING_PAGES;
  const [currentId, setCurrentId] = useState<SlideId>(pages[0].id);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const refMap = useRef<Map<SlideId, HTMLDivElement | null>>(new Map());

  const setSlideRef = (id: SlideId) => (el: HTMLDivElement | null) => {
    refMap.current.set(id, el);
  };

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let bestId: SlideId | null = null;
        let bestScore = -1;
        entries.forEach((e) => {
          const idAttr = e.target.getAttribute('data-id') ?? '';
          const score = e.intersectionRatio;
          if (score > bestScore && isSlideId(idAttr, pages)) {
            bestId = idAttr;
            bestScore = score;
          }
        });
        if (bestId) setCurrentId(bestId);
      },
      { root: scroller, threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    );

    refMap.current.forEach((el, id) => {
      if (el) {
        el.setAttribute('data-id', id);
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [pages]);

  function getIndex(id: SlideId): number {
    return pages.findIndex((p: OnboardingSlide) => p.id === id);
  }

  const currentIndex = getIndex(currentId);
  const isLast = currentIndex === pages.length - 1;

  const goTo = (id: SlideId) => {
    const scroller = scrollerRef.current;
    const target = refMap.current.get(id);
    if (!scroller || !target) return;
    scroller.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
  };

  const onNext = () => {
    if (!isLast) {
      const next = pages[currentIndex + 1];
      goTo(next.id);
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {}
    window.location.assign('/login');
  };

  return (
    <div className='min-h-dvh bg-white text-gray-900'>
      <header className='flex items-center justify-between px-[1.6rem] pt-[1.2rem]'>
        <button
          type='button'
          onClick={() => window.history.back()}
          className='rounded-[12px] p-[0.8rem]'
          aria-label='뒤로'
        >
          <Icon name='chevron-left' width='2.0rem' height='2.0rem' />
        </button>
        <button type='button' onClick={() => window.location.assign('/login')} className='button4 text-primary-700'>
          로그인
        </button>
      </header>

      <div className='mt-[0.8rem] h-[0.6rem] w-full bg-gray-200'>
        <div
          className='bg-system-success h-[0.6rem] transition-[width] duration-300'
          style={{ width: `${((currentIndex + 1) / pages.length) * 100}%` }}
          aria-hidden
        />
      </div>

      <section
        ref={scrollerRef}
        className='mt-[2.4rem] flex snap-x snap-mandatory overflow-x-auto scroll-smooth px-[2rem] pb-[1.6rem] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        aria-roledescription='carousel'
        aria-label='온보딩'
      >
        {pages.map((slide: OnboardingSlide) => (
          <article
            key={slide.id}
            ref={setSlideRef(slide.id)}
            data-id={slide.id}
            className='mr-[1.6rem] w-[calc(100%-0.4rem)] shrink-0 snap-center'
            aria-label={slide.title.replace(/\n/gu, ' ')}
          >
            <h2 className='title3 whitespace-pre-line text-gray-900'>{slide.title}</h2>
            <p className='body4 mt-[0.6rem] text-gray-500'>{slide.subtitle}</p>

            <div className='mt-[2.0rem] rounded-[20px] bg-gray-50 p-[1.2rem]'>
              <img src={slide.image} alt='' className='mx-auto block h-auto w-[28rem] rounded-[20px]' />
            </div>
          </article>
        ))}
      </section>

      <nav className='mt-[0.8rem] flex items-center justify-center gap-[0.6rem]' aria-label='페이지 선택'>
        {pages.map((s: OnboardingSlide) => {
          const active = s.id === currentId;
          return (
            <button
              key={s.id}
              type='button'
              onClick={() => goTo(s.id)}
              className={[
                'h-[0.6rem] rounded-[999px] transition-all',
                active ? 'bg-primary-700 w-[1.6rem]' : 'w-[0.6rem] bg-gray-300',
              ].join(' ')}
              aria-current={active ? 'true' : undefined}
              aria-label={`페이지 ${getIndex(s.id) + 1}`}
            />
          );
        })}
      </nav>

      <ButtonFrame>
        <Button fullWidth className='py-[1.2rem]' onClick={onNext}>
          {isLast ? '로그인하기' : '로그인하기'}
        </Button>
      </ButtonFrame>
    </div>
  );
}
