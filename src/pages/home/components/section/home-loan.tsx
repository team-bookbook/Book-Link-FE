import HomeSectionLayout from '../layout/home-section-layout';
import { useKeenSlider } from 'keen-slider/react';
import BookCard from '../card/book-card';
import type { IBookCard } from '@pages/home/types/home.types';

interface HomeLoanProps {
  title: string;
  data: IBookCard[];
  linkText?: string;
  isLoading?: boolean;
  onLinkClick?: () => void;
}

export default function HomeLoan({ title, data, linkText, isLoading = false, onLinkClick }: HomeLoanProps) {
  const [sliderRef] = useKeenSlider({
    mode: 'free-snap',
    slides: {
      perView: 'auto',
      spacing: 10,
    },
  });

  return (
    <HomeSectionLayout
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
    </HomeSectionLayout>
  );
}
