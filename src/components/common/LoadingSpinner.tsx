import { BeatLoader, ClipLoader } from 'react-spinners';

interface LoadingSpinnerProps {
  fullScreen?: boolean; // 전체 화면으로 로딩 스피너 표시 여부
  size?: 'small' | 'medium' | 'large'; // 스피너의 크기
  type?: 'clip' | 'beat'; // 스피너 스타일
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = true,
  size = 'medium',
  type = 'beat',
}) => {
  // size를 라이브러리 크기로 매핑
  const spinnerSize = size === 'small' ? 15 : size === 'large' ? 50 : 30;

  // 선택된 스피너 타입에 따라 다르게 렌더링
  const SpinnerComponent = type === 'clip' ? ClipLoader : BeatLoader;

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? 'fixed inset-0 bg-black/50 z-50' : 'relative'
      }`}
    >
      <SpinnerComponent size={spinnerSize} color="#E0E0E0" />
    </div>
  );
};

export default LoadingSpinner;
