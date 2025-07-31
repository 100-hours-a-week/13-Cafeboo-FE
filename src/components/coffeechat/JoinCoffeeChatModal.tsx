import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { limitLength } from '@/utils/inputUtils';

interface JoinCoffeeChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: {
    chatNickname: string;
    profileImageType: 'DEFAULT' | 'USER';
  }) => void;
  defaultprofileImageType?: 'DEFAULT' | 'USER';
}

export default function JoinCoffeeChatModal({
  isOpen,
  onClose,
  onSubmit,
  defaultprofileImageType = 'DEFAULT',
}: JoinCoffeeChatModalProps) {
  const [chatNickname, setChatNickname] = useState('');
  const [profileImageType, setProfileImageType] = useState<'DEFAULT' | 'USER'>(
    defaultprofileImageType
  );
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const appRoot = document.getElementById('alert-modal-container');
    if (!appRoot) return;
    let el = appRoot.querySelector<HTMLDivElement>('#modal-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-container';
      appRoot.appendChild(el);
    }
    setContainer(el);
    return () => {};
  }, []);

  const handleConfirm = () => {
    if (chatNickname.trim().length === 0) return;
    onSubmit({ chatNickname, profileImageType });
    onClose();
  };

  if (!isOpen || !container) return null;

  const modal = (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-white rounded-lg shadow-lg w-10/12 max-w-xs mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col p-6 gap-4">
          <h2 className="text-lg font-semibold text-gray-800 text-center mb-2">
            커피챗 참여 신청
          </h2>
          <div>
            <label className="block font-semibold mb-2">채팅방 닉네임</label>
            <input
              className="w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FE9400] focus:border-transparent"
              placeholder="닉네임을 입력해주세요(최대 10자)"
              value={chatNickname}
              onChange={(e) => setChatNickname(limitLength(e.target.value, 10))}
              maxLength={10}
            />
          </div>
          <div>
            <label className="block font-semibold mb-2">채팅방 프로필</label>
            <p className="text-sm text-gray-500 mb-2">
              내 프로필이 없으면 기본 프로필로 표시됩니다
            </p>
            <div className="space-y-2">
              <div
                onClick={() => setProfileImageType('DEFAULT')}
                className={`flex items-center justify-between px-4 py-3 border rounded-sm cursor-pointer transition-colors ${
                  profileImageType === 'DEFAULT'
                    ? 'border-[#FE9400] bg-[#FE9400]/5'
                    : 'border-gray-200 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center border-gray-300`}
                  >
                    {profileImageType === 'DEFAULT' && (
                      <div className="w-1.5 h-1.5 bg-[#FE9400] rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-[#333333]">
                    기본 프로필
                  </span>
                </div>
              </div>
              <div
                onClick={() => setProfileImageType('USER')}
                className={`flex items-center justify-between px-4 py-3 border rounded-sm cursor-pointer transition-colors ${
                  profileImageType === 'USER'
                    ? 'border-[#FE9400] bg-[#FE9400]/5'
                    : 'border-gray-200 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center border-gray-300`}
                  >
                    {profileImageType === 'USER' && (
                      <div className="w-1.5 h-1.5 bg-[#FE9400] rounded-full"></div>
                    )}
                  </div>
                  <span className="font-medium text-[#333333]">내 프로필</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full mt-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className={`
                flex-1 px-4 py-2 rounded-md
                ${
                  chatNickname.trim().length === 0
                    ? 'bg-[#FE9400]/50 text-white'
                    : 'bg-[#FE9400] text-white cursor-pointer'
                }
              `}
              disabled={chatNickname.trim().length === 0}
            >
              참여
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, container);
}
