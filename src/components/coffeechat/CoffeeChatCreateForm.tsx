import { useState, useRef } from 'react';
import { Plus, Minus, MapPin, Clock, Users, Tag, Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import LocationSelector, { LocationData } from '@/components/coffeechat/LocationSelector';
import { extractAreaUnit } from '@/utils/parseUtils';
import { format, setMinutes, addHours } from 'date-fns';
import { z } from 'zod';
import type { CreateCoffeeChatRequestDTO } from '@/api/coffeechat/coffeechat.dto';

const isFutureTime = (inputTime: string) => {
  if (!/^\d{2}:\d{2}$/.test(inputTime)) return false;
  const [inputHour, inputMinute] = inputTime.split(':').map(Number);

  const now = new Date();
  const nowHour = now.getHours();
  const nowMinute = now.getMinutes();

  if (inputHour > nowHour) return true;
  if (inputHour === nowHour && inputMinute > nowMinute) return true;
  return false;
};

const CoffeeChatSchema = z.object({
  title: z.string().min(1, '커피챗 이름을 입력하세요').max(20, '최대 20자까지 입력 가능'),
  content: z.string().min(1, '상세 내용을 입력하세요').max(200, '최대 200자까지 입력 가능'),
  chatNickname: z.string().min(1, '채팅방 닉네임을 입력하세요').max(10, '최대 10자까지 입력 가능'),
  memberCount: z.number().min(2).max(30),
  tags: z.array(z.string().max(15)).max(5, '태그는 최대 5개까지 등록 가능합니다').optional(),
  time: z.string()
  .min(1, "만나는 시간을 선택하세요.")
  .refine(isFutureTime, { message: "현재 시간 이후로만 설정할 수 있습니다." }),
  location: z.object({
    address: z.string().min(1, "주소를 선택해 주세요."),
    latitude: z.number().min(1, "위도를 선택해 주세요."),
    longitude: z.number().min(1, "경도를 선택해 주세요."),
    kakaoPlaceUrl: z.string().min(1, "카카오맵 링크를 선택해 주세요."),
  })
});


export default function CoffeeChatForm({
  onSubmit,
}: {
  onSubmit: (data: CreateCoffeeChatRequestDTO) => void;
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [chatNickname, setChatNickname] = useState('');
  const [profileImageType, setProfileImageType] = useState('DEFAULT');
  const [time, setTime] = useState(format(addHours(setMinutes(new Date(), 0), 1), 'HH:mm'));
  const [memberCount, setMemberCount] = useState(2);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const timeInputRef = useRef<HTMLInputElement | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);

  const incrementmemberCount = () => setMemberCount(prev => Math.min(30, prev + 1));
  const decrementmemberCount = () => setMemberCount(prev => Math.max(2, prev - 1));

  const addTag = () => {
    const cleaned = newTag.trim().replace(/^#/, '');
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = () => {
    if (!location) {
      alert('만나는 장소를 선택해 주세요.');
      return;
    }
    const data = {
      title,
      content,
      chatNickname,
      memberCount: Number(memberCount),
      tags,
      time,
      location: location
        ? {
            address: extractAreaUnit(location.detailAddress),
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            kakaoPlaceUrl: location.kakaoPlaceUrl 
          }
        : undefined,
    };
  
    const result = CoffeeChatSchema.safeParse(data);
    if (!result.success) {
      alert(result.error.issues[0].message);
      return;
    }

    const payload: CreateCoffeeChatRequestDTO = {
      title,
      content,
      date: format(new Date(), 'yyyy-MM-dd'),               
      time,
      memberCount,
      tags: tags ?? [],    
      location:  {
        address: extractAreaUnit(location.detailAddress),
        latitude: location.latitude,
        longitude: location.longitude,
        kakaoPlaceUrl: location.kakaoPlaceUrl
      },
      chatNickname,
      profileImageType,
    };
  
    onSubmit(payload);
  };

  return (
    <div className="min-h-screen">
        {/* Basic Info Section */}
        <div className="bg-white px-4 mt-2 mb-8">
          <div className="space-y-8">
            <div>
              <label className="block font-semibold mb-2">커피챗 이름</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={20}
                placeholder="커피챗 이름을 입력해 주세요(최대 20자)"
                className="w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FE9400] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2">상세 내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="상세 내용을 입력해 주세요(최대 200자)"
                rows={3}
                maxLength={200}
                className="w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#FE9400] resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                채팅방 닉네임
              </label>
              <input
                type="text"
                value={chatNickname}
                onChange={(e) => setChatNickname(e.target.value)}
                maxLength={10}
                placeholder="닉네임을 입력해 주세요(최대 10자)"
                className="w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FE9400] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                채팅방 프로필
              </label>
              <p className="text-sm text-gray-500 mb-2">
                내 프로필이 없으면 기본 프로필로 표시됩니다
              </p>
              <div className="space-y-2">
                <div 
                  onClick={() => setProfileImageType('DEFAULT')}
                  className={`flex items-center justify-between px-4 py-3 border rounded-sm cursor-pointer transition-colors ${
                    profileImageType === 'DEFAULT' 
                      ? 'border-[#FE9400] bg-[#FE9400]/5' 
                      : 'border-gray-200 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                        'border-gray-300'
                      }`}
                    >
                      {profileImageType === 'DEFAULT' && (
                        <div className="w-1.5 h-1.5 bg-[#FE9400] rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-[#333333]">기본 프로필</span>
                  </div>
                </div>
                <div 
                  onClick={() => setProfileImageType('USER')}
                  className={`flex items-center justify-between px-4 py-3 border rounded-sm cursor-pointer transition-colors ${
                    profileImageType === 'USER' 
                      ? 'border-[#FE9400] bg-[#FE9400]/5' 
                      : 'border-gray-200 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                        'border-gray-300'
                      }`}
                    >
                      {profileImageType === 'USER' && (
                        <div className="w-1.5 h-1.5 bg-[#FE9400] rounded-full"></div>
                      )}
                    </div>
                    <span className="font-medium text-[#333333]">내 프로필</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Section */}
        <div className="bg-white rounded-2xl overflow-hidden my-6 px-4">
          <Accordion type="multiple" className="w-full">
            {/* Time */}
            <AccordionItem value="time" className="border-b border-gray-200">
            <AccordionTrigger
              className="px-2 py-4 hover:no-underline"
              onClick={(e) => {
                e.preventDefault();
                timeInputRef.current?.showPicker?.(); 
                timeInputRef.current?.focus();
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-[#FE9400] mr-3" />
                  <span className="font-medium text-base">만나는 시각</span>
                </div>
                {time && (
                  <span className="text-gray-500 mr-1">{time}</span>
                )}
              </div>
            </AccordionTrigger>

            {/* 숨겨진 input */}
            <input
              ref={timeInputRef}
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="sr-only"
            />
          </AccordionItem>

            {/* memberCount */}
            <AccordionItem value="memberCount" className="border-b border-gray-200">
              <AccordionTrigger className="px-2 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-[#FE9400] mr-3" />
                    <span className="text-base font-medium">모집 인원</span>
                  </div>
                  <span className="text-sm text-gray-500 mr-1">{memberCount}명</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-4">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-gray-600 text-base">참여 인원 수</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={decrementmemberCount}
                      className="w-6 h-6 bg-gray-100 hover:bg-[#FE9400]/20 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600 cursor-pointer" />
                    </button>
                    <span className="text-base font-semibold w-8 text-center">{memberCount}</span>
                    <button
                      onClick={incrementmemberCount}
                      className="w-6 h-6 bg-gray-100 hover:bg-[#FE9400]/20 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-4 h-4 text-gray-600 cursor-pointer" />
                    </button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Tags */}
            <AccordionItem value="tags" className="border-b border-gray-200">
              <AccordionTrigger className="px-2 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Tag className="w-5 h-5 text-[#FE9400] mr-3" />
                    <span className="text-base font-medium">태그</span>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mr-1">
                      {tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 text-xs rounded-xs max-w-[60px] truncate inline-block">
                          # {tag}
                        </span>
                      ))}
                      {tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-xs">
                          +{tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-4">
                <div className="pt-2 space-y-3">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      maxLength={15}
                      onKeyPress={handleKeyPress}
                      placeholder="태그를 입력하세요(최대 15자)"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-[#FE9400]"
                    />
                    <button
                      onClick={addTag}
                      className="px-4 py-2 bg-[#FE9400] text-white rounded cursor-pointer"
                    >
                      추가
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded-xs text-sm flex items-center cursor-pointer"
                        >
                          # {tag}

                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-gray-400 cursor-pointer"
                          >
                          <Plus className="w-3 h-3 ml-1 rotate-45" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Location */}
            <AccordionItem value="location">
              <AccordionTrigger className="px-2 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-[#FE9400] mr-3" />
                    <span className="text-base font-medium">만나는 장소</span>
                  </div>
                  {location?.placeName && location?.detailAddress && (
                    <div className="flex items-center">
                    {/* placeName 제대로 표시 */}
                    <span className="text-sm text-gray-500 truncate max-w-32">
                      {location.placeName}
                    </span>
                    <Popover>
                      <PopoverTrigger
                        asChild
                        onClick={e => {
                          e.stopPropagation();
                        }}
                      >
                        <span 
                          className="ml-1 text-gray-400 hover:text-[#FE9400] focus:outline-none"
                          tabIndex={0}
                          aria-label="장소 정보 보기"
                        >
                          <Info className="w-4 h-4" />
                        </span >
                      </PopoverTrigger>
                      <PopoverContent className="w-70 z-[100]" sideOffset={10}>
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#FE9400]/10 rounded-full flex items-center justify-center">
                              <MapPin className="w-5 h-5 text-[#FE9400]" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500">위치</p>
                              <p className="font-medium text-gray-800">{extractAreaUnit(location.detailAddress)}</p>
                            </div>
                          </div>
                          <div className="mt-3 pt-3 border-t border-[#d0ced3]">
                            <p className="font-semibold text-gray-800">{location.placeName}</p>
                            <p className="text-sm text-gray-500 mt-1">{location.detailAddress}</p>
                          </div>
                      </PopoverContent>
                    </Popover>
                    </div>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-4">
                <LocationSelector value={location} onChange={setLocation} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Create Button */}
        <div className="px-6">
          <button className="w-full py-3 bg-[#FE9400] text-white rounded-lg font-semibold cursor-pointer" onClick={handleSubmit}>
            커피챗 생성하기
          </button>
        </div>
    </div>
  );
}
