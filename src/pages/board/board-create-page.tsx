import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Input from '@components/input/input';
import PillTab from '@components/tab/pill-tab';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { boardMutations } from '@apis/board/board-mutations';
import type { BoardCategory } from '@apis/board/board-queries';
import type { TabItem } from './board-page';
import { toast } from '@libs/toast';

export const CATEGORIES: TabItem[] = [
  { key: 'GENERAL', label: '일상' },
  { key: 'RECOMMEND', label: '책 추천' },
  { key: 'GATHER', label: '모임 모집' },
];

export default function BoardCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('GENERAL');

  const createMutation = useMutation(boardMutations.POST_BOARD());

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('제목을 입력해주세요');
      return;
    }
    if (!content.trim()) {
      toast.error('내용을 입력해주세요');
      return;
    }

    try {
      const boardId = await createMutation.mutateAsync({
        title: title.trim(),
        content: content.trim(),
        category: category as BoardCategory,
      });
      toast.success('게시글이 등록되었습니다');
      navigate(`/board/${boardId}`);
    } catch (error) {
      toast.error('게시글 등록에 실패했습니다');
      console.error(error);
    }
  };

  return (
    <main>
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
          value={content}
          onChange={(e) => setContent(e.currentTarget.value)}
          length={content.length}
        />
      </div>
      <ButtonFrame>
        <Button
          fullWidth
          roundStyle='rounded-[12px]'
          className='py-[1.2rem]'
          onClick={handleSubmit}
          loading={createMutation.isPending}
        >
          등록하기
        </Button>
      </ButtonFrame>
    </main>
  );
}
