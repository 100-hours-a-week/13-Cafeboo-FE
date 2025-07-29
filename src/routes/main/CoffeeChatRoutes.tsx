import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const CoffeeChatPage = lazy(() => import('@/pages/coffeechat/coffeechatpage'));
const CoffeeChatDetailPage = lazy(() => import('@/pages/coffeechat/coffeechatdetailpage'));
const GroupChatPage = lazy(() => import('@/pages/coffeechat/groupchatpage'));
const CoffeeChatReviewPage = lazy(() => import('@/pages/coffeechat/coffeechatreviewpage'));
const NotFoundPage = lazy(() => import('@/pages/common/NotFoundPage'));

const CoffeeChatRoutes = () => (
  <Suspense fallback={<div>로딩 중...</div>}>
    <Routes>
      <Route path="/" element={<CoffeeChatPage />} />
      <Route path=":id" element={<CoffeeChatDetailPage />} />
      <Route path=":id/chat" element={<GroupChatPage />} />
      <Route path=":id/review" element={<CoffeeChatReviewPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default CoffeeChatRoutes;