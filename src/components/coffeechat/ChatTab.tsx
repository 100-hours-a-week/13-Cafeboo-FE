type ChatFilter = "ALL" | "JOINED" | "REVIEWABLE" | "REVIEWS";

interface ChatTabProps {
  filter: ChatFilter;          
  onChange: (value: ChatFilter) => void;  
}

const TABS: { value: ChatFilter; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "JOINED", label: "참여 중" },
  { value: "REVIEWABLE", label: "후기 작성" },
  { value: "REVIEWS", label: "전체 후기" },
];

export default function ChatTab({ filter, onChange }: ChatTabProps) {
  return (
    <div className="sticky top-0 bg-white z-10 px-2 pt-2 border-b border-[#d0ced3] flex space-x-4">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          aria-pressed={filter === tab.value}
          className={`pb-0.5 font-semibold cursor-pointer ${
            filter === tab.value
              ? "text-black border-b-2 border-[#FE9400]"
              : "text-gray-300"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

  