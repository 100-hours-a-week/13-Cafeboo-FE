import SectionCard from "../common/SectionCard";

interface ReportMessageProps {
  statusMessage: string;
}

export default function ReportMessage({ statusMessage }: ReportMessageProps) {
  const summaryMatch = statusMessage.match(
    /\[섭취 기록 요약\]\s*([\s\S]*?)\s*(?=\[AI 맞춤형 조언\])/
  );
  const adviceMatch = statusMessage.match(/\[AI 맞춤형 조언\]\s*([\s\S]*)/);

  const formatTextWithLineBreaks = (text: string) =>
    text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));

  if (summaryMatch && adviceMatch) {
    return (
      <>
        <div className="text-base font-semibold mb-2">
            섭취 기록 요약
        </div>
        <SectionCard>
            {formatTextWithLineBreaks(summaryMatch[1].trim())}
        </SectionCard>
        <div className="text-base font-semibold mb-2">
            AI 맞춤형 조언
        </div>
        <SectionCard>
            {formatTextWithLineBreaks(adviceMatch[1].trim())}
        </SectionCard>
      </>
    );
  }

  return (
    <>
      <div className="text-base font-semibold mb-2">
        AI 분석
      </div>
      <SectionCard>
          {formatTextWithLineBreaks(statusMessage.trim())}
      </SectionCard>
    </>
  );
}


