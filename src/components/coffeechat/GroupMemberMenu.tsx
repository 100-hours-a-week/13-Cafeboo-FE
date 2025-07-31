import { X } from 'lucide-react';
import MemberImage from '@/components/common/MemberImage';

export interface Member {
  memberId: string;
  chatNickname: string;
  profileImageUrl: string;
  isHost: boolean;
}

interface GroupMemberMenuProps {
  isOpen: boolean;
  onClose: () => void;
  members: Member[];
  onLeave: () => void;
  myMemberId: string;
}

const getInitial = (name: string) => (name ? name[0] : '?');

export default function GroupMemberMenu({
  isOpen,
  onClose,
  members,
  onLeave,
  myMemberId,
}: GroupMemberMenuProps) {
  const host = members.find((m) => m.isHost);
  // 참여자 중 본인이 맨 위
  const sortedMembers = members
    .filter((m) => !m.isHost)
    .sort((a, b) =>
      a.memberId === myMemberId ? -1 : b.memberId === myMemberId ? 1 : 0
    );

  return (
    <>
      {isOpen && (
        <div onClick={onClose} className="fixed inset-0 bg-black/50 z-40"></div>
      )}
      <div
        className={`absolute top-0 right-0 bottom-0 z-50 transition-transform duration-300
          w-[80%] flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-[110%]'}`}
        style={{
          backgroundColor: '#FFFFFF',
        }}
      >
        {/* 상단: 닫기 버튼 */}
        <div
          className="flex justify-between items-center p-4 border-b"
          style={{
            borderColor: '#E5E7EB',
            backgroundColor: '#FE9400',
          }}
        >
          <button onClick={onClose} className="p-1">
            <X size={20} className="text-white cursor-pointer" />
          </button>
        </div>

        {/* 멤버 리스트 */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-4 font-semibold text-lg text-[#333333]">
            대화상대
          </div>
          <div className="space-y-6">
            {/* 방장 영역 */}
            <div>
              <div className="w-full py-2 px-3 mb-2 rounded-sm bg-gray-100 font-semibold text-gray-800">
                방장
              </div>
              <div className="flex items-center gap-3 px-3 py-3">
                {/* 프로필 */}
                {host ? (
                  <div className="flex items-center gap-3">
                    {host.profileImageUrl ? (
                      <MemberImage
                        url={host.profileImageUrl}
                        alt={host.chatNickname}
                        className="w-8 h-8 rounded-full object-cover bg-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center bg-indigo-400 text-white rounded-full text-base">
                        {getInitial(host.chatNickname)}
                      </div>
                    )}
                    <span className="flex items-center gap-1">
                      {host.memberId === myMemberId && (
                        <span className="mr-1 w-4 h-4 bg-black/50 text-white text-[8pt] rounded-full flex items-center text-center justify-center">
                          나
                        </span>
                      )}
                      {host.chatNickname}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">방장이 없습니다</span>
                )}
              </div>
            </div>

            {/* 참여자(멤버) 영역 */}
            <div>
              <div className="w-full py-2 px-3 mb-2 rounded-sm bg-gray-100 font-semibold text-gray-800">
                참여자
              </div>
              <ul>
                {sortedMembers.map((m) => (
                  <li
                    key={m.memberId}
                    className="flex items-center gap-3 px-3 py-3"
                  >
                    {m.profileImageUrl ? (
                      <MemberImage
                        url={m.profileImageUrl}
                        alt={m.chatNickname}
                        className="w-8 h-8 rounded-full object-cover bg-gray-200"
                      />
                    ) : (
                      <div className="w-8 h-8 flex items-center justify-center bg-indigo-400 text-white rounded-full text-base">
                        {getInitial(m.chatNickname)}
                      </div>
                    )}
                    <span className="flex items-center gap-1">
                      {m.memberId === myMemberId && (
                        <span className="mr-1 w-4 h-4 bg-black/50 text-white text-[8pt] font-semibold rounded-full flex items-center justify-center">
                          나
                        </span>
                      )}
                      {m.chatNickname}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 하단: 나가기 버튼 (항상 아래 고정) */}
        <div className="p-4">
          {host?.memberId === myMemberId ? (
            <></>
          ) : (
            <button
              onClick={onLeave}
              className="w-full py-3 rounded-sm bg-gray-100 text-red-500 font-semibold text-base hover:bg-gray-200 cursor-pointer"
            >
              커피챗 나가기
            </button>
          )}
        </div>
      </div>
    </>
  );
}
