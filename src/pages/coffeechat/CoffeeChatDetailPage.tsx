import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "@/components/common/Header";

export default function CoffeeChatDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [joined, setJoined] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
  
    const handleJoin = () => setModalOpen(true);
  
    const confirmJoin = () => {
      setJoined(true);
      setModalOpen(false);
    };
  
    return (
      <div className="p-4">
        <Header mode="title" title="커피챗" />
        <h2 className="text-lg font-bold mt-4">아메리카노 마실 사람?</h2>
        <p className="text-sm text-gray-600 mt-1">1/4 · 오후 12:15 · 분당구 판교동</p>
  
        <p className="mt-4 text-sm leading-relaxed">
          오늘 판교에서 오후 12:15부터 30분간 스타벅스에서 아메리카노 마시며 얘기할 사람 구합니다!
        </p>
  
        <button className="w-full mt-6 p-3 bg-gray-100 rounded-md" onClick={() => {}}>
          위치 보기 &gt;
        </button>
  
        {joined ? (
          <button
            className="w-full mt-4 p-3 bg-blue-600 text-white rounded-md"
            onClick={() => navigate(`/coffeechats/${id}/chat`)}
          >
            채팅하기
          </button>
        ) : (
          <button
            className="w-full mt-4 p-3 bg-[#1C274C] text-white rounded-md"
            onClick={handleJoin}
          >
            커피챗 참여하기
          </button>
        )}
  
        {modalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-5 rounded-md shadow-md w-80">
              <h3 className="text-base font-semibold mb-2">커피챗 참여</h3>
              <p className="text-sm mb-4">해당 커피챗에 참여하시겠습니까?</p>
              <div className="flex justify-end gap-2">
                <button
                  className="text-blue-500 px-3 py-1"
                  onClick={() => setModalOpen(false)}
                >
                  아니요
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={confirmJoin}
                >
                  예
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  