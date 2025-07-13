import SectionCard from "@/components/common/SectionCard";

interface Drink {
    brand: string;
    logo?: string;
    temperature?: string;
    name: string;
    score: number;
  }
  
  interface AiDrinkRecommendationProps {
    aiDrinks: Drink[];
  }
  
  export default function AiDrinkRecommendation({ aiDrinks }: AiDrinkRecommendationProps) {
    if (aiDrinks.length === 0) {
      return (
        <SectionCard>
          <div className="text-center text-gray-500">추천 음료가 없습니다.</div>
        </SectionCard>
      );
    }
  
    return (
      <>
        <SectionCard className="!py-0">
        <div className="flex flex-col">
            {aiDrinks.map((drink, idx) => (
            <div
                key={idx}
                className="flex items-center gap-3 py-3 border-b border-gray-200 last:border-b-0"
            >
                {/* 왼쪽: 브랜드 로고 */}
                <div className="w-12 flex-shrink-0">
                {drink.logo ? (
                    <img
                    src={drink.logo}
                    alt={drink.brand}
                    className="w-12 h-12 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                    {drink.brand[0]}
                    </div>
                )}
                </div>

                {/* 가운데: 브랜드명 + 온도 + 이름 */}
                <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-600 font-medium truncate">{drink.brand}</span>
                    {drink.temperature && (
                    <span
                        className={`text-[8px] font-medium px-1.5 rounded-full border ${
                        drink.temperature === 'ICED'
                            ? 'border-blue-600 text-blue-600 bg-blue-50'
                            : 'border-red-600 text-red-600 bg-red-50'
                        }`}
                    >
                        {drink.temperature}
                    </span>
                    )}
                </div>
                <div className="font-semibold text-black leading-tight truncate">{drink.name}</div>
                </div>

                {/* 오른쪽: score */}
                <div className="mr-2 flex flex-col items-center justify-center text-center">
                <span
                    className={`text-xl font-bold leading-none ${
                    idx === 0 ? 'text-[#FE9400]' : 'text-gray-400'
                    }`}
                >
                    {drink.score}
                </span>
                <span className="text-[11px] text-gray-400 leading-none">score</span>
                </div>
            </div>
            ))}
        </div>
        </SectionCard>
      </>
    );
  }
  