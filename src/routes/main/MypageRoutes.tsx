import { Routes, Route } from 'react-router-dom';
import MyPage from '@/pages/mypage/MyPage';
import MyEditPage from '@/pages/mypage/MyEditPage';
import NotFoundPage from '@/pages/common/NotFoundPage';

const MypageRoutes = () => (
  <Routes>
    <Route path="/" element={<MyPage />} />
    <Route path="edit" element={<MyEditPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default MypageRoutes;
