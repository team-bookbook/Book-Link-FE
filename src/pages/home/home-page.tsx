import { useState } from 'react';
import TimePicker, { type HMValue } from '@components/time-picker/time-picker';
import Faq from '@components/faq/faq';
import { FAQ_ITEMS } from '@components/faq/constants/faq';

export default function HomePage() {
  const [tA, setTA] = useState<HMValue>({ hour: 9, minute: 0 });
  const [tB, setTB] = useState<HMValue>({ hour: 18, minute: 0 });

  return (
    <div className='space-y-[2.4rem] bg-gray-50 p-[1.6rem]'>
      <div className='space-y-[1.2rem]'>
        <TimePicker value={tA} onChange={setTA} />
        <TimePicker value={tB} onChange={setTB} placeholder='시간 선택' />
      </div>

      <section className='space-y-[1.2rem]'>
        <h2 className='title4 text-gray-900'>자주 묻는 질문</h2>
        <Faq items={FAQ_ITEMS} />
      </section>
    </div>
  );
}
