import LibraryTab, { type LibraryTabKey } from '@pages/library/components/library-tab';
import { useQueryTab } from '@hooks/use-query-tab';
import LibraryList from '@pages/library/components/section/section-librarylist';
import BookList from '@pages/library/components/section/section-booklist';

export default function LibraryPage() {
  const [tab, setTab] = useQueryTab<LibraryTabKey>('tab', 'books', ['books', 'libraries']);

  return (
    <>
      <LibraryTab value={tab} onChange={setTab} />
      {tab === 'libraries' ? <LibraryList /> : <BookList />}
    </>
  );
}
