import { useState } from 'react';
import TimePicker, { type HMValue } from '@components/time-picker/time-picker';

export default function HomePage() {
  const [tA, setTA] = useState<HMValue>({ hour: 9, minute: 0 });
  const [tB, setTB] = useState<HMValue>({ hour: 18, minute: 0 });

  return (
    <div className='space-y-[1.2rem] p-[1.6rem]'>
      <TimePicker value={tA} onChange={setTA} />

      <TimePicker value={tB} onChange={setTB} placeholder='시간 선택' />
    </div>
  );
}
