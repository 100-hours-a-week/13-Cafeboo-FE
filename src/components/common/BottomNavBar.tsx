import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, User } from 'lucide-react';
import { IoMdCalendar } from 'react-icons/io';
import { VscGraph } from 'react-icons/vsc';
import CoffeeChatMenu from '@/assets/CoffeeChatMenu.svg';

function CoffeeChatIcon({ size = 20, isActive = false }) {
    const activeFilter =
      'invert(17%) sepia(0%) saturate(0%) hue-rotate(180deg) brightness(33%) contrast(92%)';
  
    const inactiveFilter =
      'invert(74%) sepia(14%) saturate(235%) hue-rotate(179deg) brightness(86%) contrast(87%)';
  
    return (
      <img
        src={CoffeeChatMenu}
        alt="커피챗"
        width={size}
        height={size}
        style={{
          filter: isActive ? activeFilter : inactiveFilter,
        }}
      />
    );
  }

const menus = [
  { name: '홈', path: '/', icon: Home },
  { name: '다이어리', path: '/diary', icon: IoMdCalendar },
  { name: '리포트', path: '/report', icon: VscGraph },
  { name: '커피챗', path: '/coffeechat', icon: CoffeeChatIcon },
  { name: '마이페이지', path: '/mypage', icon: User },
];

export default function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleClick = (path: string) => {
    setActivePath(path);
    navigate(path);
  };

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-18 flex border-t border-gray-200 bg-white z-50 max-w-md mx-auto">
        {menus.map(({ name, path, icon: Icon }) => {
        const isActive = activePath === path;
        const color = isActive ? '#333333' : '#9CA3AF';

        return (
            <button
            key={path}
            onClick={() => handleClick(path)}
            className={`flex-1 flex flex-col items-center justify-center text-xs cursor-pointer gap-1 ${
                isActive ? 'text-[#333333] font-semibold' : 'text-gray-400'
            }`}
            >
            {name === '커피챗' ? (
                <CoffeeChatIcon size={22} isActive={isActive} />
            ) : (
                <Icon size={22} color={color} />
            )}
            {name}
            </button>
        );
        })}
    </nav>
  );
}




