import { useState} from "react";
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from "@/layout/PageLayout";
import { MapPin, Users } from "lucide-react";
import AlertModal from "@/components/common/AlertModal";
import { IoChatbubblesOutline } from "react-icons/io5";
import Icon from '@/assets/cute_coffee_favicon_128.ico'
import MapBottomSheet from "@/components/coffeechat/MapBottomSheet";
import { useWebSocketStore } from '@/stores/webSocketStore';

export default function CoffeeChatDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [joined, setJoined] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { connect: connectWebSocket } = useWebSocketStore();

  const handleJoin = () => setModalOpen(true);

  const confirmJoin = () => {
    setJoined(true);
    setModalOpen(false);
  };

  return (
    <PageLayout headerMode="title" headerTitle="커피챗" onBackClick={() => navigate('/main/coffeechat')}>
        {/* Main Content Card */}
        <div className="bg-white space-y-4">
          {/* Title and Status */}
          {joined ? (
              <div className="inline-flex items-center bg-[#CCF1E1] text-green-700 px-2 py-1 rounded-xs text-xs font-semibold mb-2">
                참여 중
              </div>
            ) : (
              <div className="inline-flex items-center bg-[#FE9400]/10 text-amber-600 px-2 py-1 rounded-xs text-xs font-semibold mb-2">
                모집 중
              </div>
            )}
          
          <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg leading-tight">
                 아메리카노 마실 사람?
              </h3>
              <div className="flex items-center bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium ml-4 shrink-0">
                <Users className="w-4 h-4 mr-1" />
                 1/4
              </div>
            </div>

          {/* Tags */}
          <div className="flex gap-2 mb-4">
            <span className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-xs text-xs font-medium">
              # 커피챗
            </span>
            <span className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-xs text-xs font-medium">
              # 네트워킹
            </span>
          </div>

          {/* Description */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <p className="text-[#333333] leading-relaxed">
              오늘 판교에서 오후 12:15부터 30분간 스타벅스에서 아메리카노 마시며 얘기할 사람 구합니다!
            </p>
          </div>

          <hr className="border-gray-200 my-4" />

          <div className="font-semibold leading-tight">
             정보
          </div>
    
          {/* User Info */}
          <div className="flex items-center gap-2 mb-2 text-sm">
            <div className="text-[#838a97] w-15">
              방장
            </div>
            <span>user</span>
          </div>

          {/* Time and Location */}
  
          <div className="flex items-center gap-2 mb-2 text-sm">
            <div className="text-[#838a97] w-15">
              시각
            </div>
            <span>오후 12:15</span>
          </div>

          <div className="flex items-center gap-2 mb-2 text-sm">
            <div className="text-[#838a97] w-15">
              모집인원
            </div>
            <span>4명</span>
          </div>

          <hr className="border-gray-200 my-4" />

          {/* Location Card */}
          <div className="font-semibold leading-tight">
              위치
          </div>

          <div className="flex items-center space-x-1 text-gray-800 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>분당구 판교동</span>
          </div>

            <button 
              onClick={() => setIsSheetOpen(true)}
              className="w-full p-6 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors rounded-xl"
            >
              <div className="w-full h-[180px] overflow-hidden rounded-lg mb-2">
              <img
                  src={`https://map.kakao.com/staticmap/v5/map?center=127.110987,37.401234&level=3&width=700&height=300&apikey=${import.meta.env.VITE_KAKAO_REST_API_KEY}`}
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



        {/* Action Button */}
        <div className="absolute bottom-0 left-0 w-full flex px-6 py-3 bg-white border-t border-gray-300 z-50">
          <img src={Icon} alt="Cafeboo" className="h-12 w-auto mr-4 rounded-lg bg-[#FEF0D7]"/>
          {joined ? (
            <button
              onClick={() => navigate(`/main/coffeechat/${id}/chat`)}
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
      {/* Modal */}
      <AlertModal
          isOpen={modalOpen}
          title="참여 신청"
          message="해당 커피챗에 참여하시시겠습니까?"
          onClose={() => setModalOpen(false)}
          onConfirm={() => confirmJoin()}
          onCancel={() => setModalOpen(false)}
          confirmText="참여"
          cancelText="취소"
          showCancelButton={true}
          />
      </PageLayout>
  );
}
  