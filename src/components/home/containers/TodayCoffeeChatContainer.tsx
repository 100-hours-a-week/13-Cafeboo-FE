import TodayCoffeeChatSection from '@/components/home/TodayCoffeeChat';
import { useCoffeeChatList } from '@/api/coffeechat/coffeechatListApi';
import { useAuthStore } from '@/stores/useAuthStore';
import { useState } from 'react';

export default function TodayCoffeeChatContainer() {
  const { data } = useCoffeeChatList("ALL");
  const rooms = data?.coffeechats?.slice(0, 5) ?? [];
  const isGuest = useAuthStore(state => state.isGuest());
  const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);
  const handleLoginAlertOpen = () => setIsLoginAlertOpen(true);
  const handleLoginAlertClose = () => setIsLoginAlertOpen(false);

    return (
      <TodayCoffeeChatSection
        rooms={rooms}
        isGuest={isGuest}
        isLoginAlertOpen={isLoginAlertOpen}
        onLoginAlertOpen={handleLoginAlertOpen}
        onLoginAlertClose={handleLoginAlertClose}
      />
    );
}
