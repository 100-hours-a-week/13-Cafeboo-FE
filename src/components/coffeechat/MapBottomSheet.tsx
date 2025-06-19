import FullPageSheet from '../common/FullPageBottomSheet';
import MapForm from '@/components/coffeechat/MapFrom';

interface Props {
    open: boolean;
    onClose: () => void;
    location: {
      latitude: number;
      longitude: number;
      kakaoPlaceUrl: string;
    };
}

export default function MapBottomSheet({ open, onClose, location }: Props) {
  return (
    <FullPageSheet open={open} onClose={onClose} title="지도">
      <MapForm location={location} />
    </FullPageSheet>
  );
}