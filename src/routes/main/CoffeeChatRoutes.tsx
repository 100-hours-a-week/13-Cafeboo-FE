import { Routes, Route } from 'react-router-dom';
import CoffeeChatPage from '@/pages/coffeechat/CoffeeChatPage';
import CoffeeChatDetailPage from '@/pages/coffeechat/CoffeeChatDetailPage';
import GroupChatPage from '@/pages/coffeechat/GroupChatPage';
import NotFoundPage from '@/pages/common/NotFoundPage';

const CoffeeChatRoutes = () => (
  <Routes>
    <Route path="/" element={<CoffeeChatPage />} />
    <Route path=":id" element={<CoffeeChatDetailPage />} />
    <Route path=":id/chat" element={<GroupChatPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default CoffeeChatRoutes;