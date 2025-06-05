import { useEffect } from 'react';
import FullPageSheet from '../common/FullPageBottomSheet';
import CoffeeChatForm from '@/components/coffeechat/CoffeeChatCreateForm';

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CoffeeChatBottomSheet({ open, onClose }: Props) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_JAVASCRIPT_API_KEY}&libraries=services`;
    script.async = true;
    document.head.appendChild(script);
  
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return (
    <FullPageSheet open={open} onClose={onClose} title="커피챗 생성하기">
      <CoffeeChatForm />
    </FullPageSheet>
  );
}
  