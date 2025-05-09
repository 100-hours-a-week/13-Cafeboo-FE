import { RingLoader, ClipLoader } from "react-spinners";

interface LoadingSpinnerProps {
  fullScreen?: boolean;   // 전체 화면으로 로딩 스피너 표시 여부
  size?: 'small' | 'medium' | 'large'; // 스피너의 크기
  color?: string;         // 스피너 색상
  type?: 'clip' | 'ring'; // 스피너 스타일
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  fullScreen = true,
  size = 'medium',
  color = "#FE9400",
  type = "clip"
}) => {
  // size를 라이브러리 크기로 매핑
  const spinnerSize = size === 'small' ? 30 : size === 'large' ? 80 : 50;

  // 선택된 스피너 타입에 따라 다르게 렌더링
  const SpinnerComponent = type === "clip" ? ClipLoader : RingLoader;

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "fixed inset-0 bg-black/50 z-50" : "relative"
      }`}
    >
      <SpinnerComponent size={spinnerSize} color={color} />
    </div>
  );
};

export default LoadingSpinner;