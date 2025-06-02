interface ChatTabProps {
    filter: string;
    onChange: (value: string) => void;
  }
  
  const TABS = [
    { label: "전체", value: "all" },
    { label: "참여 중", value: "joined" },
    { label: "참여 완료", value: "completed" },
  ];
  
  export default function ChatTab({ filter, onChange }: ChatTabProps) {
    return (
      <div className="sticky top-0 bg-white z-10 px-2 pb-4 flex space-x-4">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`pb-1 font-semibold cursor-pointer ${
              filter === tab.value
                ? "text-black border-b-2 border-[#FE9400]"
                : "text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  }
  