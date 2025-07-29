import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const DiaryRoutes = lazy(() => import('./DiaryRoutes'));
const ReportRoutes = lazy(() => import('./ReportRoutes'));
const MypageRoutes = lazy(() => import('./MypageRoutes'));
const CoffeeChatRoutes = lazy(() => import('./CoffeeChatRoutes'));
const EventPage = lazy(() => import('@/pages/common/EventPage'));
const NotFoundPage = lazy(() => import('@/pages/common/NotFoundPage'));

const MainRoutes = () => (
  <Suspense fallback={<div>로딩 중...</div>}>
    <Routes>
      <Route path='event/*' element={<EventPage />} />
      <Route path="diary/*" element={<DiaryRoutes />} />
      <Route path="report/*" element={<ReportRoutes />} />
      <Route path="mypage/*" element={<MypageRoutes />} />
      <Route path="coffeechat/*" element={<CoffeeChatRoutes />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default MainRoutes;
