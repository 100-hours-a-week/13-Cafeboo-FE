import { useState, useRef } from 'react';
import { Camera, X, Clock, MapPin, CalendarIcon, Edit, Hash } from 'lucide-react';
import { useToastStore } from '@/stores/toastStore';
import imageCompression from 'browser-image-compression';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  width?: number;
  height?: number;
}

interface Props {
  coffeeChatId: string;
  chatDetail: {
    date: string;
    title: string;
    time: string;
    location: { address: string };
    currentMemberCount: number;
    tags: string[];
  };
  memberId?: string;
  onSubmit: (params: { memberId: string; text: string; images: File[] }) => Promise<void>;
  writeLoading: boolean;
}

export default function WriteReviewForm({
  coffeeChatId,
  chatDetail,
  memberId,
  onSubmit,
  writeLoading,
}: Props) {
  const [content, setContent] = useState<string>('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const showToast = useToastStore((state) => state.showToast);
  const maxLength = 150;

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const MAX_COUNT = 3;
    const MAX_SIZE_MB = 5;

    const fileArray = Array.from(files);
    const remainingSlots = MAX_COUNT - images.length;

    const validFiles = fileArray.slice(0, remainingSlots).filter((file) => {
      if (!file.type.startsWith('image/')) return false;

      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        showToast('error', '사진은 5MB 이하만 업로드 가능합니다.');
        return false;
      }
      return true;
    });

    for (const file of validFiles) {
      try {
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
          initialQuality: 0.8,
        };

        const compressedFile = await imageCompression(file, options);
        const preview = URL.createObjectURL(compressedFile);

        const img = new Image();
        img.onload = () => {
          const newImage: UploadedImage = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            file: compressedFile,
            preview,
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
          setImages((prev) => [...prev, newImage]);
        };
        img.src = preview;
      } catch (error) {
        console.error('이미지 압축 실패:', error);
        showToast('error', '이미지 압축에 실패했습니다.');
      }
    }

    if (event.target) {
      event.target.value = '';
    }
  };

  const removeImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      showToast('error', '내용을 입력하거나 사진을 추가해주세요.');
      return;
    }

    if (!memberId) {
      showToast('error', '로그인 상태를 확인해주세요.');
      return;
    }

    try {
      await onSubmit({
        memberId,
        text: content.trim(),
        images: images.map((img) => img.file),
      });
      setContent('');
      setImages([]);
    } catch (error) {
      showToast('error', '후기 작성에 실패했습니다.');
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
        <div className="flex items-center mb-3 text-gray-500">
          <div className="flex items-left space-x-3 text-sm">
            <div className="flex items-center space-x-1.5">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-black">{chatDetail.date}</span>
            </div>
            <div className="text-gray-300">|</div>
            <div className="flex items-center space-x-1.5">
              <Clock className="w-4 h-4" />
              <span className="text-black">{chatDetail.time}</span>
            </div>          
            <div className="text-gray-300">|</div>
            <div className="flex items-center space-x-1.5">
              <MapPin className="w-4 h-4" />
              <span className="text-black">{chatDetail.location.address}</span>
            </div>
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
          disabled={writeLoading}
        />
        <div className="flex justify-end items-center mt-0.5">
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
                width={image.width}
                height={image.height}
                className="w-18 h-18 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() => removeImage(image.id)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-white text-gray-400 rounded-full border border-gray-300 flex items-center justify-center text-xs hover:bg-gray-100 transition-colors cursor-pointer"
                disabled={writeLoading}
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {images.length < 3 && !writeLoading && (
            <button
              type="button"
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
          disabled={writeLoading}
        />
      </section>

      {/* 작성 버튼 */}
      <section>
        <button
          onClick={handleSubmit}
          className="w-full bg-[#FE9400] text-white py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          disabled={writeLoading}
        >
          {writeLoading ? "작성 중..." : "작성완료"}
        </button>
      </section>
    </div>
  );
}

