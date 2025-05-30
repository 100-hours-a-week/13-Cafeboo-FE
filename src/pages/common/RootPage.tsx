import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const RootPage = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userId = localStorage.getItem('userId');
    if (token && userId) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
      console.log('로그인된 사용자 정보가 없습니다.');
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <LoadingSpinner size="large" type="clip" />;
  }

  return <Navigate to={isLogin ? '/main/home' : '/auth/login'} />;
};

export default RootPage;

