import { useState, useEffect, useRef } from "react";
import { Heart } from "lucide-react";
import clsx from "clsx";
import FloatHeart from "./FloatHeart";

interface HeartButtonProps {
  initiallyLiked?: boolean;
  likeCount: number;
  onToggle?: (liked: boolean) => void;
}

export default function HeartButton({
  initiallyLiked = false,
  likeCount,
  onToggle,
}: HeartButtonProps) {
  const [liked, setLiked] = useState(initiallyLiked);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const heartRef = useRef<SVGSVGElement | null>(null); // ✅ 하트 아이콘 참조

  useEffect(() => {
    setLiked(initiallyLiked);
  }, [initiallyLiked]);

  const handleClick = () => {
    if (heartRef.current) {
      const rect = heartRef.current.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top - 10; // 하트 바로 위에서 시작

      setCoords({ x, y });
      setTimeout(() => setCoords(null), 500);
    }

    const newLiked = !liked;
    setLiked(newLiked);
    if (onToggle) onToggle(newLiked);
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        className={clsx(
          "relative flex items-center px-2 py-0.5 rounded-full transition-all duration-200 cursor-pointer",
          liked
            ? "text-red-500 bg-red-50 hover:bg-red-100"
            : "text-gray-400 hover:text-red-400 hover:bg-red-50"
        )}
      >
        <Heart
          ref={heartRef} // ✅ ref 연결
          size={17}
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


