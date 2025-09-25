import { useState } from 'react';
import TimePicker, { type HMValue } from '@components/time-picker/time-picker';
import Faq from '@components/faq/faq';
import { FAQ_ITEMS } from '@components/faq/constants/faq';
import IntroduceBanner from '@components/introduce/introduce-banner';
import { INTRODUCE_STEPS } from '@components/introduce/constants/introduce';

export default function HomePage() {
  const [tA, setTA] = useState<HMValue>({ hour: 9, minute: 0 });
  const [tB, setTB] = useState<HMValue>({ hour: 18, minute: 0 });

  return (
    <div className='space-y-[2.4rem] bg-gray-50'>
      <div className='space-y-[1.2rem]'>
        <TimePicker value={tA} onChange={setTA} />
        <TimePicker value={tB} onChange={setTB} placeholder='시간 선택' />
      </div>

      <section className='flex-col gap-[1rem] px-[1.5rem]'>
        <div className='flex-col gap-[0.2rem] px-[0.5rem] py-[1rem]'>
          <h2 className='title4 text-gray-900'>자주 묻는 질문</h2>
          <p className='body5 text-gray-600'>간단한 단계로 도서관을 운영하세요!</p>
        </div>
        <Faq items={FAQ_ITEMS} />
      </section>
      <div className='flex-col-center gap-[1.5rem] px-[2rem] py-[2.5rem]'>
        {INTRODUCE_STEPS.map((s) => (
          <IntroduceBanner key={s.id} id={s.id} title={s.title} stepText={s.stepText} variant={s.variant} />
        ))}
      </div>
    </div>
  );
}
