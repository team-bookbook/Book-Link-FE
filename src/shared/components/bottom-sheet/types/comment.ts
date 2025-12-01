export type ReplyItem = {
  id: string;
  avatarUrl?: string;
  author: string;
  dateText: string;
  content: string;
  likeCount: number;
  liked?: boolean;
  disabled?: boolean;
  isUpdated?: boolean;
  isMine?: boolean;
  createdAt?: string;
};

export type CommentItem = {
  id: string;
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
  isUpdated?: boolean;
  isMine?: boolean;
  createdAt?: string;
};

export type ToggleLikeKind = 'comment' | 'reply';

export type CommentProps = {
  open: boolean;
  onClose: () => void;
  comments: readonly CommentItem[];
  onToggleLike?: (kind: ToggleLikeKind, id: string, parentId?: string) => void;
  onReplyClick?: (parentId: string) => void;
  onSend?: (text: string) => boolean | void | Promise<boolean | void>;
  onSendReply?: (parentId: string, text: string) => boolean | void | Promise<boolean | void>;
  onLoadReplies?: (parentId: string) => Promise<ReplyItem[] | void> | void;
  indicatorStroke?: boolean;
  emptyText?: string;
  title?: string;
};
