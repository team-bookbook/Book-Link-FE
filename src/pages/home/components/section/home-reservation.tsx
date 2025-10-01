import SectionLayout from '@components/section-layout';
import { useKeenSlider } from 'keen-slider/react';
import BookCard from '@pages/home/components/card/book-card';
import type { IBookCard } from '@pages/home/types/home.types';

interface HomeReservationProps {
  title: string;
  data: IBookCard[];
  linkText?: string;
  isLoading?: boolean;
  onLinkClick?: () => void;
}

export default function HomeReservation({
  title,
  data,
  linkText,
  isLoading = false,
  onLinkClick,
}: HomeReservationProps) {
  const [sliderRef] = useKeenSlider({
    mode: 'free-snap',
    slides: {
      perView: 'auto',
      spacing: 10,
    },
  });
  return (
    <SectionLayout
      title={title}
      linkText={linkText}
      onLinkClick={onLinkClick}
      isLoading={isLoading}
      isEmpty={data.length === 0}
    >
      <div>
        <div ref={sliderRef} className='keen-slider px-[2rem]'>
          {data.map((book, index) => (
            <BookCard
              key={`${book.id}-${index}`}
              id={book.id}
              index={index}
              imgurl={book.imgurl}
              title={book.title}
              author={book.author}
              expDate={book.expDate}
            />
          ))}
        </div>
      </div>
    </SectionLayout>
  );
}
