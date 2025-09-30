import {
  LIB_SORT_OPTIONS,
  RENT_STATUS_OPTIONS,
  type LibSort,
  type RentStatus,
} from '@components/dropdown/constants/select-options';
import SelectDropdown from '@components/dropdown/select-dropdown';
import { useState } from 'react';

export default function LibraryList() {
  const [libSort, setLibSort] = useState<LibSort>('recent');
  const [rentStatus, setRentStatus] = useState<RentStatus>('pending');

  return (
    <div className='flex-col gap-[1.2rem]'>
      <div className='flex-row-between'>
        <div className='flex items-center gap-[1.2rem]'>
          <SelectDropdown
            triggerLabel={libSort === 'recent' ? '최신순' : libSort === 'distance' ? '거리순' : '인기순'}
            value={libSort}
            onChange={setLibSort}
            options={LIB_SORT_OPTIONS}
            variant='title'
            align='start'
          />
        </div>

        <SelectDropdown
          variant='chip'
          value={rentStatus}
          onChange={setRentStatus}
          options={RENT_STATUS_OPTIONS}
          align='end'
          menuWidthRem={12}
        />
      </div>
    </div>
  );
}
