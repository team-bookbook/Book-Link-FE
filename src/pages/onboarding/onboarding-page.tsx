import { useEffect, useRef, useState } from 'react';
import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import { useNavigate } from 'react-router-dom';
import { ONBOARDING_PAGES, type OnboardingSlide, type SlideId } from '@pages/onboarding/constants/onboarding-text';

function isSlideId(v: string, pages: ReadonlyArray<OnboardingSlide>): v is SlideId {
  return pages.some((p) => p.id === v);
}

export default function OnboardingPage() {
  const pages: ReadonlyArray<OnboardingSlide> = ONBOARDING_PAGES;
  const navigate = useNavigate();

  const [settledId, setSettledId] = useState<SlideId>(pages[0].id);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const refMap = useRef<Map<SlideId, HTMLDivElement | null>>(new Map());
  const setSlideRef = (id: SlideId) => (el: HTMLDivElement | null) => {
    refMap.current.set(id, el);
  };

  const startIndexRef = useRef<number>(0);
  const userScrollRef = useRef<boolean>(false);
  const scrollEndTimer = useRef<number | null>(null);
  const programmaticRef = useRef<boolean>(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (programmaticRef.current) return;

        let bestId: SlideId | null = null;
        let bestScore = -1;
        for (const e of entries) {
          const idAttr = e.target.getAttribute('data-id') ?? '';
          if (!isSlideId(idAttr, pages)) continue;
          const score = e.intersectionRatio;
          if (score > bestScore) {
            bestId = idAttr;
            bestScore = score;
          }
        }
        if (bestId && !userScrollRef.current && bestScore >= 0.8) {
          setSettledId(bestId);
        }
      },
      { root: scroller, threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    );

    refMap.current.forEach((el, id) => {
      if (el) {
        el.setAttribute('data-id', id);
        io.observe(el);
      }
    });

    return () => io.disconnect();
  }, [pages]);

  const getIndex = (id: SlideId) => pages.findIndex((p) => p.id === id);
  const settledIndex = getIndex(settledId);

  const goTo = (id: SlideId) => {
    const scroller = scrollerRef.current;
    const target = refMap.current.get(id);
    if (!scroller || !target) return;
    programmaticRef.current = true;
    scroller.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
    setSettledId(id);
    window.setTimeout(() => {
      programmaticRef.current = false;
    }, 200);
  };

  const onPointerDown = () => {
    userScrollRef.current = true;
    startIndexRef.current = settledIndex;
  };

  const onPointerUp = () => {
    if (!userScrollRef.current) return;
    userScrollRef.current = false;
    snapToOnePage();
  };

  const snapToOnePage = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const left = scroller.scrollLeft;
    const start = startIndexRef.current;

    const candIdxs: number[] = [];
    if (start - 1 >= 0) candIdxs.push(start - 1);
    candIdxs.push(start);
    if (start + 1 <= pages.length - 1) candIdxs.push(start + 1);

    let bestIdx = start;
    let bestDist = Number.POSITIVE_INFINITY;

    for (const idx of candIdxs) {
      const id = pages[idx].id;
      const el = refMap.current.get(id);
      if (!el) continue;
      const dist = Math.abs(el.offsetLeft - left);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = idx;
      }
    }

    goTo(pages[bestIdx].id);
  };

  const onScroll = () => {
    if (programmaticRef.current || !userScrollRef.current) return;
    if (scrollEndTimer.current !== null) window.clearTimeout(scrollEndTimer.current);
    scrollEndTimer.current = window.setTimeout(() => {
      snapToOnePage();
      scrollEndTimer.current = null;
    }, 80);
  };

  const curSlide = pages[settledIndex];

  return (
    <div className='h-dvh pb-[7rem]'>
      <div className='flex-col-between mx-auto h-full w-full px-[2rem] py-[5rem]'>
        <div className='flex-col-center gap-[1rem]'>
          <h2 className='title4 text-center whitespace-pre-line text-gray-900'>{curSlide.title}</h2>
          <p className='body5 text-center text-gray-500'>{curSlide.subtitle}</p>
        </div>

        <section
          ref={scrollerRef}
          className='scrollbar-hide flex snap-x snap-mandatory gap-[1.6rem] overflow-x-auto scroll-smooth'
          aria-roledescription='carousel'
          aria-label='온보딩 이미지'
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onScroll={onScroll}
        >
          {pages.map((slide) => (
            <article
              key={slide.id}
              ref={setSlideRef(slide.id)}
              data-id={slide.id}
              className='w-full shrink-0 snap-center [scroll-snap-stop:always]'
              aria-label={slide.id}
            >
              <img src={slide.image} alt='' className='block h-[35.2rem] w-full rounded-[20px] object-cover' />
            </article>
          ))}
        </section>

        <nav className='flex-row-center gap-[0.6rem] pb-[1.2rem]' aria-label='페이지 선택'>
          {pages.map((s) => {
            const active = s.id === settledId;
            return (
              <button
                key={s.id}
                type='button'
                onClick={() => goTo(s.id)}
                className={[
                  'h-[0.6rem] rounded-full transition-all',
                  active ? 'bg-secondary-900 w-[1.6rem]' : 'w-[0.6rem] bg-gray-300',
                ].join(' ')}
                aria-current={active ? 'true' : undefined}
                aria-label={`페이지 ${getIndex(s.id) + 1}`}
              />
            );
          })}
        </nav>
      </div>

      <ButtonFrame>
        <Button fullWidth className='py-[1.2rem]' onClick={() => navigate('/login')}>
          로그인하기
        </Button>
      </ButtonFrame>
    </div>
  );
}
