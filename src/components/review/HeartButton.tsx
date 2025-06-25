import { Heart } from "lucide-react";
import clsx from "clsx";
import { useRef, useState } from "react";
import FloatHeart from "./FloatHeart";

interface HeartButtonProps {
  liked: boolean;
  likeCount: number;
  onToggle?: (liked: boolean) => void;
}

export default function HeartButton({
  liked,
  likeCount,
  onToggle,
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
          handleClick();
        }}
        className={clsx(
          "relative flex items-center px-2 py- rounded-full transition-all duration-200 cursor-pointer",
          liked
            ? "text-red-500 bg-red-50 hover:bg-red-100"
            : "text-gray-400 hover:text-red-400 hover:bg-red-50"
        )}
      >
        <Heart
          ref={heartRef}
          size={16}
          fill={liked ? "currentColor" : "none"}
          className={clsx("transition-transform", {
            "text-red-500": liked,
            "text-gray-400 hover:text-red-400": !liked,
          })}
        />
        <span className="ml-1 text-base text-gray-600">{likeCount}</span>
      </button>

      {coords && <FloatHeart x={coords.x} y={coords.y} />}
    </>
  );
}




