import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X, Clock, MapPin, Users, Edit, Hash } from 'lucide-react';
import { useCoffeeChatDetail } from "@/api/coffeechat/coffeechatApi";
import { useCoffeeChatMembership } from '@/api/coffeechat/coffeechatMemberApi';
import { useWriteCoffeeChatReview } from '@/api/coffeechat/coffeechatReviewApi';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

interface Props {
  coffeeChatId: string;
}

export default function WriteReviewForm({ coffeeChatId }: Props) {  
  const navigate = useNavigate();
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const maxLength = 150;
  const {
    data: chatDetail,
    isLoading: isChatLoading,
    isError: isChatError,
  } = useCoffeeChatDetail(coffeeChatId);

  const {
    mutateAsyncFn,
    isLoading,
    isError: isSubmitError,
    error: submitError,
  } = useWriteCoffeeChatReview(coffeeChatId);

  const {
    data: membership,
    isLoading: isMembershipLoading,
    isError: isMembershipError,
  } = useCoffeeChatMembership(coffeeChatId);

  // 로딩 처리
  if (isChatLoading || isMembershipLoading) {
    return <div className="text-center text-sm text-gray-500">로딩 중...</div>;
  }

  // 에러 처리
  if (isChatError || isMembershipError || !chatDetail || !membership?.isMember || !membership.memberId) {
    return (
      <div className="text-center text-red-500 text-sm">
        후기를 작성하려면 커피챗에 참여해야 합니다.
      </div>
    );
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const preview = e.target?.result as string;
          const newImage: UploadedImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file,
            preview
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
    
    // Reset input
    if (event.target) {
      event.target.value = '';
    }
  };

  const removeImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      alert('내용을 입력하거나 사진을 추가해주세요.');
      return;
    }
    try {
      await mutateAsyncFn({
        memberId: membership.memberId!,
        text: content.trim(),
        images: images.map((img) => img.file),
      });
      alert('후기 작성이 완료되었습니다.');
      navigate('/main/coffeechat');
    } catch (error) {
      console.error("후기 작성 실패:", submitError?.message);
    }
  };

  return (
    <div className="space-y-8">
      {/* 보상 정보 섹션 */}
      <section>
        <div className="flex border border-gray-300 overflow-hidden py-2 text-sm text-gray-600 rounded-sm bg-gray-50">
          {/* 일반 후기 */}
          <div className="flex-1 flex items-center justify-between px-3 py-1">
            <div className="flex-1 flex items-center">
              <Edit size={16} className="mr-1.5" />
              <span className="font-medium">일반 후기</span>
            </div>
            <span className="ml-1 text-xs">커피콩 1개</span>
          </div>

          {/* 사진 후기 */}
          <div className="flex-1 flex items-center justify-between px-3 py-1 border-l border-gray-300">
            <div className="flex-1 flex items-center">
              <Camera size={16} className="mr-1.5" />
              <span className="font-medium">사진 후기</span>
            </div>
            <span className="ml-1 text-xs">커피콩 3개</span>
          </div>
        </div>
      </section>

      {/* 커피챗 정보 섹션 */}
      <section>
      <h1 className="text-lg font-semibold mb-2">{chatDetail.title}</h1>
        <div className="flex items-center text-gray-500 text-sm space-x-3 mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>{chatDetail.time}</span>
          </div>
          <div className="text-gray-500">|</div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{chatDetail.location.address}</span>
          </div>
          <div className="text-gray-500">|</div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{chatDetail.currentMemberCount}명</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
            {chatDetail.tags.map((tag: string, index: number) => (
              <span
                key={index}
                className="inline-flex items-center bg-gray-100 text-gray-600 px-2 py-1 rounded-xs text-xs font-medium"
              >
                <Hash className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
        </div>
      </section>

      {/* 후기 작성 영역 */}
      <section>
        <h3 className="font-semibold mb-3">후기 내용</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="후기를 작성해 주세요"
          className="w-full h-32 p-3 border border-gray-200 rounded-sm resize-none focus:outline-none focus:border-[#FE9400] text-sm"
          maxLength={maxLength}
        />
        <div className="flex justify-end items-center mt-1">
          <span className="text-xs text-gray-400">
            {content.length}/{maxLength}
          </span>
        </div>
      </section>

      {/* 사진 업로드 섹션 */}
      <section>
        <h3 className="font-semibold mb-3">사진</h3>
        <p className="text-sm text-[#595959] mb-4">
          커피콩 2개 추가 지급 / 5MB 이내 (최대 3개)
        </p>

        <div className="flex flex-wrap gap-3">
          {images.map((image) => (
            <div key={image.id} className="relative">
              <img
                src={image.preview}
                alt="업로드된 이미지"
                className="w-18 h-18 object-cover rounded-lg border border-gray-200"
              />
              <button
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-white text-gray-400 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {images.length < 3 && (
            <button
              onClick={triggerFileInput}
              className="w-18 h-18 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-300 hover:border-gray-400 hover:text-gray-400 transition-colors cursor-pointer"
            >
              <Camera size={20} />
              <span className="text-xs mt-1">사진 첨부</span>
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </section>

      {/* 작성 버튼 */}
      <section>
        <button
          onClick={handleSubmit}
          className="w-full bg-[#FE9400] text-white py-3 rounded-lg transition-colors cursor-pointer"
        >
          작성완료
        </button>
      </section>
    </div>
  );
}