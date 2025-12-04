export const END_POINT = {
  // 리뷰 API
  REVIEW: '/review',
  REVIEW_BY_LIBRARY_ID: (id: string) => `/review/${id}`,
  REVIEW_BY_REVIEW_ID: (id: string) => `/review/${id}`,
  REVIEW_RATING_BY_ID: (id: string) => `/review/rating/${id}`,

  // 인증 API
  AUTH_LOGIN: '/auth/login',
  AUTH_LOGOUT: '/auth/logout',
  AUTH_SIGNUP: '/member/signup',
  TOKEN_REISSUE: '/token/reissue',

  // 포인트 API
  POINT_USE: '/point/use',
  POINT_EXCHANGE: '/point/exchange',
  POINT_CHARGE: '/point/charge',
  POINT_CANCEL: '/point/cancel',
  POINT_HISTORY: '/point/history',
  POINT_BALANCE: '/point/balance',

  // 결제 API
  PAYMENT_INIT: '/payment/init',
  PAYMENT_BY_ID: (paymentId: string) => `/payment/${paymentId}`,
  PAYMENT_BY_USER: (userId: string) => `/payment/user/${userId}`,

  // 대여 API
  BORROW: '/borrow',

  // 도서 API
  BOOK: '/book',
  BOOK_BY_ISBN: (isbn: string) => `/book/${isbn}`,

  // 알림 API
  NOTIFICATION: '/notification',
  NOTIFICATION_BY_ID: (id: number) => `/notification/${id}`,
  NOTIFICATION_READ_ALL: '/notification/read-all',
  NOTIFICATION_UNREAD: '/notification/unread',

  // 도서관 도서 API
  LIBRARY_BOOK: '/library-book',
  LIBRARY_BOOK_BY_ID: (libraryBookId: number) => `/library-book/${libraryBookId}`,

  // 도서관 API
  LIBRARY: 'library',
  LIBRARY_BY_ID: (libraryId: string) => `/library/${libraryId}`,

  // 1:1 채팅 API
  SINGLE_CHATS_SEND_MESSAGE: '/singleChats/sendMessage',
  SINGLE_CHATS_ROOMS: '/singleChats/rooms',
  SINGLE_CHATS_ROOM_MESSAGES: (chatId: string) => `/singleChats/rooms/${chatId}/messages`,

  // S3 API
  S3_PRESIGNED_URL: '/s3/presigned-url',

  // 회원 API
  MEMBER_ME: '/member/me',
  MEMBER_UPDATE: '/member/update',

  // 게시판 API
  BOARD: '/board',
  BOARD_BY_ID: (boardId: string) => `/board/${boardId}`,
  BOARD_LIKE: (boardId: string) => `/board/${boardId}/like`,

  // 댓글 API
  COMMENT: '/comment',
  COMMENT_BY_BOARD_ID: (boardId: string) => `/comment/${boardId}`,
  COMMENT_BY_ID: (commentId: string) => `/comment/${commentId}`,
  COMMENT_REPLIES: (parentId: string) => `/comment/${parentId}/replies`,
  COMMENT_LIKE: (commentId: string) => `/comment/${commentId}/like`,

  // 모임 API
  GROUP: '/group',
};
