export type ReplyItem = {
  id: number;
  avatarUrl?: string;
  author: string;
  dateText: string;
  content: string;
  likeCount: number;
  liked?: boolean;
  disabled?: boolean;
};

export type CommentItem = {
  id: number;
  avatarUrl?: string;
  author: string;
  dateText: string;
  content: string;
  likeCount: number;
  /** 전체 답글 개수(서버 카운트) */
  replyCount: number;
  /** 이미 로드된 답글 목록(옵션) */
  replies?: ReplyItem[];
  liked?: boolean;
  disabled?: boolean;
};

export type ToggleLikeKind = 'comment' | 'reply';

export type CommentProps = {
  open: boolean;
  onClose: () => void;
  comments: readonly CommentItem[];
  onToggleLike?: (kind: ToggleLikeKind, id: number, parentId?: number) => void;
  onReplyClick?: (parentId: number) => void;
  onSend?: (text: string) => boolean | void | Promise<boolean | void>;
  onSendReply?: (parentId: number, text: string) => boolean | void | Promise<boolean | void>;
  onLoadReplies?: (parentId: number) => Promise<ReplyItem[] | void> | void;
  indicatorStroke?: boolean;
  emptyText?: string;
  title?: string;
};
