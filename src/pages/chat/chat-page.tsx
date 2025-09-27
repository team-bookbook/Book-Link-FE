import { useState } from 'react';
import Button from '@components/button/button';
import useBottomSheet from '@components/bottom-sheet/hooks/use-bottom-sheet';
import SelectBottomSheet from '@components/bottom-sheet/select-bottom-sheet';
import CommentBottomSheet, { type CommentItem, type ReplyItem } from '@components/bottom-sheet/comment-bottom-sheet';

export default function ChatPage() {
  // 카테고리 선택 시트
  const selectSheet = useBottomSheet();
  const [category, setCategory] = useState<string | null>('cat-a');

  const categories = [
    { value: 'cat-a', label: '카테고리 A' },
    { value: 'cat-b', label: '카테고리 B' },
    { value: 'cat-c', label: '카테고리 C' },
  ] as const;

  // 댓글 시트
  const commentSheet = useBottomSheet();
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 1,
      author: '홍길동',
      dateText: '2025.09.22',
      content: '댓글 내용이 여기에 들어갑니다.',
      likeCount: 9,
      replyCount: 9, // 서버 카운트 예시(펼치면 onLoadReplies로 로딩)
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

  // 댓글/답글 좋아요 토글
  const toggleLike = (kind: 'comment' | 'reply', id: number, parentId?: number) =>
    setComments((prev) =>
      prev.map((c) => {
        if (kind === 'comment') {
          if (c.id !== id) return c;
          const nextLiked = !c.liked;
          return { ...c, liked: nextLiked, likeCount: c.likeCount + (nextLiked ? 1 : -1) };
        }
        // reply
        if (c.id !== parentId) return c;
        const replies = (c.replies ?? []).map((r) =>
          r.id === id ? { ...r, liked: !r.liked, likeCount: r.likeCount + (r.liked ? -1 : 1) } : r
        );
        return { ...c, replies };
      })
    );

  // 새 댓글 추가
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

  // 새 답글 추가
  const addReply = (parentId: number, text: string) =>
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== parentId) return c;
        const next: ReplyItem = {
          id: Date.now(),
          author: '나',
          dateText: new Date().toISOString().slice(0, 10).replaceAll('-', '.'),
          content: text,
          likeCount: 0,
          liked: false,
        };
        const replies = [next, ...(c.replies ?? [])];
        return { ...c, replies, replyCount: c.replyCount + 1 };
      })
    );

  // 답글 펼칠 때 원격 로딩이 필요하다면 여기서 fetch
  // 데모: 아직 replies가 없을 때만 mock으로 채워줌
  const loadReplies = async (parentId: number) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id !== parentId) return c;
        if (c.replies && c.replies.length > 0) return c; // 이미 있음
        const mock: ReplyItem[] = [
          {
            id: Number(`${parentId}01`),
            author: '답글러',
            dateText: '2025.09.22',
            content: '샘플 답글입니다.',
            likeCount: 0,
            liked: false,
          },
          {
            id: Number(`${parentId}02`),
            author: '또다른 답글러',
            dateText: '2025.09.22',
            content: '두 번째 샘플 답글!',
            likeCount: 1,
            liked: true,
          },
        ];
        return { ...c, replies: mock };
      })
    );
  };

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
        title='댓글'
        comments={comments}
        onToggleLike={toggleLike}
        onReplyClick={(id) => console.log('reply to', id)}
        onSend={addComment}
        onSendReply={addReply}
        onLoadReplies={loadReplies}
      />
    </>
  );
}
