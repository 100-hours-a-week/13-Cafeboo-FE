import ProfileCard from '@/components/mypage/ProfileCard';
import SettingsMenu from '@/components/mypage/SettingMenu';
import Header from '@/components/common/Header';
import { useNavigate } from "react-router-dom"

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  
  const userProfile = {
    nickname: 'user님',
    profileImageUrl: '', 
    caffeineLimit: 400,
    beanCount: 0,
    challengeCount: 0
  };
  
  // 핸들러 함수들
  const handleEditProfile = () => {
    navigate('/main/mypage/edit');
  };

  const handleLogout = () => {
    console.log('로그아웃 처리');
    // 실제 구현: 로그아웃 API 호출 및 상태 초기화
  };
  
  const handleDeleteAccount = () => {
    console.log('회원 탈퇴 화면으로 이동');
    // 실제 구현: router.push('/mypage/delete-account')
  };

  return (
    <div className="min-h-screen">
      <Header mode="logo" />
      <main className="pt-16 space-y-4">
        <h2 className="mb-3 text-lg text-[#000000] font-semibold">
                마이 페이지
        </h2>
        
        {/* 프로필 카드 */}
        <ProfileCard 
          nickname={userProfile.nickname}
          profileImageUrl={userProfile.profileImageUrl}
          caffeineLimit={userProfile.caffeineLimit}
          beanCount={userProfile.beanCount}
          challengeCount={userProfile.challengeCount}
          onEditClick={handleEditProfile}
        />
        
        {/* 설정 메뉴 */}
        <SettingsMenu 
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />
      </main>
    </div>
  );
};

export default MyPage;