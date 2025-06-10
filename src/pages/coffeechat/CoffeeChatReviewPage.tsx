import PageLayout from "@/layout/PageLayout";
import { useNavigate, useLocation } from "react-router-dom";
import WriteReviewForm from "@/components/review/WriteReviewForm";
import ViewReviewForm from "@/components/review/ViewReviewForm";

export default function CoffeeChatReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isReviewed = location.state?.isReviewed;

  return (
    <PageLayout
      headerMode="title"
      headerTitle="후기 작성하기"   
      onBackClick={() => navigate('/main/coffeechat')}
    >
        <>
        {isReviewed ? (
            <ViewReviewForm/>
        ) : (
            <WriteReviewForm/>
        )}
        </>
    </PageLayout>
    
  );
}