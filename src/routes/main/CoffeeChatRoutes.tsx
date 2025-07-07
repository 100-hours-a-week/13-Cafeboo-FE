import { Routes, Route } from 'react-router-dom';
import CoffeeChatPage from '@/pages/coffeechat/coffeechatpage';
import CoffeeChatDetailPage from '@/pages/coffeechat/coffeechatdetailpage';
import GroupChatPage from '@/pages/coffeechat/groupchatpage';
import CoffeeChatReviewPage from '@/pages/coffeechat/coffeechatreviewpage';
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