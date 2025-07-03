import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MyPagePageUI from '@/pages/mypage/mypage/MyPageUI';
import { useUserProfile, useUpdateUserProfile } from '@/api/mypage/profileApi';
import { useLogout } from '@/api/mypage/LogoutApi';
import { useDeleteUser } from '@/api/mypage/deletUserApi';
import { UpdateUserProfilePayload } from '@/api/mypage/profile.dto';
import { useToastStore } from '@/stores/toastStore';

export default function MyPageContainer() {
  const navigate = useNavigate();
  const { showToast } = useToastStore();

  const { data: userProfile, isLoading, isError, error, refetch } = useUserProfile();
  const {
    mutateAsyncFn: updateUserProfileAsync,
    isLoading: isUpdateProfileLoading,
  } = useUpdateUserProfile();

  const {
    mutateFn: logout,
    isLoading: isLogoutLoading,
    isError: isLogoutError,
    error: logoutError,
  } = useLogout();

  const {
    mutateFn: deleteUser,
    isLoading: isDeleting,
    isError: isDeleteError,
    error: deleteError,
  } = useDeleteUser();

  // 로컬 상태
  const [showLogoutError, setShowLogoutError] = useState(false);
  const [showDeleteError, setShowDeleteError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  const [editNickname, setEditNickname] = useState('');
  const [editProfileImageUrl, setEditProfileImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 유저 프로필 데이터가 로드되면 초기값 세팅
  useEffect(() => {
    if (userProfile) {
      setEditNickname(userProfile.nickname);
      setEditProfileImageUrl(userProfile.profileImageUrl);
    }
  }, [userProfile]);

  // 이미지 변경 핸들러
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

  // 편집 모달 토글 핸들러
  const openEditModal = () => setShowEditProfileModal(true);
  const closeEditModal = () => setShowEditProfileModal(false);

  // 프로필 저장
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
    } catch (err: any) {
      console.error('프로필 수정 오류:', err);
      showToast('error', err.message || '프로필 수정에 실패했습니다.');
    }
  };

  // 로그아웃 관련
  const confirmLogout = () => {
    logout();
    if (isLogoutError) setShowLogoutError(true);
  };

  // 회원 탈퇴 관련
  const confirmDelete = () => {
    deleteUser();
    if (isDeleteError) setShowDeleteError(true);
  };

  // UI에 넘겨줄 상태와 핸들러 묶음
  const status = {
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
  };

  const modalControls = {
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
  };

  const handlers = {
    onProfileImageChange,
    openEditModal,
    closeEditModal,
    onSaveProfile,
    confirmLogout,
    confirmDelete,
  };

  return (
    <MyPagePageUI
      userProfile={userProfile}
      status={status}
      modalControls={modalControls}
      handlers={handlers}
      fileInputRef={fileInputRef}
      editNickname={editNickname}
      setEditNickname={setEditNickname}
      editProfileImageUrl={editProfileImageUrl}
      setEditProfileImageUrl={setEditProfileImageUrl}
      navigate={navigate}
    />
  );
}
