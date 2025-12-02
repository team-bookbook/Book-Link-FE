import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Input from '@components/input/input';
import PillTab from '@components/tab/pill-tab';
import { useState } from 'react';
import type { TabItem } from './board-page';

export const CATEGORIES: TabItem[] = [
  { key: 'RECOMMEND', label: '책 추천' },
  { key: 'GENERAL', label: '일상' },
  { key: 'GATHER', label: '모임 모집' },
];

export default function BoardCreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('all');
  console.log(title, content);

  return (
    <div className='flex-col gap-[2.5rem] p-[1.5rem]'>
      <PillTab items={CATEGORIES} value={category} onChange={setCategory} label='카테고리' className='px-0 py-0' />

      <Input
        id='board-title'
        label='제목'
        placeholder='제목을 입력해 주세요.'
        onChange={(e) => setTitle(e.currentTarget.value)}
      />

      <Input
        id='board-content'
        label='내용'
        placeholder='내용을 입력해주세요'
        multiline
        maxLength={1000}
        hasLength
        value={desc}
        onChange={(e) => setContent(e.currentTarget.value)}
        length={desc.length}
      />

      <ButtonFrame>
        <Button fullWidth roundStyle='rounded-[12px]' className='py-[1.2rem]'>
          등록하기
        </Button>
      </ButtonFrame>
    </div>
  );
}
