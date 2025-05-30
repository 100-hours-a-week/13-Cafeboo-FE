import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface AlertModalProps {
  isOpen: boolean;
  icon?: React.ReactNode;
  title?: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
  confirmText?: string;
  showCancelButton?: boolean;
  cancelText?: string;
  onCancel?: () => void;
}

export default function AlertModal({
  isOpen,
  icon,
  title,
  message,
  onClose,
  onConfirm,
  confirmText = '확인',
  showCancelButton = false,
  cancelText = '취소',
  onCancel,
}: AlertModalProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [awaitingConfirm, setAwaitingConfirm] = useState<(() => void) | null>(null);

  useEffect(() => {
    const appRoot = document.getElementById('root');
    if (!appRoot) return;

    let el = appRoot.querySelector<HTMLDivElement>('#modal-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'modal-container';
      appRoot.appendChild(el);
    }
    setContainer(el);

    return () => {
      // 모달이 닫힐 때 컨테이너 정리
      if (el) {
        el.remove();
      }
    };
  }, []);

  const handleConfirm = () => {
    if (awaitingConfirm) {
      awaitingConfirm();
    }
    onConfirm?.();
    onClose();
  };

  // 컨테이너가 생성되지 않았거나 열려있지 않으면 렌더링하지 않음
  if (!isOpen || !container) return null;

  const modal = (
    <div className="absolute inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      {/* 반투명 오버레이 */}
      <div className="absolute inset-0 bg-black/50" />

      {/* 모달 박스 */}
      <div
        className="relative bg-white rounded-lg shadow-lg w-9/12 max-w-sm mx-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center p-6 space-y-3 text-center">
          {/* 아이콘 */}
          {icon && <div>{icon}</div>}

          {/* 제목 */}
          {title && <h2 className="text-lg font-semibold text-gray-800">{title}</h2>}

          {/* 메시지 */}
          <p className="text-gray-600 whitespace-pre-wrap">{message}</p>

          {/* 버튼 그룹 */}
          <div className={`flex w-full mt-2 ${showCancelButton ? 'gap-2' : ''}`}>
            {showCancelButton && (
              <button
                onClick={() => {
                  onCancel?.();
                  onClose();
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md cursor-pointer"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-[#FE9400] text-white rounded-md cursor-pointer"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, container);
}

