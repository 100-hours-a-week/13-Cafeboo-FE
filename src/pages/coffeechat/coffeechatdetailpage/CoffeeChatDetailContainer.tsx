import { useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useWebSocketStore } from '@/stores/webSocketStore';
import {
  useDeleteCoffeeChat,
  useCoffeeChatDetail,
} from "@/api/coffeechat/coffeechatApi";
import {
  useJoinCoffeeChat,
  useCoffeeChatMembership,
  useCoffeeChatMembers,
  useJoinCoffeeChatListener,
} from "@/api/coffeechat/coffeechatMemberApi";

import CoffeeChatDetailPageUI from "@/pages/coffeechat//coffeechatdetailpage/CoffeeChatDetailPageUI";

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
  handleJoinSubmit: (params: { chatNickname: string; profileType: "DEFAULT" | "USER" }) => void;
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

export default function CoffeeChatDetailContainer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertOpen2, setIsAlertOpen2] = useState(false);

  const { connect, disconnect, sendMessage } = useWebSocketStore();

  const { data, isLoading, isError, refetch } = useCoffeeChatDetail(id ?? "");
  const {
    mutateAsyncFn: joinCoffeeChat,
    isError: isJoinError,
    error: joinError,
  } = useJoinCoffeeChat(id ?? "");
  const {
    data: members,
    isLoading: isMembersLoading,
    isError: isMembersError,
    error: membersError,
    refetch: refetchMembers,
  } = useCoffeeChatMembers(id ?? "");
  const {
    data: membership,
    isLoading: isMembershipLoading,
    isError: isMembershipError,
    error: membershipError,
    refetch: refetchMembership,
  } = useCoffeeChatMembership(id ?? "");
  const {
    mutateAsyncFn: joinListener,
    isLoading: isListenerLoading,
    isError: isListenerError,
    error: listenerError,
  } = useJoinCoffeeChatListener(id ?? "");
  const { mutateAsyncFn: deleteChat } = useDeleteCoffeeChat();

  const showGoogleForm = id !== undefined && [39, 50, 51].includes(Number(id));

  const handleBackClick = () => {
    navigate('/coffeechat'); 
  };

  const handleJoinSubmit = async ({
    chatNickname,
    profileType,
  }: {
    chatNickname: string;
    profileType: "DEFAULT" | "USER";
  }) => {
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
        disconnect();
      });

      refetch();
      refetchMembers();

      setJoinModalOpen(false);
    } catch (error: any) {
      console.error(
        "커피챗 참여 오류:" + `${error.status}(${error.code}) - ${error.message}`
      );
      setAlertMessage(error.message || "커피챗 참여에 실패했습니다.");
      setJoinModalOpen(false);
      setIsAlertOpen(true);
    }
  };

  const handleEnterChatRoom = async () => {
    try {
      await joinListener();

      const { data: freshMembership } = await refetchMembership();
      const membershipData = freshMembership ?? membership;

      if (!membershipData?.isMember || !membershipData?.memberId) {
        console.log("참여자만 채팅방에 입장할 수 있습니다!");
        return;
      }

      navigate(`/coffeechat/${id}/chat`, {
        state: { memberId: membershipData.memberId },
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

  const handleDeleteChat = async () => {
    try {
      await deleteChat(id ?? "");
      setIsAlertOpen2(false);
      navigate("/coffeechat");
    } catch (err: any) {
      alert(err?.message || "삭제 중 오류가 발생했습니다.");
    }
  };

  
  const handleGoBackToCoffeeChat = () => {
    navigate("/coffeechat");
  };

  const handleJoin = () => setJoinModalOpen(true);
  const handleOpenSheet = () => setIsSheetOpen(true);
  const handleCloseSheet = () => setIsSheetOpen(false);
  const handleAlertClose = () => setIsAlertOpen(false);
  const handleAlert2Close = () => setIsAlertOpen2(false);
  const handleAlert2Open = () => setIsAlertOpen2(true);  

  const status: StatusProps = {
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
    showGoogleForm,
  };

  const handlers: HandlersProps = {
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
  };

  return <CoffeeChatDetailPageUI status={status} handlers={handlers} />;
}
