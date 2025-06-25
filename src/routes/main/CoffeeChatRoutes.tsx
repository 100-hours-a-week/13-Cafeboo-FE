import { Routes, Route } from 'react-router-dom';
import CoffeeChatPage from '@/pages/coffeechat/CoffeeChatPage';
import CoffeeChatDetailPage from '@/pages/coffeechat/CoffeeChatDetailPage';
import GroupChatPage from '@/pages/coffeechat/GroupChatPage';
import CoffeeChatReviewPage from '@/pages/coffeechat/CoffeeChatReviewPage';
import NotFoundPage from '@/pages/common/NotFoundPage';

const CoffeeChatRoutes = () => (
  <Routes>
    <Route path="/" element={<CoffeeChatPage />} />
    <Route path=":id" element={<CoffeeChatDetailPage />} />
    <Route path=":id/chat" element={<GroupChatPage />} />
    <Route path=":id/review" element={<CoffeeChatReviewPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default CoffeeChatRoutes;