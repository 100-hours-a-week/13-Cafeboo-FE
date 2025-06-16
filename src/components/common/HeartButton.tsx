import { useState } from "react";
import { Heart } from "lucide-react";
import clsx from "clsx";

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
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 400);
    if (onToggle) onToggle(newLiked);
  };

  return (
    <button
      onClick={handleClick}
      className="relative w-5 h-5 flex items-center justify-center"
    >
      <Heart
        size={14}
        fill={liked ? "currentColor" : "none"}
        className={clsx("transition-transform", {
          "text-red-500": liked,
          "text-gray-400 hover:text-red-400": !liked,
        })}
      />
      {animating && (
        <Heart
          size={14}
          fill="currentColor"
          className="absolute left-1/2 top-0 animate-float-up text-red-500"
        />
      )}
      <span className="ml-1 text-xs text-gray-600">{likeCount + (liked ? 1 : 0)}</span>
    </button>
  );
}
