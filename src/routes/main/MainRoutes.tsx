import { Routes, Route } from 'react-router-dom';
import DiaryRoutes from './DiaryRoutes';
import ReportRoutes from './ReportRoutes';
import MypageRoutes from './MypageRoutes';
import CoffeeChatRoutes from './CoffeeChatRoutes';
import EventPage from '@/pages/common/EventPage';
import NotFoundPage from '@/pages/common/NotFoundPage';

const MainRoutes = () => (
  <Routes>
    <Route path='event/*' element={<EventPage />} />
    <Route path="diary/*" element={<DiaryRoutes />} />
    <Route path="report/*" element={<ReportRoutes />} />
    <Route path="mypage/*" element={<MypageRoutes />} />
    <Route path="coffeechat/*" element={<CoffeeChatRoutes />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default MainRoutes;
