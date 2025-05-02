import * as React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  confirmLabel = "저장",
  cancelLabel = "취소",
}) => (
  <Drawer open={open} onOpenChange={onOpenChange}>
    <DrawerContent
      className="
        fixed bottom-0 inset-x-0 
        max-h-[70%]            
        rounded-t-xl            
        bg-white dark:bg-[#121212]
        shadow-lg              
      "
    >

      {/* 상단 액션 바 */}
      <div className="-mt-2 mb-4 flex justify-between items-center px-4 py-1">
        <button
          onClick={() => onOpenChange(false)}
          className="text-[#56433C] text-sm"
        >
          {cancelLabel}
        </button>
        <button
          onClick={onConfirm}
          className="text-[#56433C] text-sm font-medium"
        >
          {confirmLabel}
        </button>
      </div>

      {/* 제목/설명 (선택) */}
      {(title || description) && (
        <DrawerHeader className="px-4 pt-2">
          {title && <DrawerTitle>{title}</DrawerTitle>}
          {description && (
            <DrawerDescription>{description}</DrawerDescription>
          )}
        </DrawerHeader>
      )}

      {/* 실제 컨텐츠 */}
      <div className="p-4 overflow-auto">{children}</div>
    </DrawerContent>
  </Drawer>
);

