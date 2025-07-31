import PageLayout from '@/layout/PageLayout';
import HealthInfoEditor from '@/components/mypage/HealthInfoEditor';
import AlertModal from '@/components/common/AlertModal';
import { Info } from 'lucide-react';

interface Props {
  isLoading: boolean;
  error: string | null;
  setError: (err: string | null) => void;
  onSave: (data: any) => Promise<void>;
  onBackClick: () => void;
  initHealth?: any;
  initCaffeine?: any;
}

export default function MyEditPageUI({
  isLoading,
  error,
  setError,
  onSave,
  onBackClick,
  initHealth,
  initCaffeine,
}: Props) {
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div>저장 중...</div>
      </div>
    );
  }

  return (
    <PageLayout
      headerMode="title"
      headerTitle="내 정보 수정"
      onBackClick={onBackClick}
    >
      <HealthInfoEditor
        initHealth={initHealth}
        initCaffeine={initCaffeine}
        onSave={onSave}
      />

      <AlertModal
        isOpen={!!error}
        icon={<Info size={36} className="text-[#FE9400]" />}
        title="수정 오류"
        message={error || ''}
        onClose={() => setError(null)}
        onConfirm={() => setError(null)}
        confirmText="확인"
        showCancelButton={false}
      />
    </PageLayout>
  );
}
