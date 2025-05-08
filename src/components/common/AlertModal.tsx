import { useEffect } from 'react'
import { createPortal } from 'react-dom'

export interface AlertModalProps {
  isOpen: boolean
  icon?: React.ReactNode        
  title?: string              
  message: string            
  onClose: () => void           
  onConfirm?: () => void      
  confirmText?: string        
  showCancelButton?: boolean  
  cancelText?: string           
  onCancel?: () => void       
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
  // 포털 루트 요소 생성
  useEffect(() => {
    let root = document.getElementById('modal-root')
    if (!root) {
      root = document.createElement('div')
      root.id = 'modal-root'
      document.body.appendChild(root)
    }
  }, [])

  if (!isOpen) return null

  const modal = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      {/* 반투명 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />

      {/* 모달 박스 (최대폭 20rem) */}
      <div
        className="relative bg-white rounded-lg shadow-lg w-10/12 max-w-xs mx-auto overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* 내용 영역 */}
        <div className="flex flex-col items-center p-6 space-y-4 text-center">
          {icon && <div>{icon}</div>}

          {title && (
            <h2 className="text-lg font-semibold text-gray-800">
              {title}
            </h2>
          )}

          <p className="text-gray-600">{message}</p>

          {/* 버튼 영역 */}
          <div className={`flex w-full mt-2 ${showCancelButton ? 'gap-2' : ''}`}>
            {showCancelButton && (
              <button
                onClick={() => {
                  onCancel?.()
                  onClose()
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                onConfirm?.()
                onClose()
              }}
              className="flex-1 px-4 py-2 bg-[#FE9400] text-white rounded-md hover:bg-orange-500"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return createPortal(modal, document.getElementById('modal-root')!)
}
