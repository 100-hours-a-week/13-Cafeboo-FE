import ProfileCard from '@/components/mypage/ProfileCard';
import SettingsMenu from '@/components/mypage/SettingMenu';
import Header from '@/components/common/Header';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AlertModal from '@/components/common/AlertModal';
import { Info, AlertTriangle } from 'lucide-react';
import { useUserProfile } from '@/api/profileApi';
import { useLogout } from '@/api/LogoutApi';
import { useDeleteUser } from '@/api/deletUserApi';
import { useState } from 'react';
import EmptyState from '@/components/common/EmptyState';

const MyPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: userProfile, isLoading, isError, error } = useUserProfile();
  const { logout, isLoading: isLogoutLoading, isError:isLogoutError, error: logoutError } = useLogout();
  const { deleteUser, isLoading: isDeleting, isError: isDeleteError, error: deleteError } = useDeleteUser();
  const [showLogoutError, setShowLogoutError] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const renderAlertModal = (isOpen: boolean, error: any, onClose: () => void) => {
    if (!isOpen || !error) return null;
    return (
      <AlertModal
        isOpen={isOpen}
        icon={<Info size={36} className="text-[#FE9400]" />}
        title="알림"
        message={(error as Error)?.message || '오류가 발생했습니다.'}
        onClose={onClose}
        onConfirm={onClose}
        confirmText="확인"
        showCancelButton={false}
      />
    );
  };

  // 핸들러 함수들
  const handleEditProfile = () => {
    navigate('/main/mypage/edit');
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    if (isLogoutLoading) {
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <LoadingSpinner type="clip" size="large" fullScreen={false} />
      </div>
    }
    if (isLogoutError) {
      setShowLogoutError(true);
      renderAlertModal(showLogoutError, logoutError, () => setShowLogoutError(false));
    }
  }

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

   const confirmDelete = () => {
    deleteUser();
    if (isDeleting) {
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <LoadingSpinner type="clip" size="large" fullScreen={false} />
      </div>
    }
    if(isDeleteError){
      setShowDeleteError(true);
      renderAlertModal(showDeleteError, deleteError, () => setShowDeleteError(false));
    }
    };

  return (
    <div className="min-h-screen">
      <Header mode="logo" />
      <main className="pt-16 space-y-4">
        <h2 className="mb-3 text-lg text-[#000000] font-semibold">
          마이 페이지
        </h2>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 w-full mx-auto">
          {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner type="clip" size="small" fullScreen={false} />
              </div>
            ) : isError ? (
              <EmptyState
                title="데이터 로딩 실패"
                description={(error as Error).message}
                icon={<AlertTriangle className="w-10 h-10 text-[#D1D1D1]" />}
              />
            ) : (
              <ProfileCard
                  nickname={userProfile?.nickname}
                  profileImageUrl={userProfile?.profileImageUrl}
                  caffeineLimit={userProfile?.dailyCaffeineLimitMg}
                  beanCount={userProfile?.coffeeBean}
                  challengeCount={userProfile?.challengeCount}
                  onEditClick={handleEditProfile}
              />
            )
          }
        </div>

        {/* 설정 메뉴 */}
        <SettingsMenu
          onLogout={handleLogout}
          onDeleteAccount={handleDeleteAccount}
        />
      </main>
      {/* 로그아웃 오류 모달 */}
      {showLogoutError && (
        <AlertModal
          isOpen
          icon={<Info size={36} className="text-[#FE9400]" />}
          title="로그아웃 오류"
          message={logoutError?.message ?? "로그아웃 중 오류가 발생했습니다."}
          onClose={() => setShowLogoutError(false)}
          onConfirm={() => setShowLogoutError(false)}
          confirmText="확인"
          showCancelButton={false}
        />
      )}

      {/* 회원탈퇴 오류 모달 */}
      {showDeleteError && (
        <AlertModal
          isOpen
          icon={<Info size={36} className="text-[#FE9400]" />}
          title="회원탈퇴 오류"
          message={deleteError?.message ?? "회원탈퇴 중 오류가 발생했습니다."}
          onClose={() => setShowDeleteError(false)}
          onConfirm={() => setShowDeleteError(false)}
          confirmText="확인"
          showCancelButton={false}
        />
      )}

     {showDeleteConfirm && (
       <AlertModal
         isOpen={true}
         icon={<Info size={36} className="text-[#FE9400]" />}
         title="회원탈퇴"
         message="정말로 탈퇴하시겠습니까?"
         confirmText="탈퇴"
         cancelText="취소"
         showCancelButton={true}
         onClose={() => setShowDeleteConfirm(false)}
         onCancel={() => setShowDeleteConfirm(false)}
         onConfirm={confirmDelete}
       />
     )}

    {showLogoutConfirm && (
       <AlertModal
         isOpen={true}
         icon={<Info size={36} className="text-[#FE9400]" />}
         title="로그아웃"
         message="로그아웃 하시겠습니까?"
         confirmText="로그아웃"
         cancelText="취소"
         showCancelButton={true}
         onClose={() => setShowLogoutConfirm(false)}
         onCancel={() => setShowLogoutConfirm(false)}
         onConfirm={confirmLogout}
       />
     )}
    </div>
  );
};

export default MyPage;
