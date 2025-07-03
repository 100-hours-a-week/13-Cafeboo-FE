import { Routes, Route } from 'react-router-dom';
import ReportPage from '@/pages/report';
import NotFoundPage from '@/pages/common/NotFoundPage';

const ReportRoutes = () => (
  <Routes>
    <Route path="/" element={<ReportPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default ReportRoutes;
