import { Routes, Route } from 'react-router-dom';
import MypagePage from '@/pages/main/mypage/MypagePage';
import MypageEditPage from '@/pages/main/mypage/MypageEditPage';
import NotFoundPage from '@/pages/common/NotFoundPage';

const MypageRoutes = () => (
  <Routes>
    <Route path="/" element={<MypagePage />} />
    <Route path="edit" element={<MypageEditPage />} />
    <Route path="*" element={<NotFoundPage />} /> 
  </Routes>
);

export default MypageRoutes;