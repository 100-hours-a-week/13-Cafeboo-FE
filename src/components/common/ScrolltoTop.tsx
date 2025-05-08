import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // 페이지 전환 시 최상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
