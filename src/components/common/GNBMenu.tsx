import { X, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GNBMenuItem {
  label: string;
  href: string;
  disabled?: boolean;
}

interface GNBMenuProps {
  isOpen: boolean;
  onClose: () => void;
  items: GNBMenuItem[];
}

const GNBMenu = ({ isOpen, onClose, items }: GNBMenuProps) => {
  const navigate = useNavigate();
  
  const handleNavigate = (href: string) => {
    navigate(href);
    onClose();
  };

  const goHome = () => {
    navigate('/main/home');
    onClose();
  };
  
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/50 z-40"
        ></div>
      )}
  
      <div
        className={`absolute top-0 right-0 h-full w-[80%] z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: '#FFFFFF'
        }}
      >
        <div
          className="flex justify-between items-center p-4 border-b"
          style={{
            borderColor: '#E5E7EB',
            backgroundColor: '#FE9400',
          }}
        >
          <button onClick={goHome} className="p-1">
            <Home size={20} className="text-white cursor-pointer" />
          </button>
          <button onClick={onClose} className="p-1">
            <X size={20} className="text-white cursor-pointer" />
          </button>
        </div>
        <nav>
          {items.map((item, idx) => (
            <button
              key={idx}
              onClick={() => !item.disabled && handleNavigate(item.href)}
              disabled={item.disabled}
              className={`w-full text-left px-4 py-3 border-b`}
              style={{
                color: item.disabled 
                  ? '#9CA3AF'
                  : '#000000',
                borderColor:  '#E5E7EB',
                backgroundColor: '#FFFFFF',
                opacity: item.disabled ? 0.5 : 1,
                cursor: item.disabled ? 'not-allowed' : 'pointer'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
};
  
export default GNBMenu;
