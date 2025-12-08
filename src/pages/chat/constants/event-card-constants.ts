import imgCheckin from '@images/chat-event-checkin.png';
import imgCheckout from '@images/chat-event-checkout.png';
import imgSuccess from '@images/chat-event-success.png';
import imgFail from '@images/chat-event-fail.png';

export const EVENT_IMAGES = {
  checkout: imgCheckout,
  checkin: imgCheckin,
  renew: imgCheckout,
} as const;

export const EVENT_MESSAGES = {
  checkout: {
    mine: {
      request: {
        header: '요청합니다!',
        content: '대여 확정 요청을 보냈습니다.',
      },
      success: {
        header: '수락되었습니다!',
        content: '대여 확정 요청이 수락되었습니다.',
      },
      fail: {
        header: '거절되었습니다',
        content: '대여 확정 요청이 거절되었습니다.',
      },
    },
    other: {
      request: {
        header: '요청합니다!',
        content: '대여 확정 요청을 보내셨습니다.',
      },
      success: {
        header: '수락했습니다!',
        content: '대여 확정 요청을 수락했습니다.',
      },
      fail: {
        header: '거절했습니다',
        content: '대여 확정 요청을 거절했습니다.',
      },
    },
  },
  checkin: {
    mine: {
      request: {
        header: '요청합니다!',
        content: '반납 확인 요청을 보냈습니다.',
      },
      success: {
        header: '수락되었습니다!',
        content: '반납 확인 요청이 수락되었습니다.',
      },
      fail: {
        header: '거절되었습니다',
        content: '반납 확인 요청이 거절되었습니다.',
      },
    },
    other: {
      request: {
        header: '요청합니다!',
        content: '반납 확인 요청을 보내셨습니다.',
      },
      success: {
        header: '수락했습니다!',
        content: '반납 확인 요청을 수락했습니다.',
      },
      fail: {
        header: '거절했습니다',
        content: '반납 확인 요청을 거절했습니다.',
      },
    },
  },
  renew: {
    mine: {
      request: {
        header: '요청합니다!',
        content: '연장 요청을 보냈습니다.',
      },
      success: {
        header: '수락되었습니다!',
        content: '연장 요청이 수락되었습니다.',
      },
      fail: {
        header: '거절되었습니다',
        content: '연장 요청이 거절되었습니다.',
      },
    },
    other: {
      request: {
        header: '요청합니다!',
        content: '연장 요청을 보내셨습니다.',
      },
      success: {
        header: '수락했습니다!',
        content: '연장 요청을 수락했습니다.',
      },
      fail: {
        header: '거절했습니다',
        content: '연장 요청을 거절했습니다.',
      },
    },
  },
} as const;

export const STATUS_IMAGES = {
  success: imgSuccess,
  fail: imgFail,
} as const;
