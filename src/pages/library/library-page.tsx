import LibraryTab, { type LibraryTabKey } from '@pages/library/components/library-tab';
import { useQueryTab } from '@hooks/use-query-tab';

export default function LibraryPage() {
  const [tab, setTab] = useQueryTab<LibraryTabKey>('tab', 'books', ['books', 'libraries']);

  return (
    <section>
      <LibraryTab value={tab} onChange={setTab} />

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
