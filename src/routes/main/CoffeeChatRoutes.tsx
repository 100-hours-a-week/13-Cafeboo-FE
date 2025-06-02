import { Routes, Route } from 'react-router-dom';
import CoffeeChatPage from '@/pages/coffeechat/CoffeeChatPage';
import NotFoundPage from '@/pages/common/NotFoundPage';

const CoffeeChatRoutes = () => (
  <Routes>
    <Route path="/" element={<CoffeeChatPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default CoffeeChatRoutes;