import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { checkLoginStatus } from '@/utils/auth';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const RootPage = () => {
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(checkLoginStatus());
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner size='large' type='clip'/>;
  return <Navigate to={isLogin ? '/main/home' : '/auth/login'} />;
};

export default RootPage;
