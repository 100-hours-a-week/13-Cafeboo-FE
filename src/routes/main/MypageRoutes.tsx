import { Routes, Route } from 'react-router-dom';
import MypagePage from '@/pages/mypage/MypagePage';
import MypageEditPage from '@/pages/mypage/MypageEditPage';
import NotFoundPage from '@/pages/common/NotFoundPage';

const MypageRoutes = () => (
  <Routes>
    <Route path="/" element={<MypagePage />} />
    <Route path="edit" element={<MypageEditPage />} />
    <Route path="*" element={<NotFoundPage />} /> 
  </Routes>
);

export default MypageRoutes;