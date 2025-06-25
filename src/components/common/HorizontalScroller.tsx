import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { useDraggableScroll } from '@/hooks/useDraggableScroll';

interface HorizontalScrollerProps {
  children: React.ReactNode;
  className?: string;
}

const HorizontalScroller = forwardRef<HTMLDivElement, HorizontalScrollerProps>(
  ({ children, className = '' }, ref) => {
    const scrollRef = useDraggableScroll();

    useImperativeHandle(ref, () => scrollRef.current as HTMLDivElement);

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
);

HorizontalScroller.displayName = 'HorizontalScroller';

export default HorizontalScroller;
