import { useState } from 'react';
import Calendar from '@components/calendar/calendar';

export default function BoardPage() {
  const [selected, setSelected] = useState(new Date());

  return (
    <Calendar
      value={selected}
      onChange={setSelected}
      markers={[
        { date: '2025-09-03', tone: 'info' },
        { date: '2025-09-11', tone: 'info' },
      ]}
    />
  );
}
