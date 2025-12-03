import type { IComment, IReply } from '@apis/board/comment-queries';

export type ICommentWithReplies = IComment & {
  replies?: IReply[];
};

export type ToggleLikeKind = 'comment' | 'reply';

export type CommentProps = {
  open: boolean;
  onClose: () => void;
  comments: readonly ICommentWithReplies[];
  onToggleLike?: (kind: ToggleLikeKind, id: string, parentId?: string) => void;
  onReplyClick?: (parentId: string) => void;
  onLongPress?: (kind: ToggleLikeKind, id: string, parentId?: string) => void;
  onSend?: (text: string) => boolean | void | Promise<boolean | void>;
  onSendReply?: (parentId: string, text: string) => boolean | void | Promise<boolean | void>;
  onLoadReplies?: (parentId: string) => Promise<IReply[] | void> | void;
  indicatorStroke?: boolean;
  emptyText?: string;
  title?: string;
};
