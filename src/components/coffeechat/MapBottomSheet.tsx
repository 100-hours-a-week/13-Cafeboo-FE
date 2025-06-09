import FullPageSheet from '../common/FullPageBottomSheet';
import MapForm from '@/components/coffeechat/MapFrom';

interface Props {
    open: boolean;
    onClose: () => void;
}

export default function MapBottomSheet({ open, onClose }: Props) {
  return (
    <FullPageSheet open={open} onClose={onClose} title="지도">
      <MapForm />
    </FullPageSheet>
  );
}