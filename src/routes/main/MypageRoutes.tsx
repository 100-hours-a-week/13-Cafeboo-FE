import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const MyPage = lazy(() => import('@/pages/mypage/mypage'));
const MyEditPage = lazy(() => import('@/pages/mypage/myeditpage'));
const NotFoundPage = lazy(() => import('@/pages/common/NotFoundPage'));

const MypageRoutes = () => (
  <Suspense fallback={<div>로딩 중...</div>}>
    <Routes>
      <Route path="/" element={<MyPage />} />
      <Route path="edit" element={<MyEditPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default MypageRoutes;
