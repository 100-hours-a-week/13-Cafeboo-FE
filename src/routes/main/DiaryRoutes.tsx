import { Routes, Route } from 'react-router-dom';
import DiaryPage from '@/pages/main/diary/DiaryPage';
import DiaryEditPage from '@/pages/main/diary/DiaryEditPage';

const DiaryRoutes = () => (
  <Routes>
    <Route path="/" element={<DiaryPage />} />
    <Route path="edit/:intakeId" element={<DiaryEditPage />} />
  </Routes>
);

export default DiaryRoutes;