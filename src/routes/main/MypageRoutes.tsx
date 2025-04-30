import { Routes, Route } from 'react-router-dom';
import MypagePage from '@/pages/main/mypage/MypagePage';
import MypageEditPage from '@/pages/main/mypage/MypageEditPage';

const MypageRoutes = () => (
  <Routes>
    <Route path="/" element={<MypagePage />} />
    <Route path="edit" element={<MypageEditPage />} />
  </Routes>
);

export default MypageRoutes;