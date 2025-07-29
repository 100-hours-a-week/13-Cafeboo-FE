import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('@/pages/home'));
const AuthRoutes = lazy(() => import('./auth/AuthRoutes'));
const MainRoutes = lazy(() => import('./main/MainRoutes'));
const KakaoRedirectPage = lazy(() => import('@/pages/auth/KaKaoRedirectPage'));
const NotFoundPage = lazy(() => import('@/pages/common/NotFoundPage'));

const AppRoutes = () => (
  <Suspense fallback={<div>로딩 중...</div>}>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/*" element={<MainRoutes />} />
      <Route path="/auth/*" element={<AuthRoutes />} />
      <Route path="/oauth/kakao/callback" element={<KakaoRedirectPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
