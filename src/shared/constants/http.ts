export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  SERVER_ERROR: 500,
} as const;

export const ERROR_CODES = {
  UNKNOWN: 'UNKNOWN_ERROR',
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  SERVER_ERROR: 'SERVER_ERROR',
} as const;

export const ERROR_MESSAGES = {
  UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
  NETWORK_ERROR: '네트워크 연결을 확인해주세요.',
  SERVER_ERROR: '서버 오류가 발생했습니다.',
  VALIDATION_ERROR: '입력값을 확인해주세요.',
  UNAUTHORIZED: '인증이 필요합니다.',
  FORBIDDEN: '접근 권한이 없습니다.',
  NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
  CONFLICT: '이미 존재하는 데이터입니다.',
} as const;

export const RESPONSE_MESSAGE: Record<number, string> = {
  [HTTP_STATUS.OK]: '요청이 성공했습니다.',
  [HTTP_STATUS.CREATED]: '리소스가 생성되었습니다.',
  [HTTP_STATUS.NO_CONTENT]: '요청이 성공했습니다.',
  [HTTP_STATUS.BAD_REQUEST]: '잘못된 요청입니다.',
  [HTTP_STATUS.UNAUTHORIZED]: '인증이 필요합니다.',
  [HTTP_STATUS.FORBIDDEN]: '접근 권한이 없습니다.',
  [HTTP_STATUS.NOT_FOUND]: '요청한 리소스를 찾을 수 없습니다.',
  [HTTP_STATUS.METHOD_NOT_ALLOWED]: '허용되지 않은 메서드입니다.',
  [HTTP_STATUS.CONFLICT]: '이미 존재하는 데이터입니다.',
  [HTTP_STATUS.SERVER_ERROR]: '서버 오류가 발생했습니다.',
} as const;
