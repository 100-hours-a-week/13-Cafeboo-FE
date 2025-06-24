import { useEffect, useRef, useState } from "react";
import { Calendar, Plus, BarChart2, ChevronUp } from "lucide-react";

type FABType = "diary" | "report";

interface FABProps {
  showAdd?: boolean;
  fabType?: FABType;
  onAddClick?: () => void;
  onMainClick?: () => void;
  scrollTargetSelector?: string;
}

export default function FABContainer({
  showAdd = false,
  fabType,
  onAddClick,
  onMainClick,
  scrollTargetSelector = "#scroll-container",
}: FABProps) {
  const [showToTop, setShowToTop] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observerTarget = document.querySelector("#observer-target");
    const scrollTarget = document.querySelector(scrollTargetSelector);
    if (!scrollTarget || !observerTarget) return;
  
    const observer = new IntersectionObserver(
      ([entry]) => setShowToTop(!entry.isIntersecting),
      {
        threshold: 0.1,
        root: scrollTarget,
        rootMargin: "100px 0px 0px 0px",
      }
    );
  
    requestAnimationFrame(() => {
        observer.observe(observerTarget);
      });

    return () => observer.disconnect();
  }, [scrollTargetSelector]);

  const scrollToTop = () => {
    const scrollTarget = document.querySelector(scrollTargetSelector);
    scrollTarget?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buttons: { key: string; element: JSX.Element }[] = [];

  if (showToTop) {
    buttons.push({
      key: "top",
      element: (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 rounded-full bg-white text-gray-600 border border-gray-300 flex items-center justify-center shadow-sm cursor-pointer transition-all duration-300"
        >
          <ChevronUp size={24} />
        </button>
      ),
    });
  }

  if (showAdd) {
    buttons.push({
      key: "add",
      element: (
        <button
          onClick={onAddClick}
          className="w-12 h-12 rounded-full bg-[#FE9400] text-white flex items-center justify-center shadow-sm cursor-pointer transition-all duration-300"
        >
          <Plus size={24} />
        </button>
      ),
    });
  }

  if (fabType === "diary") {
    buttons.push({
      key: "diary",
      element: (
        <button
          onClick={onMainClick}
          className="w-12 h-12 rounded-full bg-gray-500 text-white flex items-center justify-center shadow-sm cursor-pointer transition-all duration-300"
        >
          <Calendar size={24} />
        </button>
      ),
    });
  } else if (fabType === "report") {
    buttons.push({
      key: "report",
      element: (
        <button
          onClick={onMainClick}
          className="w-12 h-12 rounded-full bg-gray-500 text-white flex items-center justify-center shadow-sm cursor-pointer transition-all duration-300"
        >
          <BarChart2 size={24} />
        </button>
      ),
    });
  }

  return (
    <>
      {buttons.map((btn, idx) => {
        const spacing = 24 + idx * 64;
        return (
          <div
            key={btn.key}
            className="fixed lg:absolute right-5 z-15"
            style={{ bottom: `${spacing}px` }}
          >
            {btn.element}
          </div>
        );
      })}
    </>
  );
}

