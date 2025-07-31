import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface FullPageSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function FullPageSheet({
  open,
  onClose,
  children,
  title = '',
}: FullPageSheetProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      setTimeout(() => {
        setIsAnimating(true);
        document.body.style.overflow = 'hidden';
      }, 10);
    } else {
      setIsAnimating(false);
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleTransitionEnd = () => {
    if (!open) setShouldRender(false);
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className={clsx(
          'fixed bottom-0 left-0 right-0',
          'max-w-sm mx-auto w-full h-full',
          'bg-white shadow-lg flex flex-col',
          'lg:ml-128 xl:ml-192 2xl:ml-272',
          'transition-transform duration-300',
          isAnimating ? 'translate-y-0' : 'translate-y-full'
        )}
        onTransitionEnd={handleTransitionEnd}
      >
        {/* 상단 바 */}
        <div className="flex items-center justify-between px-4 py-4">
          <button onClick={onClose} className="z-10">
            <X className="w-6 h-6 cursor-pointer" />
          </button>
          <h2 className="absolute left-0 right-0 text-center text-lg font-bold">
            {title}
          </h2>
          <div className="w-6" />
        </div>

        {/* 본문 */}
        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 pb-6 pt-1">
          {children}
        </div>
      </div>
    </div>
  );
}
