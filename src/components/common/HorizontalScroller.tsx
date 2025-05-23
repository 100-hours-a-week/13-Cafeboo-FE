import { useDraggableScroll } from '@/hooks/useDraggableScroll';

interface HorizontalScrollerProps {
  children: React.ReactNode;
  className?: string;
}

export default function HorizontalScroller({
    children,
    className = '',
  }: HorizontalScrollerProps) {
    const scrollRef = useDraggableScroll();
  

  return (
    <div
      ref={scrollRef}
      className={`
        flex space-x-2 overflow-x-auto select-none cursor-pointer
        scrollbar-hide
        ${className}
      `}
    >
      {children}
    </div>
  );
}