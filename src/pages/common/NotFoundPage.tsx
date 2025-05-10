import EmptyState from "@/components/common/EmptyState";
import { AlertTriangle } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <EmptyState
        title="페이지를 찾을 수 없습니다."
        description="요청하신 페이지가 존재하지 않거나 삭제되었습니다."
        icon={<AlertTriangle className="w-12 h-12 text-[#D1D1D1]" />}
      />
    </div>
  );
};

export default NotFoundPage;
