import TodayCoffeeChatSection from '@/components/home/TodayCoffeeChat';
import EventCoffeeChat from '@/components/home/EventCoffeeChat';
import { useCoffeeChatList } from '@/api/coffeechat/coffeechatListApi';
import { useAuthStore } from '@/stores/useAuthStore';
import { useState } from 'react';

export default function TodayCoffeeChatContainer() {
  const { data } = useCoffeeChatList('ALL');
  const allRooms = data?.coffeechats ?? [];

  const isGuest = useAuthStore((state) => state.isGuest());
  const [isLoginAlertOpen, setIsLoginAlertOpen] = useState(false);

  const handleLoginAlertOpen = () => setIsLoginAlertOpen(true);
  const handleLoginAlertClose = () => setIsLoginAlertOpen(false);

  // 🔹 이벤트용 ID 목록
  const eventIds = new Set(['49', '50', '51']);

  const eventRooms = allRooms.filter((room) => eventIds.has(room.coffeeChatId));
  const todayRooms = allRooms
    .filter((room) => !eventIds.has(room.coffeeChatId))
    .slice(0, 5);

  return (
    <>
      {eventRooms.length > 0 && (
        <EventCoffeeChat
          rooms={eventRooms}
          isGuest={isGuest}
          isLoginAlertOpen={isLoginAlertOpen}
          onLoginAlertOpen={handleLoginAlertOpen}
          onLoginAlertClose={handleLoginAlertClose}
        />
      )}

      <TodayCoffeeChatSection
        rooms={todayRooms}
        isGuest={isGuest}
        isLoginAlertOpen={isLoginAlertOpen}
        onLoginAlertOpen={handleLoginAlertOpen}
        onLoginAlertClose={handleLoginAlertClose}
      />
    </>
  );
}
