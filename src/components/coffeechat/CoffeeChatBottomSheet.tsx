import { useCreateCoffeeChat } from '@/api/coffeechat/coffeechatApi';
import type { CreateCoffeeChatRequestDTO } from '@/api/coffeechat/coffeechat.dto';
import FullPageSheet from '@/components/common/FullPageBottomSheet';
import CoffeeChatForm from '@/components/coffeechat/CoffeeChatCreateForm';
import { useToastStore } from '@/stores/toastStore';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CoffeeChatBottomSheet({ open, onClose }: Props) {
  const { mutateAsyncFn, isLoading } = useCreateCoffeeChat();
  const { showToast } = useToastStore();

  const handleFormSubmit = async (payload: CreateCoffeeChatRequestDTO) => {
    if (!navigator.onLine) {
      showToast('error', '인터넷 연결을 확인해주세요');
      return;
    }
    try {
      await mutateAsyncFn(payload);
      showToast('success', '커피챗이 생성되었습니다!');
      onClose();
    } catch (error: any) {
      console.log(error);
      showToast('error', error?.message || '생성에 실패했습니다.');
    }
  };

  return (
    <FullPageSheet open={open} onClose={onClose} title="커피챗 생성하기">
      <CoffeeChatForm onSubmit={handleFormSubmit} />
    </FullPageSheet>
  );
}
