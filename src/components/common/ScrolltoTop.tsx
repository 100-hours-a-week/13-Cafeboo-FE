import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  selector?: string;
  top?: number;
  behavior?: ScrollBehavior;
}

export default function ScrollToTop({
  selector = 'main',
  top = 0,
  behavior = 'auto',
}: ScrollToTopProps) {
  const { pathname } = useLocation();

  useEffect(() => {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollTo({ top, behavior });
    } else {
      window.scrollTo({ top, behavior });
    }
  }, [pathname, selector, top, behavior]);

  return null;
}
