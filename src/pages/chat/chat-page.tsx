import { useState } from 'react';
import Button from '@components/button/button';
import useBottomSheet from '@components/bottom-sheet/hooks/use-bottom-sheet';
import SelectBottomSheet from '@components/bottom-sheet/select-bottom-sheet';
import CommentBottomSheet, { type CommentItem } from '@components/bottom-sheet/comment-bottom-sheet';

export default function ChatPage() {
  const selectSheet = useBottomSheet();
  const [category, setCategory] = useState<string | null>('cat-a');

  const categories = [
    { value: 'cat-a', label: '카테고리 A' },
    { value: 'cat-b', label: '카테고리 B' },
    { value: 'cat-c', label: '카테고리 C' },
  ] as const;

  const commentSheet = useBottomSheet();
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 1,
      author: '홍길동',
      dateText: '2025.09.22',
      content: '댓글 내용이 여기에 들어갑니다.',
      likeCount: 9,
      replyCount: 9,
      liked: false,
    },
    {
      id: 2,
      author: '김망곰',
      dateText: '2025.09.22',
      content: '두 번째 의견입니다.',
      likeCount: 3,
      replyCount: 1,
      liked: true,
    },
    {
      id: 3,
      author: '김뫄뫄',
      dateText: '2025.09.22',
      content: '댓글 댓글 댓글입니다..',
      likeCount: 3,
      replyCount: 1,
      liked: false,
    },
    {
      id: 4,
      author: '김뫄뫄',
      dateText: '2025.09.22',
      content: '댓글 댓글 댓글입니다..',
      likeCount: 3,
      replyCount: 1,
      liked: false,
    },
    {
      id: 5,
      author: '임꺽정',
      dateText: '2025.09.22',
      content: '댓글 댓글 댓글입니다..',
      likeCount: 3,
      replyCount: 1,
      liked: false,
    },
  ]);

  const toggleLike = (id: number) =>
    setComments((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, liked: !c.liked, likeCount: c.liked ? c.likeCount - 1 : c.likeCount + 1 } : c
      )
    );

  const addComment = (text: string) =>
    setComments((prev) => [
      {
        id: Date.now(),
        author: '나',
        dateText: new Date().toISOString().slice(0, 10).replaceAll('-', '.'),
        content: text,
        likeCount: 0,
        replyCount: 0,
        liked: false,
      },
      ...prev,
    ]);

  return (
    <>
      <div className='flex items-center gap-[0.8rem]'>
        <Button variant='outline' onClick={selectSheet.open}>
          카테고리 선택
        </Button>
        <span className='body5 text-gray-700'>
          선택됨: {categories.find((c) => c.value === category)?.label ?? '없음'}
        </span>
        <Button variant='primary' onClick={commentSheet.open}>
          댓글 보기
        </Button>
      </div>

      {/* 카테고리 선택 바텀시트 */}
      <SelectBottomSheet
        open={selectSheet.isOpen}
        onClose={selectSheet.close}
        title='타이틀'
        options={categories}
        value={category}
        onChange={(next) => setCategory(next)}
      />

      {/* 댓글 바텀시트 */}
      <CommentBottomSheet
        open={commentSheet.isOpen}
        onClose={commentSheet.close}
        comments={comments}
        onToggleLike={toggleLike}
        onReplyClick={(id) => console.log('reply to', id)}
        onSend={(text) => addComment(text)}
      />
    </>
  );
}
