import PageLayout from '@/layout/PageLayout';
import Event from '@/assets/eventdetail.png'
import { useNavigate } from 'react-router-dom';

const EventPage = () => {
    const navigate = useNavigate();
  return (
    <PageLayout headerMode='title' headerTitle='이벤트 상세보기' onBackClick={() => navigate('/')}>
      <div className="w-full">
            <img
                src={Event}
                alt="긴 이벤트 이미지"
                className="w-full"
            />
        </div>
    </PageLayout>
  );
};

export default EventPage;