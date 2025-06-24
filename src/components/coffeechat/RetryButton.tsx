import { RotateCcw } from "lucide-react";
import { useState } from "react";

interface RetryButtonProps {
  onRetry: () => void | Promise<void>;
}

export default function RetryButton({ onRetry }: RetryButtonProps) {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleClick = async () => {
    setIsSpinning(true);
    try {
      await onRetry();
    } finally {
      setTimeout(() => setIsSpinning(false), 3000);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="ml-2 px-3 py-1 bg-white text-blue-500 text-xs font-medium rounded-full shadow cursor-pointer hover:bg-blue-100 flex items-center gap-1 transition-all"
    >
      <RotateCcw
        className={`w-3 h-3 ${isSpinning ? "animate-spin" : ""}`}
      />
      <span>재시도</span>
    </button>
  );
}
