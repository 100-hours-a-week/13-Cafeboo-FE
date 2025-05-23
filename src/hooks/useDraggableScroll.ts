import { useRef, useEffect } from 'react';

export function useDraggableScroll() {
  const elRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ isDown: false, startX: 0, scrollLeft: 0 });

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      drag.current.isDown = true;
      el.classList.add('cursor-grabbing');
      drag.current.startX = e.pageX - el.offsetLeft;
      drag.current.scrollLeft = el.scrollLeft;
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!drag.current.isDown) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - drag.current.startX) * 1.5;
      el.scrollLeft = drag.current.scrollLeft - walk;
    };
    const onMouseUp = () => {
      drag.current.isDown = false;
      el.classList.remove('cursor-grabbing');
    };

    el.addEventListener('mousedown', onMouseDown);
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseUp);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      el.removeEventListener('mousedown', onMouseDown);
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseUp);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return elRef;
}
