import { useState } from 'react';
import { Menu, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import GNBMenu from '@/components/common/GNBMenu';
import Logo from '@/assets/logo.svg';
import GroupMemberMenu, { Member } from '@/components/coffeechat/GroupMemberMenu';

interface HeaderProps {
  mode: 'logo' | 'title';
  title?: string;
  onBackClick?: () => void;
  isGroupChat?: boolean;    
  chatMembers?: Member[];     
  onLeaveChat?: () => void; 
  onDeleteChat?: () => void;
  myMemberId?: string 
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

  const menuItems = [
    { label: '카페인 히스토리', href: '/main/diary' },
    { label: '커피챗', href: '/main/coffeechat'},
    { label: '마이 페이지', href: '/main/mypage' },
  ];

  const handleBack = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  const goHome = () => {
    navigate('/main/home')
  }

  const textColor = '#000000';

  return (
    <>
      <header className="absolute max-w-md top-0 left-0 h-14 z-30 bg-white w-full mx-auto">
        <div className="w-full mx-auto px-4 h-full flex items-center justify-between">
          {/* 왼쪽: 로고 또는 뒤로가기 */}
          {mode === 'title' ? (
            <button
              onClick={handleBack}
              className="rounded-full hover:opacity-80"
            >
              <ChevronLeft className="w-6 h-6 cursor-pointer" style={{ color: textColor }} />
            </button>
          ) : (
            <div className="h-full flex items-center" onClick={goHome}>
              <img src={Logo} alt="Cafeboo" className="h-8 w-auto cursor-pointer"/>
            </div>
          )}

          {/* 가운데: 타이틀 */}
          {mode === 'title' && (
            <h1
              className="text-lg font-bold absolute left-1/2 transform -translate-x-1/2"
              style={{ color: textColor }}
            >
              {title}
            </h1>
          )}

          {/* 오른쪽: 다크모드 토글 + 햄버거 메뉴 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-1 rounded-full hover:opacity-80 cursor-pointer"
            >
              <Menu className="w-6 h-6" style={{ color: textColor }} />
            </button>
          </div>
        </div>
      </header>

      {/* GNB 메뉴 컴포넌트 */}
      {isGroupChat ? (
        <GroupMemberMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          members={chatMembers || []}
          onLeave={onLeaveChat || (() => {})}
          onDelete={onDeleteChat || (() => {})}
          myMemberId={myMemberId || ""}
        />
      ) : (
        <GNBMenu
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          items={menuItems}
        />
      )}
    </>
  );
};

export default Header;
