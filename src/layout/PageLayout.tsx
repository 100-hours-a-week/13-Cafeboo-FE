import Header from '@/components/common/Header';
import FABContainer from "@/components/common/FABContainer";

interface PageLayoutProps {
  children: React.ReactNode;
  headerMode?: 'logo' | 'title';
  headerTitle?: string;
  onBackClick?: () => void;
  mainClassName?: string;
  mainRef?: React.RefObject<HTMLDivElement>;

  fabType?: 'diary' | 'report';
  showAdd?: boolean;
  onMainClick?: () => void;
  onAddClick?: () => void;
}


export default function PageLayout({
  children,
  headerMode = 'logo',
  headerTitle,
  onBackClick,
  mainClassName,
  mainRef,

  fabType,
  showAdd,
  onMainClick,
  onAddClick,
}: PageLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <Header mode={headerMode} title={headerTitle} onBackClick={onBackClick} />

      <main
        id="scroll-container"
        ref={mainRef}
        className={`mt-16 scrollbar-hide overflow-y-auto pb-8 ${
          headerMode === 'title' ? 'px-2' : ''
        }`}
      
      >
        <div id="observer-target" className="h-[1px] w-full opacity-0 pointer-events-none" />
        <div className={`space-y-4 ${mainClassName}`}>
          {children}
        </div>
      </main>

      <FABContainer
        fabType={fabType}
        showAdd={showAdd}
        onMainClick={onMainClick}
        onAddClick={onAddClick}
        scrollTargetSelector="main"
      />
    </div>
  );
}
