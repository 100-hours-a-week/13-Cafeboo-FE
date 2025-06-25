import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AlertModal from '@/components/common/AlertModal';
import { useUserStore } from '@/stores/useUserStore';

export default function RequireAuth() {
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();
  const clearUserId = useUserStore.getState().clearUserId;

  useEffect(() => {
    const token = localStorage.getItem('userId');
    if (!token || token === 'undefined') {
      setShowModal(true);
      setChecked(true);
    } else {
      setChecked(true);
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
    localStorage.removeItem('access_token');
    clearUserId(); 
    navigate('/auth/login', { replace: true });
  };

  if (!checked && !showModal) {
    return null;
  }

  if (showModal) {
    return (
      <AlertModal
        isOpen={showModal}
        title="로그인이 필요합니다."
        message="로그인 후 다시 이용해주세요."
        confirmText="확인"
        onClose={handleClose}
        onConfirm={handleClose}
      />
    );
  }

  return <Outlet />;
}

