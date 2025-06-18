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
      className={clsx(
        "relative flex items-center px-2 py-0.5 rounded-full transition-all duration-200 cursor-pointer",
        liked
          ? "text-red-500 bg-red-50 hover:bg-red-100"
          : "text-gray-400 hover:text-red-400 hover:bg-red-50"
      )}
    >
      <Heart
        size={17}
        fill={liked ? "currentColor" : "none"}
        className={clsx("transition-transform", {
          "text-red-500": liked,
          "text-gray-400 hover:text-red-400": !liked,
        })}
      />
      {animating && (
        <Heart
          size={17}
          fill="currentColor"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-up text-red-500"
        />
      )}
      <span className="ml-1 text-base text-gray-600">{likeCount + (liked ? 1 : 0)}</span>
    </button>
  );
}
