function validateISBN13(isbn: string): boolean {
  if (isbn.length !== 13) return false;

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn[i], 10);
    if (isNaN(digit)) return false;
    sum += digit * (i % 2 === 0 ? 1 : 3);
  }

  const checkDigit = parseInt(isbn[12], 10);
  if (isNaN(checkDigit)) return false;

  const calculatedCheckDigit = (10 - (sum % 10)) % 10;
  return checkDigit === calculatedCheckDigit;
}

function normalizeISBN(isbn: string): string {
  return isbn.replace(/[-\s]/g, '');
}

export function validateISBN(barcode: string): {
  valid: boolean;
  isbn?: string;
  type?: 'ISBN-13';
  reason?: string;
} {
  const normalized = normalizeISBN(barcode);

  // 숫자만 허용
  if (!/^\d+$/.test(normalized)) {
    return {
      valid: false,
      reason: '숫자만 포함되어야 합니다',
    };
  }

  // 길이 반드시 13자리
  if (normalized.length !== 13) {
    return {
      valid: false,
      reason: `ISBN-13은 13자리여야 합니다 (현재: ${normalized.length})`,
    };
  }

  // ISBN-13 접두어 체크 (국제 ISBN 규격)
  if (!normalized.startsWith('978') && !normalized.startsWith('979')) {
    return {
      valid: false,
      reason: 'ISBN-13은 978 또는 979로 시작해야 합니다',
    };
  }

  // 체크섬 검증
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
