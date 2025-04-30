import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/main/HomePage';
import DiaryRoutes from './DiaryRoutes';
import ReportRoutes from './ReportRoutes';
import MypageRoutes from './MypageRoutes';

const MainRoutes = () => (
  <Routes>
    <Route path="home" element={<HomePage />} />
    <Route path="diary/*" element={<DiaryRoutes />} />
    <Route path="report/*" element={<ReportRoutes />} />
    <Route path="mypage/*" element={<MypageRoutes />} />
  </Routes>
);

export default MainRoutes;