import FullPageSheet from '@/components/common/FullPageBottomSheet';
import CoffeeChatForm from '@/components/coffeechat/CoffeeChatCreateForm';

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function CoffeeChatBottomSheet({ open, onClose }: Props) {
  return (
    <FullPageSheet open={open} onClose={onClose} title="커피챗 생성하기">
      <CoffeeChatForm />
    </FullPageSheet>
  );
}
  