import * as React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title?: string;
  description?: string;
  children: React.ReactNode;

  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;

  hideConfirm?: boolean;
  contentStyle?: React.CSSProperties;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  onConfirm,
  confirmLabel = '저장',
  cancelLabel = '취소',
  hideConfirm = false,
  contentStyle,
}) => (
  <Drawer open={open} onOpenChange={onOpenChange}>
    <DrawerContent
      className="
        fixed
        bottom: env(safe-area-inset-bottom)
        bottom: constant(safe-area-inset-bottom)
        w-full max-w-md
        rounded-t-xl bg-white shadow-lg
        flex flex-col
        mx-auto 
        sm:mx-auto 
        md:mx-auto 
        lg:ml-128      
        xl:ml-192   
        2xl:ml-256  
        [&>div:first-child]:bg-gray-300
      "
      style={{
        ...contentStyle,
        left: 0,
        right: 0,
      }}
    >
      {!hideConfirm && (
        <div className="-mt-2 mb-4 flex justify-between items-center px-4 py-1">
          <button
            onClick={() => onOpenChange(false)}
            className="text-[#FE9400] text-sm"
          >
            {cancelLabel}
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="text-[#FE9400] text-sm font-medium"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      )}

      {(title || description) && (
        <DrawerHeader className="mt-2 !pb-0 ">
          {title && <DrawerTitle className="p-1">{title}</DrawerTitle>}
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
      )}

      <div className="px-4 py-2 flex-1 overflow-auto">{children}</div>
    </DrawerContent>
  </Drawer>
);
