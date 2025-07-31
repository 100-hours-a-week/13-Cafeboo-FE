const GU_UNITS = ['구', '군', '시'];
const DONG_UNITS = ['동', '읍', '면', '리'];

// 주소 파싱 함수
export const extractAreaUnit = (address: string): string => {
  if (!address) return '';

  const words = address.split(' ');

  let lastGuIdx = -1;
  for (let i = 0; i < words.length; i++) {
    if (GU_UNITS.some((unit) => words[i].endsWith(unit))) {
      lastGuIdx = i;
    }
  }
  if (lastGuIdx !== -1) {
    if (
      lastGuIdx + 1 < words.length &&
      DONG_UNITS.some((unit) => words[lastGuIdx + 1].endsWith(unit))
    ) {
      return words[lastGuIdx] + ' ' + words[lastGuIdx + 1];
    }
    return words[lastGuIdx];
  }

  for (let i = 0; i < words.length; i++) {
    if (DONG_UNITS.some((unit) => words[i].endsWith(unit))) {
      return words[i];
    }
  }

  return address;
};

// 카카오 장소 ID 파싱 함수
export const extractPlaceId = (kakaoPlaceUrl: string) => {
  const match = kakaoPlaceUrl.match(/(?:,|\/)(\d{5,})$/);
  return match ? match[1] : null;
};
