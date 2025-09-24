import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import UnderlineTab from '@components/tab/underline-tab';

type TabKey = 'libraries' | 'books';

export default function LibraryPage() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as TabKey) ?? 'books';

  const items = useMemo(
    () => [
      { key: 'books', label: '도서' },
      { key: 'libraries', label: '도서관' },
    ],
    []
  );

  const handleChange = (next: string) => {
    setParams(
      (prev) => {
        const p = new URLSearchParams(prev);
        p.set('tab', next);
        return p;
      },
      { replace: true }
    );
  };

  return (
    <section>
      <UnderlineTab items={items} value={tab} onChange={handleChange} />

      <div className='mt-[1.6rem]'>{tab === 'libraries' ? <LibraryList /> : <BookList />}</div>
    </section>
  );
}

function LibraryList() {
  return <div>도서관 리스트 영역</div>;
}

function BookList() {
  return <div>도서 리스트 영역</div>;
}
