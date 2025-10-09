import { BOOK_SORT_OPTIONS, type BookSort } from '@components/dropdown/constants/select-options';
import SelectDropdown from '@components/dropdown/select-dropdown';
import Icon from '@components/icon';
import { useState } from 'react';
import LibraryBookCard from '@pages/library/components/card/library-book-card';
import { libraryBookQueries } from '@apis/library/library-book-queries';
import { useQuery } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import useDaumPostcode from '@hooks/use-daum-postcode';

export default function BookList() {
  const [bookSort, setBookSort] = useState<BookSort>('DISTANCE');
  const [location, setLocation] = useState({
    address: '서울 마포구 효창원로98길 1-1',
    latitude: 37.48486731057572,
    longitude: 126.92841740891708,
  });
  const openPostcode = useDaumPostcode();

  const queryParams = {
    latitude: location.latitude,
    longitude: location.longitude,
    page: 0,
    size: 10,
  };

  const { data, isLoading, error } = useQuery(libraryBookQueries.GET_LIBRARY_BOOK(queryParams));

  console.log(data, isLoading, error);

  const handleLocationSearch = async () => {
    try {
      await openPostcode((d) => {
        const address = d.address;
        setLocation({
          address,
          latitude: location.latitude, // TODO: 주소를 위도/경도로 변환하는 로직 추가 필요
          longitude: location.longitude,
        });
      });
    } catch {
      /* */
    }
  };

  const BookListOptions = () => {
    const sortLabel = BOOK_SORT_OPTIONS.find((option) => option.value === bookSort)?.label || '거리순';

    return (
      <div className='flex-row-between px-[1.5rem]'>
        <button onClick={handleLocationSearch} className='flex-row-center min-h-[4.8rem] cursor-pointer gap-[0.2rem]'>
          <Icon name='location' size={2.4} className='text-primary-700' />
          <span className='caption1'>{location.address}</span>
          <Icon name='dropdown' size={1.2} ariaHidden />
        </button>
        <SelectDropdown
          triggerLabel={sortLabel}
          value={bookSort}
          onChange={setBookSort}
          options={BOOK_SORT_OPTIONS}
          variant='title'
          align='end'
        />
      </div>
    );
  };

  return (
    <div className='flex-col gap-[0.4rem] pt-[0.4rem]'>
      {BookListOptions()}
      <div className='flex-col gap-[1rem] px-[2rem]'>
        {data?.content.map((book) => (
          <LibraryBookCard key={uuidv4()} book={book} />
        ))}
      </div>
    </div>
  );
}
