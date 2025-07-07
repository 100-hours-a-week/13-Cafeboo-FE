import { useState } from 'react';
import { CalendarIcon, Clock, MapPin, Hash, FilePen } from 'lucide-react';
import SectionCard from '@/components/common/SectionCard';
import EmptyState from '@/components/common/EmptyState';
import HeartButton from '@/components/review/HeartButton';

interface Props {
  coffeeChatData: any;
  membersData: any;
  liked: boolean;
  likeCount: number;
  onLikeToggle: (newLiked: boolean) => void;
}

export default function ViewReviewForm({
  coffeeChatData,
  membersData,
  liked,
  likeCount,
  onLikeToggle,
}: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const renderImages = (imageUrls: string[]) => {
    if (!imageUrls || imageUrls.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2">
        {imageUrls.map((url: string, index: number) => (
          <div key={index} className="w-16 h-16 bg-gray-50 rounded overflow-hidden">
            <img
              src={url}
              alt={`후기 이미지 ${index + 1}`}
              className="w-full h-full object-cover cursor-pointer"
              onClick={() => setSelectedImage(url)}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML =
                  '<div class="w-full h-full flex items-center justify-center text-gray-400 text-lg">✕</div>';
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold truncate">{coffeeChatData.title}</h1>
          <HeartButton liked={liked} likeCount={likeCount} onToggle={onLikeToggle} />
        </div>
        {coffeeChatData.tags && coffeeChatData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {coffeeChatData.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-xs text-xs font-medium"
              >
                <Hash className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}

        <hr className="border-gray-200 my-4" />

        <h2 className="font-semibold mb-4">정보</h2>
        <div className="flex items-center justify-between mb-3 text-gray-500">
          <div className="flex flex-col items-left space-y-1.5 text-sm">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-black">{coffeeChatData.date}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-4 h-4" />
              <span className="text-black">{coffeeChatData.time}</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4" />
              <span className="text-black">{coffeeChatData.address}</span>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-200 my-4" />

      <h2 className="font-semibold mb-4">멤버</h2>
      <ul className="space-y-3">
        {membersData?.members.map((member: any) => (
          <li key={member.memberId} className="flex items-center gap-3">
            {member.profileImageUrl ? (
              <img
                src={member.profileImageUrl}
                alt={member.chatNickname}
                className="w-8 h-8 rounded-full object-cover bg-gray-200"
              />
            ) : (
              <div className="w-8 h-8 flex items-center justify-center bg-gray-300 text-white rounded-full text-base">
                {member.chatNickname}
              </div>
            )}
            <span className="flex items-center gap-1 text-sm">{member.chatNickname}</span>
          </li>
        ))}
      </ul>

      <hr className="border-gray-200 my-4" />

      <h2 className="font-semibold mb-4">참여자 후기</h2>
      {coffeeChatData.reviews.length === 0 ? (
        <EmptyState
          title="아직 작성된 후기가 없어요"
          description="참여자가 후기를 남기면 이곳에 표시됩니다."
          icon={<FilePen className="w-8 h-8" />}
        />
      ) : (
        <div className="space-y-4">
          {coffeeChatData.reviews.map((review: any) => (
            <SectionCard key={review.reviewId}>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-5 h-5 bg-gray-300 rounded-full overflow-hidden">
                  <img
                    src={review.writer.profileImageUrl}
                    alt={review.writer.chatNickname}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-full h-full flex items-center justify-center">
                          <svg class="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                          </svg>
                        </div>`;
                    }}
                  />
                </div>
                <span className="text-sm font-medium">{review.writer.chatNickname}</span>
              </div>

              <p className="text-sm text-[#333333] mb-3">{review.text}</p>

              {renderImages(review.imageUrls)}
            </SectionCard>
          ))}
        </div>
      )}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-10"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="프로필 확대"
            className="max-w-[80svw] max-h-[80svh] rounded-xl shadow-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
