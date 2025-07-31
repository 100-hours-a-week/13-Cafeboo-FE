import { useEffect, useRef, useState } from 'react';
import { Plus, ChevronUp } from 'lucide-react';

interface FABProps {
  showAdd?: boolean;
  onAddClick?: () => void;
  scrollTargetSelector?: string;
}

export default function FABContainer({
  showAdd = false,
  onAddClick,
  scrollTargetSelector = '#scroll-container',
}: FABProps) {
  const [showToTop, setShowToTop] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observerTarget = document.querySelector('#observer-target');
    const scrollTarget = document.querySelector(scrollTargetSelector);
    if (!scrollTarget || !observerTarget) return;

    const observer = new IntersectionObserver(
      ([entry]) => setShowToTop(!entry.isIntersecting),
      {
        threshold: 0.1,
        root: scrollTarget,
        rootMargin: '100px 0px 0px 0px',
      }
    );

    requestAnimationFrame(() => {
      observer.observe(observerTarget);
    });

    return () => observer.disconnect();
  }, [scrollTargetSelector]);

  const scrollToTop = () => {
    const scrollTarget = document.querySelector(scrollTargetSelector);
    scrollTarget?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buttons: { key: string; element: JSX.Element }[] = [];

  if (showToTop) {
    buttons.push({
      key: 'top',
      element: (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full bg-white text-gray-600 border border-gray-300 flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)] cursor-pointer transition-all duration-300"
        >
          <ChevronUp size={24} />
        </button>
      ),
    });
  }

  if (showAdd) {
    buttons.push({
      key: 'add',
      element: (
        <button
          onClick={onAddClick}
          className="w-12 h-12 rounded-full bg-[#FE9400] text-white flex items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.2)] cursor-pointer transition-all duration-300"
        >
          <Plus size={24} />
        </button>
      ),
    });
  }

  return (
    <>
      {buttons.map((btn, idx) => {
        const spacing = 88 + idx * 64;
        return (
          <div
            key={btn.key}
            className="absolute right-5 z-15"
            style={{ bottom: `${spacing}px` }}
          >
            {btn.element}
          </div>
        );
      })}
    </>
  );
}
