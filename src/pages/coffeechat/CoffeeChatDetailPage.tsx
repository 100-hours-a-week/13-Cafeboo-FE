import { useState, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from "@/layout/PageLayout";
import { MapPin, Users } from "lucide-react";
import { IoChatbubblesOutline } from "react-icons/io5";
import Icon from '@/assets/cute_coffee_favicon_128.ico'
import MapBottomSheet from "@/components/coffeechat/MapBottomSheet";
import { useWebSocketStore } from '@/stores/webSocketStore';
import JoinCoffeeChatModal from "@/components/coffeechat/JoinCoffeeChatModal";
import { useCoffeeChatDetail } from "@/api/coffeechat/coffeechatApi";
import { useJoinCoffeeChat } from "@/api/coffeechat/coffeechatMemberApi";

type JoinParams = { chatNickname: string; profileType: "DEFAULT" | "USER" };

export default function CoffeeChatDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { connect, disconnect, sendMessage } = useWebSocketStore();

  const { data, isLoading, isError, refetch } = useCoffeeChatDetail(id ?? "");
  const { mutateAsyncFn: joinCoffeeChat, isError: isJoinError, error: joinError } = useJoinCoffeeChat(id ?? "");

  // 참여 성공 후 memberId/chatNickname 임시 저장용
  const memberIdRef = useRef<string | null>(null);
  const chatNicknameRef = useRef<string | null>(null);

  const handleJoinSubmit = async ({ chatNickname, profileType }: JoinParams) => {
    try {
      const result = await joinCoffeeChat({ chatNickname, profileType });

      // 1. 참여한 memberId, 닉네임 저장
      memberIdRef.current = result.memberId;
      chatNicknameRef.current = chatNickname;

      // 2. 웹소켓 연결
      connect(id ?? "");

      // 3. 입장 메시지 전송
      sendMessage("/app/chat.sendMessage", {
        senderId: result.memberId,
        coffeechatId: id,
        message: `${chatNickname}님이 입장했습니다`,
        messageType: "JOIN",
        chatNickname,
      });

      // 4. 바로 해제
      disconnect();

      // 5. refetch로 데이터 갱신
      refetch();

      setJoinModalOpen(false);
    } catch (error: any) {
      console.error("커피챗 참여 오류:" + `${error.status}(${error.code}) - ${error.message}`);
      setJoinModalOpen(false);
    }
  };

  // 채팅하기 버튼
  const handleEnterChatRoom = () => {
    navigate(`/main/coffeechat/${id}/chat`, {
      state: {
        memberId: memberIdRef.current,
        chatNickname: chatNicknameRef.current,
      },
    });
  };

  const handleJoin = () => setJoinModalOpen(true);
  
  if (isLoading) return <PageLayout><div className="py-24 text-center">로딩 중...</div></PageLayout>;
  if (isError || !data) return <PageLayout><div className="py-24 text-center text-red-400">데이터를 불러올 수 없습니다.</div></PageLayout>;

  let badge;
  if (data.isJoined) {
    badge = (
      <div className="inline-flex items-center bg-[#CCF1E1] text-green-800 px-2 py-1 rounded-xs text-xs font-semibold">
        참여 중
      </div>
    );
  } else if (data.currentMemberCount === data.maxMemberCount) {
    badge = (
      <div className="inline-flex items-center bg-purple-100 text-purple-900 px-2 py-1 rounded-xs text-xs font-semibold">
        모집 완료
      </div>
    );
  } else {
    badge = (
      <div className="inline-flex items-center bg-[#FE9400]/10 text-amber-600 px-2 py-1 rounded-xs text-xs font-semibold">
        모집 중
      </div>
    );
  }

  const {
    title,
    content,
    time,
    maxMemberCount,
    currentMemberCount,
    tags,
    location,
    writer,
  } = data;

  return (
    <PageLayout headerMode="title" headerTitle="커피챗" onBackClick={() => navigate('/main/coffeechat')}>
      <div className="bg-white space-y-4">
        <div className="flex items-center justify-between mb-2">
          <div>{badge}</div>

          {/* 인원수 */}
          <div className="flex items-center text-gray-800 px-2 py-1 rounded-full text-sm font-medium ml-4 shrink-0">
            <Users className="w-4 h-4 mr-1" />
            {currentMemberCount} / {maxMemberCount}
          </div>
        </div>

        {/* 제목 */}
        <h3 className="font-semibold text-lg leading-tight mb-2">{title}</h3>

        {/* 태그 */}
        {tags?.length > 0 && (
          <div className="flex gap-2 mb-4">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-xs text-xs font-medium"
              >
                # {tag}
              </span>
            ))}
          </div>
        )}

        {/* 설명 */}
        <div className="bg-gray-50 rounded-sm p-4 mb-4">
          <p className="text-[#333333] text-sm leading-relaxed" style={{ whiteSpace: "pre-line" }}>
            {content}
          </p>
        </div>

        <hr className="border-gray-200 my-4" />

        <div className="font-semibold leading-tight">정보</div>
        {/* 방장 */}
        <div className="flex items-center gap-2 mb-2 text-sm">
          <div className="text-[#838a97] w-15">방장</div>
          <span>{writer?.chatNickname ?? "-"}</span>
        </div>
        {/* 시각 */}
        <div className="flex items-center gap-2 mb-2 text-sm">
          <div className="text-[#838a97] w-15">시각</div>
          <span>{time}</span>
        </div>
        {/* 모집인원 */}
        <div className="flex items-center gap-2 mb-2 text-sm">
          <div className="text-[#838a97] w-15">모집 인원</div>
          <span>{maxMemberCount}명</span>
        </div>

        <hr className="border-gray-200 my-4" />

        {/* 위치 */}
        <div className="font-semibold leading-tight">위치</div>
        <div className="flex items-center space-x-1 text-gray-800 text-sm">
          <MapPin className="w-4 h-4" />
          <span>{location?.address ?? "-"}</span>
        </div>
        <button 
          onClick={() => setIsSheetOpen(true)}
          className="w-full p-6 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors rounded-xl"
        >
          <div className="w-full h-[80px] overflow-hidden rounded-lg mb-2">
            <img
              src={`https://map.kakao.com/staticmap/v5/map?center=${location.longitude},${location.latitude}&level=3&width=700&height=300&apikey=${import.meta.env.VITE_KAKAO_REST_API_KEY}`}
              alt="지도 미리보기"
              className="w-full h-full object-cover"
            />
          </div>
        </button>
      </div>

      <MapBottomSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
      />

      {/* 하단 액션 */}
      <div className="absolute bottom-0 left-0 w-full flex px-6 py-3 bg-white border-t border-gray-300 z-50">
        <img src={Icon} alt="Cafeboo" className="h-12 w-auto mr-4 rounded-lg bg-[#FEF0D7]" />
        {data.isJoined ? (
          <button
            onClick={handleEnterChatRoom}
            className="flex justify-center items-center w-full py-3 bg-[#FE9400] text-white rounded-lg font-semibold cursor-pointer"
          >
            <IoChatbubblesOutline className="w-5 h-5 mr-2" />
            채팅하기
          </button>
        ) : (
          <button
            onClick={handleJoin}
            className="w-full py-3 bg-[#FE9400] text-white rounded-lg font-semibold cursor-pointer"
          >
            커피챗 참여하기
          </button>
        )}
      </div>

      {/* 참여 모달 */}
      <JoinCoffeeChatModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onSubmit={handleJoinSubmit}
      />
    </PageLayout>
  );
}

  