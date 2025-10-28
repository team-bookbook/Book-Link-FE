import SelectDropdown from '@components/dropdown/select-dropdown';
import { cn } from '@libs/cn';
import { useState } from 'react';

type RentStatus = '대여 대기' | '대여 중' | '반납 완료';

interface TopLabelProps {
  isPE?: boolean;
}

const STATUS_OPTIONS: readonly { value: RentStatus; label: string }[] = [
  { value: '대여 대기', label: '대여 대기' },
  { value: '대여 중', label: '대여 중' },
  { value: '반납 완료', label: '반납 완료' },
] as const;

export const TopLabel = ({ isPE = true }: TopLabelProps) => {
  const [status, setStatus] = useState<RentStatus>('대여 대기');

  return (
    <section className='bg-secondary-100 sticky top-0 w-full'>
      <div className='mx-auto w-full px-[2rem] py-[1.2rem]'>
        <div className='flex items-center gap-[1.2rem]'>
          <div className='h-[4rem] w-[4rem] shrink-0 rounded-[8px] bg-gray-200' />
          <div className='flex-1 flex-col gap-[0.3rem]'>
            <p className='caption2 text-primary-900 truncate'>노르웨이의 숲 외 2권</p>
            <p className='caption5 text-gray-600'>반납기한 2025-09-30까지</p>
          </div>
          <SelectDropdown<RentStatus>
            value={status}
            options={STATUS_OPTIONS}
            onChange={setStatus}
            variant='chip'
            align='end'
            className={cn(!isPE && 'pointer-events-none')}
          />
        </div>
      </div>
    </section>
  );
};
