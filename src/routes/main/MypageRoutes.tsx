import { Routes, Route } from 'react-router-dom';
import MyPagePage from '@/pages/mypage/MypagePage';
import MyPageEditPage from '@/pages/mypage/MypageEditPage';
import NotFoundPage from '@/pages/common/NotFoundPage';

const MypageRoutes = () => (
  <Routes>
    <Route path="/" element={<MyPagePage />} />
    <Route path="edit" element={<MyPageEditPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default MypageRoutes;
