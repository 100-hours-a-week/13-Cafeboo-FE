import AlertModal from '@/components/common/AlertModal';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function LoginRequiredModal({
  isOpen,
  onClose,
  onConfirm,
}: LoginRequiredModalProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  return (
    <AlertModal
      isOpen={isOpen}
      title="회원 전용 서비스"
      message="로그인 후 이용 가능한 서비스입니다."
      onClose={onClose}
      onConfirm={handleConfirm}
      confirmText="확인"
      showCancelButton={false}
    />
  );
}
