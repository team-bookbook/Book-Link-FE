import { useState } from 'react';
import LibraryTab, { type LibraryTabKey } from '@pages/library/components/library-tab';
import { useQueryTab } from '@hooks/use-query-tab';
import Input from '@components/input/input';

export default function LibraryPage() {
  const [tab, setTab] = useQueryTab<LibraryTabKey>('tab', 'books', ['books', 'libraries']);

  return (
    <>
      <LibraryTab value={tab} onChange={setTab} />
      {tab === 'libraries' ? <LibraryList /> : <BookList />}
    </>
  );
}

function LibraryList() {
  const [desc, setDesc] = useState('');
  const max = 200;

  return (
    <div className='flex-col gap-6'>
      <Input
        id='lib-desc'
        label='도서관 메모'
        multiline
        placeholder='도서관에 대한 메모를 입력하세요.'
        value={desc}
        onChange={(e) => setDesc(e.currentTarget.value)}
        maxLength={max}
        hasLength
        length={desc.length}
        defaultMessage='최대 200자까지 입력할 수 있어요.'
      />
    </div>
  );
}

function BookList() {
  const [keyword, setKeyword] = useState('');
  return (
    <div className='flex-col'>
      <Input
        id='book-search'
        label='도서 검색'
        placeholder='제목/저자를 입력하세요.'
        value={keyword}
        onChange={(e) => setKeyword(e.currentTarget.value)}
      />
    </div>
  );
}
