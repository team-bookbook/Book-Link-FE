import { BOOK_SORT_OPTIONS, type BookSort } from '@components/dropdown/constants/select-options';
import SelectDropdown from '@components/dropdown/select-dropdown';
import Icon from '@components/icon';
import { useState } from 'react';
import LibraryBookCard from '@pages/library/components/card/library-book-card';
import { libraryBookQueries } from '@apis/library/library-book-queries';
import { useQuery } from '@tanstack/react-query';
import { v4 as uuidv4 } from 'uuid';
import useDaumPostcode from '@hooks/use-daum-postcode';
import type { TLocation } from '@pages/library/types/library.types';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface BookListProps {
  location: TLocation;
  setLocation: React.Dispatch<React.SetStateAction<TLocation>>;
  convertCoord: (address: string) => Promise<Coordinates>;
}

export default function BookList({ location, setLocation, convertCoord }: BookListProps) {
  const [bookSort, setBookSort] = useState<BookSort>('DISTANCE');
  const openPostcode = useDaumPostcode();

  const queryParams = {
    latitude: location.lat,
    longitude: location.lng,
    page: 0,
    size: 10,
  };

  const { data } = useQuery(libraryBookQueries.GET_LIBRARY_BOOK(queryParams));

  const handleLocationSearch = async () => {
    await openPostcode(async (d) => {
      const address = d.address;

      const coords = await convertCoord(address);
      console.log(coords);
      setLocation({
        address,
        lat: coords.latitude,
        lng: coords.longitude,
      });
    });
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
