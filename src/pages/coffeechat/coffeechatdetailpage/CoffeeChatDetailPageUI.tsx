import PageLayout from "@/layout/PageLayout";
import { CalendarIcon, Clock, MapPin, Users, Hash } from "lucide-react";
import { IoChatbubblesOutline } from "react-icons/io5";
import TrashCanIcon from '@/assets/TrashCan4.png';
import CoffeeChat from '@/assets/CoffeeChatIcon.png';
import MapBottomSheet from "@/components/coffeechat/MapBottomSheet";
import JoinCoffeeChatModal from "@/components/coffeechat/JoinCoffeeChatModal";
import AlertModal from "@/components/common/AlertModal";
import GoogleFormLink from "@/components/event/GoogleFormLinkButton";

interface Member {
  memberId: string;
  chatNickname: string;
  profileImageUrl: string;
  isHost: boolean;
}

interface MembersResponse {
  members: Member[];
}

interface StatusProps {
  id?: string;
  data?: any;
  isLoading: boolean;
  isError: boolean;
  members?: MembersResponse;
  isMembersLoading: boolean;
  isMembersError: boolean;
  membership?: any;
  isMembershipLoading: boolean;
  isMembershipError: boolean;
  joinModalOpen: boolean;
  isSheetOpen: boolean;
  isAlertOpen: boolean;
  alertMessage: string;
  isAlertOpen2: boolean;
  showGoogleForm: boolean;
}

interface HandlersProps {
  handleBackClick: () => void;
  handleJoinSubmit: (params: { chatNickname: string; profileImageType: "DEFAULT" | "USER" }) => void;
  handleEnterChatRoom: () => void;
  handleDeleteChat: () => void;
  handleJoin: () => void;
  setJoinModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpenSheet: () => void;
  handleCloseSheet: () => void;
  handleAlertClose: () => void;
  handleAlert2Close: () => void;
  handleAlert2Open: () => void; 
  handleGoBackToCoffeeChat: () => void;
}

interface Props {
  status: StatusProps;
  handlers: HandlersProps;
}

export default function CoffeeChatDetailPageUI({ status, handlers }: Props) {
  const {
    id,
    data,
    isLoading,
    isError,
    members,
    isMembersLoading,
    isMembersError,
    membership,
    isMembershipLoading,
    isMembershipError,
    joinModalOpen,
    isSheetOpen,
    isAlertOpen,
    alertMessage,
    isAlertOpen2,
    showGoogleForm=false,
  } = status;

  const {
    handleBackClick,
    handleJoinSubmit,
    handleEnterChatRoom,
    handleDeleteChat,
    handleJoin,
    setJoinModalOpen,
    handleOpenSheet,
    handleCloseSheet,
    handleAlertClose,
    handleAlert2Close,
    handleAlert2Open,
    handleGoBackToCoffeeChat,
  } = handlers;

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
    <PageLayout headerMode="title" headerTitle="커피챗" onBackClick={handleBackClick} mainClassName="pt-2 pb-16">
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

        {showGoogleForm ? (
          <GoogleFormLink/>
        ) : null}

        <hr className="border-gray-200 my-4" />

        <div className="font-semibold leading-tight">정보</div>

        <div className="flex flex-col items-left space-y-1.5">
          <div className="flex items-center space-x-3">
            <CalendarIcon className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{date}</span>
          </div>

          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-gray-500" />
            <span className="text-sm">{time}</span>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{location?.address ?? "-"}</span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => window.open(location?.kakaoPlaceUrl, "_blank")}
                className="bg-gray-100 hover:bg-gray-200 text-black text-xs px-2 py-1 rounded-sm cursor-pointer"
              >
                정보 보기
              </button>

              <button
                onClick={handleOpenSheet}
                className="bg-gray-100 hover:bg-gray-200 text-black text-xs px-2 py-1 rounded-sm cursor-pointer"
              >
                지도 보기
              </button>
            </div>
          </div>
        </div>

        <hr className="border-gray-200 my-4" />

        {/* 멤버 리스트 */}
        <div className="font-semibold leading-tight">멤버</div>

        <ul className="space-y-3">
          {members?.members.map((member) => (
            <li key={member.memberId} className="flex items-center gap-3">
              {member.profileImageUrl ? (
                <img
                  src={member.profileImageUrl}
                  alt={member.chatNickname}
                  width={1000}
                  height={1000}
                  className="w-8 h-8 rounded-full object-cover bg-gray-200"
                  loading="lazy"
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

        {/* 하단 액션 버튼들 */}
        <div className="absolute bottom-0 left-0 w-full flex px-6 py-3 bg-white border-t border-gray-300 z-10 h-18 items-center">
          {writer.memberId === membership?.memberId ? (
            <img
              src={TrashCanIcon}
              alt="삭제"
              width={1024}
              height={1024}
              className="h-11 w-auto mr-4 cursor-pointer"
              onClick={handleAlert2Open} 
            />
          ) : (
            <img
              src={CoffeeChat}
              alt="커피챗"
              width={952}
              height={953}
              className="h-11 w-auto mr-4 cursor-pointer"
              onClick={handleGoBackToCoffeeChat}
            />
          )}
          {data.isJoined ? (
            <button
              onClick={handleEnterChatRoom}
              className="flex justify-center items-center w-full py-3 bg-[#FE9400] text-white rounded-lg font-semibold cursor-pointer"
            >
              <IoChatbubblesOutline className="w-5 h-5 mr-2" />
              채팅하기
            </button>
          ) : currentMemberCount === maxMemberCount ? (
            <button
              disabled
              className="w-full py-3 bg-gray-200 text-gray-400 rounded-lg font-semibold"
            >
              모집이 완료되었습니다
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
      </div>

      {/* 모달들 - PageLayout 내부로 이동 */}
      <MapBottomSheet
        open={isSheetOpen}
        onClose={handleCloseSheet}
        location={location}
      />

      <JoinCoffeeChatModal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        onSubmit={handleJoinSubmit}
      />

      <AlertModal
        isOpen={isAlertOpen}
        title="알림"
        message={alertMessage}
        onClose={handleAlertClose}
        onConfirm={handleAlertClose}
        confirmText="확인"
        showCancelButton={false}
      />

      <AlertModal
        isOpen={isAlertOpen2}
        title="커피챗을 삭제하시겠습니까?"
        message="채팅 내역이 모두 삭제됩니다"
        onClose={handleAlert2Close}
        onConfirm={handleDeleteChat}
        onCancel={handleAlert2Close}
        confirmText="삭제"
        cancelText="취소"
        showCancelButton={true}
      />
    </PageLayout>
  );
}

