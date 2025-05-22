import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ReportMessageProps {
  statusMessage: string; 
}

const ReportMessage: React.FC<ReportMessageProps> = ({
  statusMessage,
}) => {
  const summaryMatch = statusMessage.match(
    /\[섭취 기록 요약\]\s*([\s\S]*?)(?=\s*\[맞춤형 조언\])/
  );
  const adviceMatch = statusMessage.match(
    /\[맞춤형 조언\]\s*([\s\S]*)/
  );

  let summaryText = summaryMatch?.[1].trim() ?? '';
  const adviceText = adviceMatch?.[1].trim() ?? '';

  summaryText = summaryText.replace(/유저 ID:\s*/g, '').trim();

  const highlightNumbers = (text: string): React.ReactNode => {
    return text.split(/(\d+(?:[,.]\d+)*)([a-zA-Z%]+)?/).map((part, index) => {
      if (/^\d+(?:[,.]\d+)*$/.test(part)) {
        return <span key={index} className="font-semibold">{part}</span>;
      }
      return part;
    });
  };

  const adviceItems = adviceText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return (
    <div className="space-y-6">

      <h2 className="mt-6 mb-2 text-md font-semibold text-[#000000]">
          섭취 기록 요약
      </h2>
      {/* 섭취 기록 요약 */}
      <div className="bg-[#FFF9F2] border-l-2 border-r-2 border-[#FE9400]/40 rounded-lg shadow-sm px-4 py-5 w-full mx-auto">
        <p className="rounded-lg leading-relaxed">
          {highlightNumbers(summaryText)}
        </p>
      </div>

      <h2 className="mt-6 mb-2 text-md font-semibold text-[#000000]">
          AI 맞춤형 조언
      </h2>

      {/* 맞춤형 조언 */}
      <div className="bg-[#FFF9F2] border-l-2 border-r-2 border-[#FE9400]/40 rounded-lg shadow-sm p-4 w-full mx-auto">
        <ul className="space-y-3">
          {adviceItems.map((item, idx) => (
            <li key={idx} className="flex">
              <CheckCircle size={16} className="text-[#FE9400] mr-2 mt-0.5 flex-shrink-0" />
              <p className="leading-snug">{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReportMessage;
