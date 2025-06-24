import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';

export default function CustomToast() {
  const { visible, message, type } = useToastStore();

  if (!visible) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[9999] w-[80%] max-w-sm">
      <div className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-md bg-black/70 text-white text-sm">
        <div>
          {type === 'success' ? (
            <CheckCircle2 size={20} className="text-green-400" />
          ) : (
            <AlertCircle size={20} className="text-red-400" />
          )}
        </div>
        <div className="flex-1">{message}</div>
      </div>
    </div>
  );
}


