import { useState } from 'react';
import { Menu, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/assets/logo.png';
import GroupMemberMenu, { Member } from '@/components/coffeechat/GroupMemberMenu';

interface HeaderProps {
  mode: 'logo' | 'title';
  title?: string;
  onBackClick?: () => void;
  isGroupChat?: boolean;
  chatMembers?: Member[];
  onLeaveChat?: () => void;
  onDeleteChat?: () => void;
  myMemberId?: string;
}

const Header = ({
  mode,
  title,
  onBackClick,
  isGroupChat = false,
  chatMembers,
  onLeaveChat,
  onDeleteChat,
  myMemberId,
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const goHome = () => {
    navigate('/');
  };

  return (
    <>
      <header className="absolute max-w-md top-0 left-0 h-14 z-30 bg-white w-full mx-auto">
        <div className="w-full mx-auto px-4 h-full flex items-center justify-between">
          {/* 왼쪽: 로고 또는 뒤로가기 */}
          {mode === 'title' ? (
            <button onClick={handleBack} className="rounded-full hover:opacity-80">
              <ChevronLeft className="w-6 h-6 cursor-pointer"/>
            </button>
          ) : (
            <div className="h-full flex items-center" onClick={goHome}>
              <img
                src={Logo}
                alt="Cafeboo"
                width={409}
                height={188}
                className="h-9 w-auto cursor-pointer"
              />
            </div>
          )}

          {/* 가운데: 타이틀 */}
          {mode === 'title' && (
            <h1
              className="text-lg font-bold absolute left-1/2 transform -translate-x-1/2"
            >
              {title}
            </h1>
          )}

          {/* 오른쪽: 그룹 채팅 메뉴 버튼 (isGroupChat일 때만) */}
          {isGroupChat && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMenuOpen(true)}
                className="p-1 rounded-full hover:opacity-80 cursor-pointer"
              >
                <Menu className="w-6 h-6"/>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* isGroupChat일 때만 그룹 멤버 메뉴 보여주기 */}
      {isGroupChat && (
        <GroupMemberMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          members={chatMembers || []}
          onLeave={onLeaveChat || (() => {})}
          onDelete={onDeleteChat || (() => {})}
          myMemberId={myMemberId || ''}
        />
      )}
    </>
  );
};

export default Header;

