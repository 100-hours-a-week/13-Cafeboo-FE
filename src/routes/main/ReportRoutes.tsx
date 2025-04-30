import { Routes, Route } from 'react-router-dom';
import ReportPage from '@/pages/main/report/ReportPage';

const ReportRoutes = () => (
  <Routes>
    <Route path="/" element={<ReportPage />} />
  </Routes>
);

export default ReportRoutes;