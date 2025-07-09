import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/home';
import AuthRoutes from './auth/AuthRoutes';
import MainRoutes from './main/MainRoutes';
import NotFoundPage from '@/pages/common/NotFoundPage';
import KakaoRedirectPage from '@/pages/auth/KaKaoRedirectPage';
import RequireAuth from '@/routes/RequireAuth';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/*" element={<MainRoutes />} />
    <Route path="/auth/*" element={<AuthRoutes />} />
    <Route path="/oauth/kakao/callback" element={<KakaoRedirectPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
