import PageLayout from '@/layout/PageLayout';
import ViewReviewForm from '@/components/review/ViewReviewForm';
import WriteReviewForm from '@/components/review/WriteReviewForm';

interface Props {
  viewOnly: boolean;
  coffeeChatId?: string;
  coffeeChatData?: any;
  membersData?: any;
  membershipData?: any;
  isLoading: boolean;
  isError: boolean;
  navigate: (to: string) => void;
  liked: boolean;
  likeCount: number;
  onLikeToggle: (newLiked: boolean) => void;
  onWriteSubmit: (params: {
    memberId: string;
    text: string;
    images: File[];
  }) => Promise<void>;
  writeReviewLoading: boolean;
}

export default function CoffeeChatReviewPageUI({
  viewOnly,
  coffeeChatId,
  coffeeChatData,
  membersData,
  membershipData,
  isLoading,
  isError,
  navigate,
  liked,
  likeCount,
  onLikeToggle,
  onWriteSubmit,
  writeReviewLoading,
}: Props) {
  const title = viewOnly ? '후기 보기' : '후기 작성하기';

  if (isLoading) {
    return (
      <PageLayout
        headerMode="title"
        headerTitle={title}
        onBackClick={() => navigate('/coffeechat')}
      >
        <div className="py-24 text-center text-gray-500">로딩 중...</div>
      </PageLayout>
    );
  }

  if (isError || !coffeeChatId) {
    return (
      <PageLayout
        headerMode="title"
        headerTitle={title}
        onBackClick={() => navigate('/coffeechat')}
      >
        <div className="py-24 text-center text-red-500">
          데이터를 불러오는 데 실패했습니다.
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      headerMode="title"
      headerTitle={title}
      onBackClick={() => navigate('/coffeechat')}
    >
      {viewOnly ? (
        <ViewReviewForm
          coffeeChatData={coffeeChatData}
          membersData={membersData}
          liked={liked}
          likeCount={likeCount}
          onLikeToggle={onLikeToggle}
        />
      ) : (
        <WriteReviewForm
          coffeeChatId={coffeeChatId}
          chatDetail={coffeeChatData}
          memberId={membershipData?.memberId}
          onSubmit={onWriteSubmit}
          writeLoading={writeReviewLoading}
        />
      )}
    </PageLayout>
  );
}
