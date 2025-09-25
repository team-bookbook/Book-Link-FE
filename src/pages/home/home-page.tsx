import { useState } from 'react';
import TimePicker, { type HMValue } from '@components/time-picker/time-picker';

export default function HomePage() {
  const [t, setT] = useState<HMValue>({ hour: 9, minute: 30 }); // 24h 값

  return (
    <div className='space-y-[1.2rem] p-[1.6rem]'>
      {/* 24시간 표기 */}
      <TimePicker value={t} onChange={setT} />

      {/* 12시간 표기(표시만 12h, 값은 24h 유지) */}
      <TimePicker twelveHour onChange={setT} placeholder='시간 선택' />
    </div>
  );
}
