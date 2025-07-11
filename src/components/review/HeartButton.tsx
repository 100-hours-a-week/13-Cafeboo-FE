import { Heart } from "lucide-react";
import clsx from "clsx";
import { useRef, useState } from "react";
import FloatHeart from "./FloatHeart";

interface HeartButtonProps {
  liked: boolean;
  likeCount: number;
  onToggle?: (liked: boolean) => void;
  disabled?: boolean;
}

export default function HeartButton({
  liked,
  likeCount,
  onToggle,
  disabled = false,
}: HeartButtonProps) {
  const heartRef = useRef<SVGSVGElement | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  const handleClick = () => {
    if (heartRef.current) {
      const rect = heartRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top - 10;
      setCoords({ x, y });
      setTimeout(() => setCoords(null), 500);
    }

    if (onToggle) onToggle(!liked);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if(!disabled) handleClick();
        }}
        className={clsx(
          "relative flex items-center px-2 py- rounded-full transition-all duration-200",
          liked ? "text-red-500": "text-gray-400",
          !disabled ? "cursor-pointer hover:text-red-400":''
        )}
      >
        <Heart
          ref={heartRef}
          size={14}
          fill={liked ? "currentColor" : "none"}
          className={clsx(
            "transition-transform",
            liked ? "text-red-500" : "text-gray-400",
            !disabled && "hover:text-red-400"
          )}
        />
        <span className="ml-1 text-sm text-gray-600">{likeCount}</span>
      </button>

      {coords && <FloatHeart x={coords.x} y={coords.y} />}
    </>
  );
}




