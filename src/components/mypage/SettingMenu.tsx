import { ChevronRight } from 'lucide-react';

interface SettingsMenuProps {
  onNavigateNotification: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  onNavigateNotification,
  onLogout,
  onDeleteAccount
}) => {
  return (
    <div className="bg-white rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] overflow-hidden">

      {/* 로그아웃 */}
      <div 
        className="flex items-center justify-between p-4 border-b border-gray-100"
        onClick={onLogout}
      >
        <div className="text-[#333333]">로그아웃</div>
        <ChevronRight className="text-[#333333]" size={20} />
      </div>

      {/* 회원 탈퇴 */}
      <div 
        className="flex items-center justify-between p-4"
        onClick={onDeleteAccount}
      >
        <div className="text-[#333333]">회원 탈퇴</div>
        <ChevronRight className="text-[#333333]" size={20} />
      </div>
    </div>
  );
};

export default SettingsMenu;