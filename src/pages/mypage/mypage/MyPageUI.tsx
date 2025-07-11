import PageLayout from '@/layout/PageLayout';
import ProfileCard from '@/components/mypage/ProfileCard';
import SectionCard from '@/components/common/SectionCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import EmptyState from '@/components/common/EmptyState';
import AlertModal from '@/components/common/AlertModal';
import MemberImage from '@/components/common/MemberImage';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { BiSolidPencil } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";
import { LuCircleUserRound } from "react-icons/lu";

interface MyPageUIProps {
  userProfile: any;
  status: {
    isLoading: boolean;
    isError: boolean;
    error: any;
    isUpdateProfileLoading: boolean;
    isLogoutLoading: boolean;
    isLogoutError: boolean;
    logoutError: any;
    isDeleting: boolean;
    isDeleteError: boolean;
    deleteError: any;
  };
  modalControls: {
    showLogoutError: boolean;
    setShowLogoutError: (val: boolean) => void;
    showDeleteError: boolean;
    setShowDeleteError: (val: boolean) => void;
    showDeleteConfirm: boolean;
    setShowDeleteConfirm: (val: boolean) => void;
    showLogoutConfirm: boolean;
    setShowLogoutConfirm: (val: boolean) => void;
    showEditProfileModal: boolean;
    setShowEditProfileModal: (val: boolean) => void;
  };
  handlers: {
    onProfileImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    openEditModal: () => void;
    closeEditModal: () => void;
    onSaveProfile: () => void;
    confirmLogout: () => void;
    confirmDelete: () => void;
  };
  fileInputRef: React.RefObject<HTMLInputElement>;
  editNickname: string;
  setEditNickname: (name: string) => void;
  editProfileImageUrl: string;
  setEditProfileImageUrl: (url: string) => void;
  navigate: any;
}

const MyPageUI: React.FC<MyPageUIProps> = ({
  userProfile,
  status,
  modalControls,
  handlers,
  fileInputRef,
  editNickname,
  setEditNickname,
  editProfileImageUrl,
  setEditProfileImageUrl,
  navigate,
}) => {
  const {
    isLoading,
    isError,
    error,
    isUpdateProfileLoading,
    isLogoutLoading,
    isLogoutError,
    logoutError,
    isDeleting,
    isDeleteError,
    deleteError,
  } = status;

  const {
    showLogoutError,
    setShowLogoutError,
    showDeleteError,
    setShowDeleteError,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showLogoutConfirm,
    setShowLogoutConfirm,
    showEditProfileModal,
    setShowEditProfileModal,
  } = modalControls;

  const {
    onProfileImageChange,
    openEditModal,
    closeEditModal,
    onSaveProfile,
    confirmLogout,
    confirmDelete,
  } = handlers;

  return (
    <PageLayout headerMode="logo">

      {/* 프로필 섹션 */}
      <SectionCard className='border-none !px-2'>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <LoadingSpinner type="clip" size="medium" fullScreen={false} />
          </div>
        ) : isError ? (
          <EmptyState
            title="데이터 로딩 실패"
            description={error?.message}
            icon={<AlertTriangle className="w-10 h-10 text-[#D1D1D1]" />}
          />
        ) : (
          <ProfileCard
            nickname={userProfile?.nickname || '닉네임 없음'}
            profileImageUrl={userProfile?.profileImageUrl || ''}
            dailyCaffeineLimitMg={userProfile?.dailyCaffeineLimitMg ?? 0}
            coffeeBean={userProfile?.coffeeBean ?? 0}
            onDeleteAccountClick={() => setShowDeleteConfirm(true)}
          />
        )}
      </SectionCard>

      {/* 메뉴 섹션 */}
      <div className='p-1'>
        <button
          className="w-full flex items-center text-left px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          onClick={openEditModal}
        >
          <BiSolidPencil className="w-4.5 h-4.5 mr-3 text-[#333]" />
          프로필 편집
        </button>
        <button
          className="w-full flex items-center text-left px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          onClick={() => navigate('/mypage/edit')}
        >
          <LuCircleUserRound className="w-4.5 h-4.5 mr-3 text-[#333]" />
          내 정보 수정
        </button>
        <button
          className="w-full flex items-center text-left px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200"
          onClick={() => setShowLogoutConfirm(true)}
        >
          <FiLogOut className="w-4.5 h-4.5 mr-3 text-[#333]" />
          로그아웃
        </button>
      </div>

      {/* 프로필 편집 모달 */}
      {showEditProfileModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          onClick={closeEditModal}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-xs p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4 text-center">프로필 편집</h3>

            <div
              className="relative w-28 h-28 mx-auto my-8 rounded-full overflow-hidden cursor-pointer group"
              onClick={() => fileInputRef.current?.click()}
            >
              <MemberImage
                url={editProfileImageUrl || '/default-profile.png'}
                alt="프로필 편집용 이미지"
                className="w-full h-full object-cover rounded-full bg-gray-100"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-60 transition-opacity flex flex-col items-center justify-center text-white text-sm rounded-full select-none pointer-events-none group-hover:pointer-events-auto">
                <BiSolidPencil size={20} />
              </div>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={onProfileImageChange}
              />
            </div>

            <input
              type="text"
              className="w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FE9400] focus:border-transparent mb-4"
              value={editNickname}
              onChange={(e) => setEditNickname(e.target.value)}
              placeholder="닉네임 입력(최대 10자)"
              maxLength={10}
            />

            <div className="flex gap-2 w-full mt-3">
              <button
                onClick={closeEditModal}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={onSaveProfile}
                disabled={isUpdateProfileLoading}
                className="flex-1 px-4 py-2 rounded-md bg-[#FE9400] text-white cursor-pointer disabled:opacity-50"
              >
                {isUpdateProfileLoading ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 알림 모달 */}
      {showLogoutError && (
        <AlertModal
          isOpen
          icon={<AlertCircle size={36} className="text-[#FE9400]" />}
          title="로그아웃 오류"
          message={logoutError?.message ?? '로그아웃 중 오류가 발생했습니다.'}
          onClose={() => setShowLogoutError(false)}
          onConfirm={() => setShowLogoutError(false)}
          confirmText="확인"
          showCancelButton={false}
        />
      )}
      {showDeleteError && (
        <AlertModal
          isOpen
          icon={<AlertCircle size={36} className="text-[#FE9400]" />}
          title="회원탈퇴 오류"
          message={deleteError?.message ?? '회원탈퇴 중 오류가 발생했습니다.'}
          onClose={() => setShowDeleteError(false)}
          onConfirm={() => setShowDeleteError(false)}
          confirmText="확인"
          showCancelButton={false}
        />
      )}
      {showDeleteConfirm && (
        <AlertModal
          isOpen
          icon={<AlertCircle size={36} className="text-[#FE9400]" />}
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
          isOpen
          icon={<AlertCircle size={36} className="text-[#FE9400]" />}
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
    </PageLayout>
  );
};

export default MyPageUI;
