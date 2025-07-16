import { Routes, Route } from 'react-router-dom';
import DiaryPage from '@/pages/diary/diarypage';
import DiaryEditPage from '@/pages/diary/diaryeditpage';
import NotFoundPage from '@/pages/common/NotFoundPage';

const DiaryRoutes = () => (
  <Routes>
    <Route path="/" element={<DiaryPage />} />
    <Route path="edit/:intakeId" element={<DiaryEditPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default DiaryRoutes;
