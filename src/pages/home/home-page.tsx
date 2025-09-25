import { useState } from 'react';
import Calendar from '@components/calendar/calendar';

export default function HomePage() {
  const [selected, setSelected] = useState(new Date(2025, 8, 17));

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
