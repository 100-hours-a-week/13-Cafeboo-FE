import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const DiaryPage = lazy(() => import('@/pages/diary/diarypage'));
const DiaryEditPage = lazy(() => import('@/pages/diary/diaryeditpage'));
const NotFoundPage = lazy(() => import('@/pages/common/NotFoundPage'));

const DiaryRoutes = () => (
  <Suspense fallback={<div>로딩 중...</div>}>
    <Routes>
      <Route path="/" element={<DiaryPage />} />
      <Route path="edit/:intakeId" element={<DiaryEditPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default DiaryRoutes;
