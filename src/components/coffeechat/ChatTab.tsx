interface ChatTabProps {
    filter: string;
    onChange: (value: string) => void;
  }
  
  const TABS = [
    { label: "전체", value: "all" },
    { label: "참여 중", value: "joined" },
    { label: "내 후기", value: "completed" },
  ];
  
  export default function ChatTab({ filter, onChange }: ChatTabProps) {
    return (
      <div className="sticky top-0 bg-white z-10 px-2 border-b border-[#d0ced3] flex space-x-5">
        {TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
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
  