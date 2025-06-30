import ProfileCard from '@/components/mypage/ProfileCard';
import SettingsMenu from '@/components/mypage/SettingMenu';
import PageLayout from '@/layout/PageLayout';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import AlertModal from '@/components/common/AlertModal';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { BiSolidPencil, BiSolidUserCircle } from "react-icons/bi";
import { FiUser, FiLogOut, FiUserX } from "react-icons/fi";
import { LuCircleUserRound } from "react-icons/lu";
import { UpdateUserProfilePayload } from '@/api/mypage/profile.dto';
import { useUserProfile, useUpdateUserProfile } from '@/api/mypage/profileApi';
import { useLogout } from '@/api/mypage/LogoutApi';
import { useDeleteUser } from '@/api/mypage/deletUserApi';
import { useState, useRef, useEffect } from 'react';
import EmptyState from '@/components/common/EmptyState';
import SectionCard from '@/components/common/SectionCard';
import { useToastStore } from '@/stores/toastStore'; 

const MyPagePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: userProfile, isLoading, isError, error, refetch } = useUserProfile();
  const { mutateFn: updateUserProfile, mutateAsyncFn: updateUserProfileAsync, isLoading:isUpdateProfileLoading, isError:isUpdateProfileError, error: updateProfileError } = useUpdateUserProfile();
  const { mutateFn: logout, isLoading: isLogoutLoading, isSuccess:isLogoutSuccess, isError:isLogoutError, error: logoutError } = useLogout();
  const { mutateFn: deleteUser, isLoading: isDeleting, isError: isDeleteError, error: deleteError } = useDeleteUser();
  const [showLogoutError, setShowLogoutError] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { showToast } = useToastStore();

  // 모달 오픈 여부 상태만 관리
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editProfileImageUrl, setEditProfileImageUrl] = useState('');
  
  useEffect(() => {
    if (userProfile) {
      setEditNickname(userProfile.nickname);
      setEditProfileImageUrl(userProfile.profileImageUrl);
    }
  }, [userProfile]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 파일 선택 핸들러
  const onProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditProfileImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };


  // 편집 모달 열기/닫기 핸들러
  const openEditModal = () => setShowEditProfileModal(true);
  const closeEditModal = () => setShowEditProfileModal(false);

  const renderAlertModal = (isOpen: boolean, error: any, onClose: () => void) => {
    if (!isOpen || !error) return null;
    return (
      <AlertModal
        isOpen={isOpen}
        icon={<AlertCircle size={36} className="text-[#FE9400]" />}
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

  const onSaveProfile = async () => {
    if (!userProfile) return;
  
    const payload: UpdateUserProfilePayload = {};
  
    if (editNickname !== userProfile.nickname) {
      payload.nickname = editNickname;
    }

    if (fileInputRef.current?.files?.[0]) {
      payload.profileImage = fileInputRef.current.files[0];
    }
  
    if (Object.keys(payload).length === 0) {
      showToast('error', '수정된 내용이 없습니다.');
      return;
    }

    try {
      await updateUserProfileAsync(payload);
      await refetch();
      setShowEditProfileModal(false);
    } catch (error) {
      console.error("프로필 수정 오류:"+`${updateProfileError.status}(${updateProfileError.code}) - ${updateProfileError.message}`);
    }
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
    <PageLayout headerMode="logo">

      {/* 1. 프로필 영역 */}
      <SectionCard className='border-none'>
          {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <LoadingSpinner type="clip" size="small" fullScreen={false} />
              </div>
            ) : isError ? (
              <EmptyState
                title="데이터 로딩 실패"
                description={error.message}
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
            )
          }
      </SectionCard>

      {/* 3. 메뉴 영역 */}
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
          onClick={() => navigate('/main/mypage/edit')}
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
              <img
                src={editProfileImageUrl || '/default-profile.png'}
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

            <label className="block mb-2 font-semibold">닉네임</label>
            <input
              type="text"
              className="w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FE9400] focus:border-transparent mb-4"
              value={editNickname}
              onChange={(e) => setEditNickname(e.target.value)}
              placeholder="닉네임 입력"
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

      {/* 기타 모달 및 오류 알림 (로그아웃, 회원탈퇴 등) 유지 */}
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

export default MyPagePage;