import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const ReportPage = lazy(() => import('@/pages/report'));
const NotFoundPage = lazy(() => import('@/pages/common/NotFoundPage'));

const ReportRoutes = () => (
  <Suspense fallback={<div>로딩 중...</div>}>
    <Routes>
      <Route path="/" element={<ReportPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default ReportRoutes;
