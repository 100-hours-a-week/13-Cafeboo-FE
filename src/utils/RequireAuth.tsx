// src/components/RequireAuth.tsx
import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import AlertModal from '@/components/common/AlertModal';

export default function RequireAuth() {
  const [showModal, setShowModal] = useState(false);
  const [checked, setChecked] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setShowModal(true);
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
        title="접근 권한이 없습니다"
        message="로그인 후 이용해주세요."
        confirmText="로그인하러 가기"
        onClose={handleClose}
        onConfirm={handleClose}
      />
    );
  }

  return <Outlet />;
}

