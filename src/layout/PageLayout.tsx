import Header from '@/components/common/Header';
import FABContainer from "@/components/common/FABContainer";
import { Member } from '@/components/coffeechat/GroupMemberMenu';

interface PageLayoutProps {
  children: React.ReactNode;
  headerMode?: 'logo' | 'title';
  headerTitle?: string;
  onBackClick?: () => void;
  isGroupChat?: boolean;
  chatMembers?: Member[];
  onLeaveChat?: () => void;
  onDeleteChat?: () => void;
  myMemberId?: string;
  mainClassName?: string;
  nonScrollClassName?: boolean;
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
  nonScrollClassName = false,
  mainRef,

  fabType,
  showAdd,
  onMainClick,
  onAddClick,

  isGroupChat,
  chatMembers,
  onLeaveChat,
  onDeleteChat,
  myMemberId,
}: PageLayoutProps) {
  return (
    <div className="flex flex-col h-full">
    <Header
      mode={headerMode}
      title={headerTitle}
      onBackClick={onBackClick}
      isGroupChat={isGroupChat}         
      chatMembers={chatMembers}      
      onLeaveChat={onLeaveChat}
      onDeleteChat={onDeleteChat}
      myMemberId={myMemberId}         
    />

      <main
        id="scroll-container"
        ref={mainRef}
        className={`mt-14 scrollbar-hide pb-12 h-[calc(100svh-3.5rem)] ${headerMode === 'title' ? 'px-2' : ''} ${nonScrollClassName ? '!pb-0' : 'overflow-y-auto'}`}
      
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
