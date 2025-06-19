import { createPortal } from "react-dom";
import { Heart } from "lucide-react";

export default function FloatHeart({ x, y }: { x: number; y: number }) {
  return createPortal(
    <Heart
      size={20}
      fill="currentColor"
      className="fixed text-red-500 animate-float-up pointer-events-none"
      style={{
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
    />,
    document.body
  );
}
