import { Check } from 'lucide-react';
const Step4 = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full px-4 mt-20 space-y-6">
        <div className="w-12 h-12 rounded-full bg-[#FF9B17]/10 flex items-center justify-center">
          <Check size={28} className="text-[#FF9B17]" />
        </div>
        <h2 className="text-center text-xl font-medium text-[#000000]">
          온보딩 인터뷰를 <span className="block md:inline">완료하였습니다!</span>
        </h2>
    </div>
    );
  };
  
  export default Step4;
  
