import PageLayout from "@/layout/PageLayout";
import { useNavigate, useLocation } from "react-router-dom";
import WriteReviewForm from "@/components/review/WriteReviewForm";
import ViewReviewForm from "@/components/review/ViewReviewForm";

export default function CoffeeChatReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { viewOnly, coffeeChatId } = location.state || {};
  const title = viewOnly ? "후기 보기" : "후기 작성하기";

  return (
    <PageLayout
      headerMode="title"
      headerTitle={title}
      onBackClick={() => navigate('/main/coffeechat')}
    >
        <>
        {viewOnly ? (
          <ViewReviewForm coffeeChatId={coffeeChatId} />
        ) : (
          <WriteReviewForm coffeeChatId={coffeeChatId} />
        )}
        </>
    </PageLayout>
    
  );
}