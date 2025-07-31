// 날짜 포맷 함수
export const formatDate = (date: Date) => {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// GMT 시간 포맷 함수(오전/오후 00:00)
export const formatTimeToKorean = (input: string | Date): string => {
  const cleaned = typeof input === 'string' ? input.split('.')[0] + 'Z' : input;

  const date = new Date(cleaned);

  return date.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};
