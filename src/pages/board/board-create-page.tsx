import Button from '@components/button/button';
import ButtonFrame from '@components/button/button-frame';
import Input from '@components/input/input';
import PillTab from '@components/tab/pill-tab';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { boardMutations } from '@apis/board/board-mutations';
import { boardQueries } from '@apis/board/board-queries';
import type { BoardCategory } from '@apis/board/board-queries';
import type { TabItem } from './board-page';
import { toast } from '@libs/toast';

export const CATEGORIES: TabItem[] = [
  { key: 'DAILY', label: '일상' },
  { key: 'RECOMMEND', label: '책 추천' },
  { key: 'GATHER', label: '모임 모집' },
];

export default function BoardCreatePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const boardId = searchParams.get('id');
  const isEditMode = !!boardId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<string>('DAILY');

  const { data: boardDetail } = useQuery({
    ...boardQueries.GET_BOARD_DETAIL(boardId || ''),
    enabled: isEditMode,
  });

  const { mutate: createBoard } = useMutation(boardMutations.POST_BOARD());
  const { mutate: updateBoard } = useMutation(boardMutations.PUT_BOARD());

  useEffect(() => {
    if (isEditMode && boardDetail) {
      setTitle(boardDetail.title);
      setContent(boardDetail.content);
      setCategory(boardDetail.category);
    }
  }, [isEditMode, boardDetail]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('제목을 입력해주세요');
      return;
    }
    if (!content.trim()) {
      toast.error('내용을 입력해주세요');
      return;
    }

    if (isEditMode && boardId) {
      // 수정 요청
      updateBoard(
        {
          boardId,
          title: title.trim(),
          content: content.trim(),
        },
        {
          onSuccess: () => {
            toast.success('게시글이 수정되었습니다');
            navigate(`/board/${boardId}`);
          },
          onError: () => {
            toast.error('게시글 수정에 실패했습니다');
          },
        }
      );
    } else {
      // 생성 요청
      createBoard(
        {
          title: title.trim(),
          content: content.trim(),
          category: category as BoardCategory,
        },
        {
          onSuccess: (newBoardId) => {
            toast.success('게시글이 등록되었습니다');
            navigate(`/board/${newBoardId}`);
          },
          onError: () => {
            toast.error('게시글 등록에 실패했습니다');
          },
        }
      );
    }
  };

  return (
    <main>
      <div className='flex-col gap-[2.5rem] p-[1.5rem]'>
        <PillTab
          items={CATEGORIES}
          value={category}
          onChange={setCategory}
          label='카테고리'
          className='px-0 py-0'
          disabled={isEditMode}
        />

        <Input
          id='board-title'
          label='제목'
          placeholder='제목을 입력해 주세요.'
          value={title}
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
        <Button fullWidth roundStyle='rounded-[12px]' className='py-[1.2rem]' onClick={handleSubmit}>
          {isEditMode ? '수정하기' : '등록하기'}
        </Button>
      </ButtonFrame>
    </main>
  );
}
