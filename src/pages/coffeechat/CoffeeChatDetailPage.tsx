import { useState, useRef } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from "@/layout/PageLayout";
import { CalendarIcon, Clock, MapPin, User, Users, Hash } from "lucide-react";
import { IoChatbubblesOutline } from "react-icons/io5";
import Icon from '@/assets/cute_coffee_favicon_128.ico'
import MapBottomSheet from "@/components/coffeechat/MapBottomSheet";
import { useWebSocketStore } from '@/stores/webSocketStore';
import JoinCoffeeChatModal from "@/components/coffeechat/JoinCoffeeChatModal";
import { useCoffeeChatDetail } from "@/api/coffeechat/coffeechatApi";
import { useJoinCoffeeChat, useCoffeeChatMembership, useCoffeeChatMembers } from "@/api/coffeechat/coffeechatMemberApi";
import { useJoinCoffeeChatListener } from "@/api/coffeechat/coffeechatMemberApi";
import AlertModal from "@/components/common/AlertModal";
type JoinParams = { chatNickname: string; profileType: "DEFAULT" | "USER" };

export default function CoffeeChatDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { connect, disconnect, sendMessage } = useWebSocketStore();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const { data, isLoading, isError, refetch } = useCoffeeChatDetail(id ?? "");
  const { mutateAsyncFn: joinCoffeeChat, isError: isJoinError, error: joinError } = useJoinCoffeeChat(id ?? "");
  const { data: members, isLoading: isMembersLoading, isError: isMembersError, error: membersError, refetch: refetchMembers } = useCoffeeChatMembers(id ?? "");
  const { data: membership, isLoading: isMembershipLoading, isError: isMembershipError, error: membershipError, refetch: refetchMembership } = useCoffeeChatMembership(id ?? "");
  const { mutateAsyncFn: joinListener, isLoading: isListenerLoading, isError: isListenerError, error: listenerError } = useJoinCoffeeChatListener(id ?? "");

  const handleJoinSubmit = async ({ chatNickname, profileType }: JoinParams) => {
    try {
      const result = await joinCoffeeChat({ chatNickname, profileType });

      connect(id ?? "", () => {
        const payload = {
          senderId: result.memberId,
          coffeechatId: id,
          message: `${chatNickname}님이 입장했습니다`,
          type: "ENTER",
        };
      
        sendMessage(`/app/chatrooms/${id}`, payload);
      
        disconnect(); // 연결 종료
      });

      refetch();
      refetchMembers();

      setJoinModalOpen(false);
    } catch (error: any) {
      console.error("커피챗 참여 오류:" + `${error.status}(${error.code}) - ${error.message}`);
      setAlertMessage(error.message || "커피챗 참여 오류에 실패했습니다.");
      setJoinModalOpen(false);
      setIsAlertOpen(true);  
    }
  };

  // 채팅하기 버튼
  const handleEnterChatRoom = async () => {
    try {
      await joinListener();
 
      const { data: freshMembership } = await refetchMembership();
      const membershipData = freshMembership ?? membership;
  
      if (!membershipData?.isMember || !membershipData?.memberId) {
        console.log("참여자만 채팅방에 입장할 수 있습니다!");
        return;
      }
  
      navigate(`/main/coffeechat/${id}/chat`, {
        state: {
          memberId: membershipData.memberId,
        },
      });
    } catch (error: any) {
      alert(
        error?.message ||
          joinError?.message ||
          membershipError?.message ||
          "입장 중 오류가 발생했습니다."
      );
    }
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
    date,
    time,
    maxMemberCount,
    currentMemberCount,
    tags,
    location,
    writer,
  } = data;

  return (
    <PageLayout headerMode="title" headerTitle="커피챗" onBackClick={() => navigate('/main/coffeechat')} mainClassName="!pb-20">
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
          <div className="flex flex-wrap gap-2 mb-4 mt-2">
          {tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-xs text-xs font-medium"
            >
              <Hash className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
        )}

        {/* 설명 */}
        <div className="rounded-sm mb-4">
          <p className="text-[#333333] text-sm leading-relaxed" style={{ whiteSpace: "pre-line" }}>
            {content}
          </p>
        </div>

        <hr className="border-gray-200 my-4" />

        <div className="font-semibold leading-tight">정보</div>

        <div className="flex flex-col items-left space-y-1.5">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span>{date}</span>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{time}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{location?.address ?? "-"}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.open(location?.kakaoPlaceUrl, "_blank")}
                className="bg-gray-100 hover:bg-gray-200 text-black text-xs px-2 py-1 rounded-sm cursor-pointer"
              >
                정보 보기
              </button>

              <button
                onClick={() => setIsSheetOpen(true)}
                className="bg-gray-100 hover:bg-gray-200 text-black text-xs px-2 py-1 rounded-sm cursor-pointer"
              >
                지도 보기
              </button>
            </div>
          </div>
        </div>   
      </div>

      <hr className="border-gray-200 my-4" />

      <div className="font-semibold leading-tight">멤버</div>

      <ul className="space-y-3">
        {members?.members.map((member) => (
          <li key={member.memberId} className="flex items-center gap-3">
            {member.profileImageUrl ? (
              <img
                src={member.profileImageUrl}
                alt={member.chatNickname}
                className="w-8 h-8 rounded-full object-cover bg-gray-200"
              />
            ) : (
              <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-white rounded-full text-base">
                {member.chatNickname.slice(0, 1)}
              </div>
            )}
            <span className="text-sm text-black">{member.chatNickname}</span>
          </li>
        ))}
      </ul>

      {/* 하단 액션 */}
      <div className="absolute bottom-0 left-0 w-full flex px-6 py-3 bg-white border-t border-gray-300 z-30">
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

      <MapBottomSheet
        open={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        location={location} 
      />

      {/* 참여 모달 */}
      <JoinCoffeeChatModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onSubmit={handleJoinSubmit}
      />
      <AlertModal
        isOpen={isAlertOpen}
        title="알림"
        message={alertMessage}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={() => setIsAlertOpen(false)}
        confirmText="확인"
        showCancelButton={false}
      />
    </PageLayout>
  );
}

  