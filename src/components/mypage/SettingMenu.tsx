import { ChevronRight } from 'lucide-react';
import SectionCard from '@/components/common/SectionCard';

interface SettingsMenuProps {
  onLogout: () => void;
  onDeleteAccount: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({
  onLogout,
  onDeleteAccount,
}) => {
  return (
    <SectionCard className='!p-0'>
      {/* 로그아웃 */}
      <div
        className="flex items-center justify-between p-4 border-b border-[#dadcdf]"
        onClick={onLogout}
      >
        <div>로그아웃</div>
        <ChevronRight className="text-[#333333] cursor-pointer" size={20} />
      </div>

      {/* 회원 탈퇴 */}
      <div
        className="flex items-center justify-between p-4"
        onClick={onDeleteAccount}
      >
        <div>회원 탈퇴</div>
        <ChevronRight className="text-[#333333] cursor-pointer" size={20} />
      </div>
    </SectionCard>
  );
};

export default SettingsMenu;
