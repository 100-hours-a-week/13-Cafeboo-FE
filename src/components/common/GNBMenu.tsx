import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '@/stores/useDarkMode';

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
  const { dark } = useDarkMode();
  
  const handleNavigate = (href: string) => {
    navigate(href);
    onClose();
  };
  
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40"
          style={{
            backgroundColor: dark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.3)'
          }}
        ></div>
      )}
  
      <div
        className={`fixed top-0 right-0 h-full max-w-xs sm:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl shadow-lg z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{
          backgroundColor: dark ? '#2C2C2C' : '#FFFFFF'
        }}
      >
        <div className="flex justify-between items-center p-4 border-b"
          style={{
            borderColor: dark ? '#444444' : '#E5E7EB',
            backgroundColor: '#FFA726',
          }}
        >
          <div className="text-base font-semibold"
            style={{
              color: dark ? '#F5F5F5' : '#000000'
            }}
          >
            user님
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded"
            style={{
              color: dark ? '#F5F5F5' : '#000000'
            }}
          >
            <X size={20} />
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
                  ? (dark ? '#777777' : '#9CA3AF') 
                  : (dark ? '#F5F5F5' : '#333333'),
                borderColor: dark ? '#444444' : '#E5E7EB',
                backgroundColor: dark ? '#2C2C2C' : '#FFFFFF',
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
