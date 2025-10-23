import LibraryTab, { type LibraryTabKey } from '@pages/library/components/library-tab';
import { useQueryTab } from '@hooks/use-query-tab';
import LibraryList from '@pages/library/components/section/section-librarylist';
import BookList from '@pages/library/components/section/section-booklist';
import { useState } from 'react';
import { useKakaoMaps } from '@hooks/use-kakao-map';

export default function LibraryPage() {
  const [tab, setTab] = useQueryTab<LibraryTabKey>('tab', 'books', ['books', 'libraries']);
  const [location, setLocation] = useState({
    address: '서울 마포구 효창원로98길 1-1',
    lat: 37.48486731057572,
    lng: 126.92841740891708,
  });

  const { convertCoord } = useKakaoMaps();

  return (
    <>
      <LibraryTab value={tab} onChange={setTab} />
      {tab === 'libraries' ? (
        <LibraryList queryParams={location} />
      ) : (
        <BookList location={location} setLocation={setLocation} convertCoord={convertCoord} />
      )}
    </>
  );
}
