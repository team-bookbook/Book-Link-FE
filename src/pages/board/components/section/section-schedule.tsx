import Calendar from '@components/calendar/calendar';
import ScheduleCard, { type ScheduleCardProps } from '@pages/board/components/schedule-card';

interface SectionScheduleProps {
  schedules: ScheduleCardProps[];
}

export default function SectionSchedule({ schedules }: SectionScheduleProps) {
  // 일정 정렬 (날짜순)
  const sortedSchedules = [...schedules].sort((a, b) => {
    return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
  });

  return (
    <div className='flex-col gap-[2rem] p-[2rem]'>
      <Calendar />
      <div className='flex-col gap-[1.2rem]'>
        {sortedSchedules.length === 0 ? (
          <p className='body5 py-[4rem] text-center text-gray-500'>등록된 일정이 없습니다.</p>
        ) : (
          sortedSchedules.map((schedule) => <ScheduleCard key={schedule.id} {...schedule} />)
        )}
      </div>
    </div>
  );
}
