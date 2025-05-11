import { ChevronRight } from 'lucide-react';

interface SettingsMenuProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  onLogout,
  onDeleteAccount,
}) => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* 로그아웃 */}
      <div
        className="flex items-center justify-between p-4 border-b border-gray-200"
        onClick={onLogout}
      >
        <div className="text-[#333333]">로그아웃</div>
        <ChevronRight className="text-[#333333] cursor-pointer" size={20} />
      </div>

      {/* 회원 탈퇴 */}
      <div
        className="flex items-center justify-between p-4"
        onClick={onDeleteAccount}
      >
        <div className="text-[#333333]">회원 탈퇴</div>
        <ChevronRight className="text-[#333333] cursor-pointer" size={20} />
      </div>
    </div>
  );
};

export default SettingsMenu;
