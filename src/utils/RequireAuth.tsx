import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import AlertModal from '@/components/common/AlertModal';

export default function RequireAuth() {
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    console.log(token || token === 'undefined');
    if (!token || token === 'undefined') {
      setShowModal(true);
      setChecked(true);
    } else {
      setChecked(true);
    }
  }, []);

  const handleClose = () => {
    setShowModal(false);
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

