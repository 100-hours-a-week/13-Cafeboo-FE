import { Routes, Route } from 'react-router-dom';
import RootPage from '@/pages/common/RootPage';
import AuthRoutes from './auth/AuthRoutes';
import MainRoutes from './main/MainRoutes';
import NotFoundPage from '@/pages/common/NotFoundPage';
import KakaoRedirectPage from '@/pages/auth/KaKaoRedirectPage';
import RequireAuth from '@/routes/RequireAuth';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<RootPage />} />
    <Route path="/auth/*" element={<AuthRoutes />} />
    <Route path="/oauth/kakao/callback" element={<KakaoRedirectPage />} />
    <Route element={<RequireAuth />}>
      <Route path="/main/*" element={<MainRoutes />} />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default AppRoutes;
