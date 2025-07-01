import TodayCoffeeChatSection from '@/components/home/TodayCoffeeChat';
import { useCoffeeChatList } from '@/api/coffeechat/coffeechatListApi';

export default function TodayCoffeeChatContainer() {
  const { data } = useCoffeeChatList("ALL");
  const rooms = data?.coffeechats?.slice(0, 5) ?? [];

  return <TodayCoffeeChatSection rooms={rooms} />;
}
