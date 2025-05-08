import Header from '@/components/common/Header';
import HealthInfoEditor from '@/components/mypage/HealthInfoEditor';
import { useNavigate } from 'react-router-dom';

export default function MypageEditPage() {
  const navigate = useNavigate();

  const handleSave = async (data: any) => {
    console.log('저장할 데이터:', data);
    // await api.saveHealthInfo(data)
    navigate('/main/mypage');
  };

  return (
    <div className="min-h-screen">
      <Header
        mode="title"
        title="내 정보 수정"
        onBackClick={() => navigate('/main/mypage')}
      />

      <main className="pt-16 space-y-6">
        <HealthInfoEditor onSave={handleSave} />
      </main>
    </div>
  );
}
