import { useState, useRef } from 'react';
import { Plus, Minus, MapPin, Clock, Users, Tag } from 'lucide-react';
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

export default function CoffeeChatForm() {
  const [chatName, setChatName] = useState('');
  const [description, setDescription] = useState('');
  const [nickname, setNickname] = useState('');
  const [time, setTime] = useState('10:00');
  const [participants, setParticipants] = useState(2);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const timeInputRef = useRef<HTMLInputElement | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);

  const incrementParticipants = () => setParticipants(prev => Math.min(30, prev + 1));
  const decrementParticipants = () => setParticipants(prev => Math.max(2, prev - 1));

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

  console.log(location);

  return (
    <div className="min-h-screen">
        {/* Basic Info Section */}
        <div className="bg-white px-6 my-4">
          <div className="space-y-8">
            <div>
              <label className="block font-semibold mb-2">커피챗 이름</label>
              <input
                type="text"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
                placeholder="커피챗 이름을 입력해주세요"
                className="w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FE9400] focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block font-semibold mb-2">상세 내용</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="상세 내용을 입력해 주세요"
                rows={3}
                className="w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:border-[#FE9400] resize-none"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                채팅방 닉네임 <span className="text-sm font-normal text-gray-500">(해당 채팅방에서 사용될 닉네임입니다)</span>
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="예: 커피 좋아하는 개발자"
                className="w-full px-3 py-3 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#FE9400] focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Accordion Section */}
        <div className="bg-white rounded-2xl overflow-hidden my-6 px-6">
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
                  <span className="font-medium text-base">만나는 시간</span>
                </div>
                {time && (
                  <span className="text-gray-500 mr-2">{time}</span>
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

            {/* Participants */}
            <AccordionItem value="participants" className="border-b border-gray-200">
              <AccordionTrigger className="px-2 py-4 hover:no-underline">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Users className="w-5 h-5 text-[#FE9400] mr-3" />
                    <span className="text-base font-medium">모집 인원</span>
                  </div>
                  <span className="text-sm text-gray-500 mr-2">{participants}명</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-4">
                <div className="flex items-center justify-between pt-2">
                  <span className="text-gray-600 text-base">참여 인원 수</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={decrementParticipants}
                      className="w-6 h-6 bg-gray-100 hover:bg-[#FE9400]/20 rounded-full flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-4 h-4 text-gray-600 cursor-pointer" />
                    </button>
                    <span className="text-base font-semibold w-8 text-center">{participants}</span>
                    <button
                      onClick={incrementParticipants}
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
                    <div className="flex flex-wrap gap-1 mr-2">
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
                      onKeyPress={handleKeyPress}
                      placeholder="태그를 입력하세요"
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
                  {location?.address && (
                    <span className="text-sm text-gray-500 mr-2 truncate max-w-32">
                      {location.address}
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-4">
              {location?.detailAddress && (
                <div className="flex justify-between mb-2 items-center">
                  <span className="text-base text-gray-600 mr-2 w-30">
                    도로명 주소
                  </span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="text-sm text-gray-600 pr-2 truncate max-w-50 cursor-pointer">
                        {location.detailAddress}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      sideOffset={8}
                      className="bg-white p-3 z-999 max-w-xs text-sm text-gray-800 rounded-lg shadow-lg border border-gray-200"
                    >
                      {location.detailAddress}
                    </PopoverContent>
                  </Popover>
                </div>
              )}
                <LocationSelector value={location} onChange={setLocation} />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Create Button */}
        <div className="px-6">
          <button className="w-full py-3 bg-[#FE9400] text-white rounded-lg font-semibold cursor-pointer">
            커피챗 생성하기
          </button>
        </div>
    </div>
  );
}
