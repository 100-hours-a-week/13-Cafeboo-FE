// 숫자 입력창
export const sanitizeIntegerInput = (raw: string): string => {
  return raw.replace(/[^0-9]/g, '');
};

// 소수점 첫째자리 입력창
export const sanitizeDecimalInput = (raw: string): string => {
  let v = raw.replace(/[^0-9.]/g, '');
  const parts = v.split('.');

  if (parts.length > 2) {
    v = parts[0] + '.' + parts[1];
  }

  if (parts.length > 1) {
    parts[1] = parts[1].slice(0, 1);
    v = parts[0] + '.' + parts[1];
  }

  return v;
};

// 최대 문자열 입력창
export function limitLength(value: string, max: number) {
  return value.slice(0, max);
}
