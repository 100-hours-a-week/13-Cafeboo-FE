import { FaArrowUp } from "react-icons/fa6";
import { ChevronLeft } from "lucide-react";
import ChatMessages from "@/components/coffeechat/ChatMessages";
import RetryButton from "@/components/coffeechat/RetryButton";
import PageLayout from "@/layout/PageLayout";

interface StatusProps {
  coffeechatId?: string;
  memberId?: string;
  connectionStatus: "connecting" | "connected" | "disconnected";
  realtimeMessages: any[];
  input: string;
  inputHeight: number;
  error: any;
  members?: any;
  membership?: any;
}

interface HandlersProps {
  handleBackClick: () => void;
  setMemberId: (id: string | undefined) => void;
  setInput: (input: string) => void;
  setInputHeight: (height: number) => void;
  handleSendMessage: () => void;
  handleLeaveChat: () => void;
  handleDeleteChat: () => void;
  retryConnect: () => void;
}

interface Props {
  status: StatusProps;
  handlers: HandlersProps;
}

export default function GroupChatPageUI({ status, handlers }: Props) {
  const {
    coffeechatId,
    memberId,
    connectionStatus,
    realtimeMessages,
    input,
    inputHeight,
    error,
    members,
    membership,
  } = status;

  const {
    setInput,
    setInputHeight,
    handleSendMessage,
    handleLeaveChat,
    handleDeleteChat,
    retryConnect,
    handleBackClick,
  } = handlers;

  return (
    <>
      {error && (
        <>
          <div className="absolute top-0 left-0 w-full bg-blue-500 opacity-95 text-white text-sm py-2 px-4 z-100 flex justify-between items-center">
            <span>웹소켓 연결 상태를 확인 후 다시 시도해주세요</span>
            <RetryButton onRetry={retryConnect} />
          </div>
          <div className="absolute bottom-16 left-8 w-full flex z-100">
            <button
              onClick={handleBackClick}
              className="pl-2 pr-3 py-1 bg-white text-gray-500 border border-gray-300 text-sm rounded-full shadow hover:bg-gray-100 transition-all"
            >
              <div className="flex items-center">
                <ChevronLeft className="w-3 h-3 mr-1" />
                뒤로가기
              </div>
            </button>
          </div>
        </>
      )}

      <PageLayout
        headerMode="title"
        headerTitle="그룹 채팅방"
        onBackClick={handleBackClick}
        isGroupChat={true}
        chatMembers={members?.members ?? []}
        onLeaveChat={handleLeaveChat}
        onDeleteChat={handleDeleteChat}
        myMemberId={memberId ?? ""}
        nonScrollClassName={true}
        mainClassName="h-[calc(100dvh-4rem)]"
      >
        <div className="flex-1 h-full relative">
          <div className="absolute inset-0 top-0 bottom-14 p-2 bg-gray-50">
            {coffeechatId && memberId && (
              <ChatMessages
                coffeeChatId={coffeechatId}
                memberId={memberId}
                realtimeMessages={realtimeMessages}
              />
            )}
          </div>

          <div className="absolute bottom-0 left-0 w-full h-auto bg-white px-1 py-2 z-10">
            <div className="flex items-end max-w-xl mx-auto">
              <textarea
                rows={1}
                value={input}
                placeholder="메시지를 입력하세요"
                className="flex-grow min-w-0 resize-none border border-gray-300 px-4 py-2 focus:outline-none focus:border-[#FE9400] transition-all duration-100 overflow-y-auto rounded-3xl scrollbar-hide"
                style={{ height: inputHeight }}
                onChange={(e) => {
                  setInput(e.target.value);
                  const textarea = e.target;
                  textarea.style.height = "auto";
                  const scrollHeight = textarea.scrollHeight;
                  const maxHeight = 60;
                  const newHeight = Math.min(scrollHeight, maxHeight);
                  textarea.style.height = `${newHeight}px`;
                  setInputHeight(newHeight);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    !e.shiftKey &&
                    !e.nativeEvent.isComposing &&
                    input.trim()
                  ) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />

              <div
                onClick={handleSendMessage}
                className="ml-2 shrink-0 w-10 h-10 bg-[#FE9400] text-white flex items-center justify-center rounded-full hover:bg-[#FE9400]/80 cursor-pointer"
              >
                <FaArrowUp className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
}
