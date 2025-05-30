export const getUserId = (): string => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('로그인 정보가 없습니다.');
    }
    return userId;
};