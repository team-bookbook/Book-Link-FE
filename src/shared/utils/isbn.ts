/**
 * ISBN (International Standard Book Number) 검증 유틸리티
 */

/**
 * ISBN-10의 체크섬을 계산합니다
 * @param isbn ISBN-10 문자열 (10자리)
 * @returns 체크섬이 유효하면 true
 */
function validateISBN10(isbn: string): boolean {
  if (isbn.length !== 10) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const digit = parseInt(isbn[i], 10);
    if (isNaN(digit)) return false;
    sum += digit * (10 - i);
  }

  // 마지막 자리는 X(10) 또는 숫자
  const lastChar = isbn[9];
  const checkDigit = lastChar === 'X' || lastChar === 'x' ? 10 : parseInt(lastChar, 10);
  if (isNaN(checkDigit)) return false;

  sum += checkDigit;
  return sum % 11 === 0;
}

/**
 * ISBN-13의 체크섬을 계산합니다 (EAN-13과 동일)
 * @param isbn ISBN-13 문자열 (13자리)
 * @returns 체크섬이 유효하면 true
 */
function validateISBN13(isbn: string): boolean {
  if (isbn.length !== 13) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn[i], 10);
    if (isNaN(digit)) return false;
    // 홀수 인덱스(짝수번째)는 3을 곱함
    sum += digit * (i % 2 === 0 ? 1 : 3);
  }

  const checkDigit = parseInt(isbn[12], 10);
  if (isNaN(checkDigit)) return false;

  const calculatedCheckDigit = (10 - (sum % 10)) % 10;
  return checkDigit === calculatedCheckDigit;
}

/**
 * 문자열에서 하이픈과 공백을 제거합니다
 * @param isbn ISBN 문자열
 * @returns 정규화된 ISBN
 */
function normalizeISBN(isbn: string): string {
  return isbn.replace(/[-\s]/g, '');
}

/**
 * ISBN 바코드인지 검증합니다
 * @param barcode 바코드 문자열
 * @returns ISBN이 유효하면 { valid: true, isbn: string, type: 'ISBN-10' | 'ISBN-13' }, 아니면 { valid: false, reason: string }
 */
export function validateISBN(barcode: string): {
  valid: boolean;
  isbn?: string;
  type?: 'ISBN-10' | 'ISBN-13';
  reason?: string;
} {
  const normalized = normalizeISBN(barcode);

  // 숫자만 포함되어 있는지 확인 (ISBN-10은 마지막에 X 가능)
  if (!/^[\dX]+$/i.test(normalized)) {
    return {
      valid: false,
      reason: '유효하지 않은 문자가 포함되어 있습니다',
    };
  }

  // 길이 확인
  if (normalized.length !== 10 && normalized.length !== 13) {
    return {
      valid: false,
      reason: `ISBN은 10자리 또는 13자리여야 합니다 (현재: ${normalized.length}자리)`,
    };
  }

  // ISBN-13 검증
  if (normalized.length === 13) {
    // ISBN-13은 978 또는 979로 시작
    if (!normalized.startsWith('978') && !normalized.startsWith('979')) {
      return {
        valid: false,
        reason: 'ISBN-13은 978 또는 979로 시작해야 합니다',
      };
    }

    if (!validateISBN13(normalized)) {
      return {
        valid: false,
        reason: 'ISBN-13 체크섬이 유효하지 않습니다',
      };
    }

    return {
      valid: true,
      isbn: normalized,
      type: 'ISBN-13',
    };
  }

  // ISBN-10 검증
  if (normalized.length === 10) {
    if (!validateISBN10(normalized)) {
      return {
        valid: false,
        reason: 'ISBN-10 체크섬이 유효하지 않습니다',
      };
    }

    return {
      valid: true,
      isbn: normalized,
      type: 'ISBN-10',
    };
  }

  return {
    valid: false,
    reason: '알 수 없는 오류가 발생했습니다',
  };
}

/**
 * ISBN-10을 ISBN-13으로 변환합니다
 * @param isbn10 ISBN-10 문자열
 * @returns ISBN-13 문자열
 */
export function convertISBN10ToISBN13(isbn10: string): string {
  const normalized = normalizeISBN(isbn10);
  if (normalized.length !== 10) {
    throw new Error('유효하지 않은 ISBN-10입니다');
  }

  // 978 접두사 추가하고 체크 디지트 제거
  const base = '978' + normalized.slice(0, 9);

  // 새로운 체크 디지트 계산
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(base[i], 10);
    sum += digit * (i % 2 === 0 ? 1 : 3);
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return base + checkDigit;
}

/**
 * ISBN을 포맷팅합니다 (하이픈 추가)
 * @param isbn ISBN 문자열
 * @returns 포맷팅된 ISBN (예: 978-89-12345-67-8)
 */
export function formatISBN(isbn: string): string {
  const normalized = normalizeISBN(isbn);

  if (normalized.length === 13) {
    // ISBN-13: 978-89-12345-67-8
    return `${normalized.slice(0, 3)}-${normalized.slice(3, 5)}-${normalized.slice(5, 10)}-${normalized.slice(10, 12)}-${normalized.slice(12)}`;
  }

  if (normalized.length === 10) {
    // ISBN-10: 89-12345-67-8
    return `${normalized.slice(0, 2)}-${normalized.slice(2, 7)}-${normalized.slice(7, 9)}-${normalized.slice(9)}`;
  }

  return normalized;
}
