import Header from '@/components/common/Header';
import FABContainer from "@/components/common/FABContainer";
import BottomNavBar from '@/components/common/BottomNavBar';
import { Member } from '@/components/coffeechat/GroupMemberMenu';

interface PageLayoutProps {
  children: React.ReactNode;
  headerMode?: 'logo' | 'title';
  headerTitle?: string;
  showGuestModeBanner?: boolean;
  onBackClick?: () => void;
  isGroupChat?: boolean;
  chatMembers?: Member[];
  onLeaveChat?: () => void;
  onDeleteChat?: () => void;
  myMemberId?: string;
  mainClassName?: string;
  nonScrollClassName?: boolean;
  mainRef?: React.RefObject<HTMLDivElement>;

  showAdd?: boolean;
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

  showAdd,
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
        className={`
          mt-14 scrollbar-hide pb-28 h-[calc(100dvh-7.5rem-env(safe-area-inset-bottom)) 
          ${headerMode === 'title' ? 'px-2' : 'pt-2 mb-18'} 
          ${nonScrollClassName ? '!pb-0' : 'overflow-y-auto'}
        `}
      
      >
        <div id="observer-target" className="h-[1px] w-full opacity-0 pointer-events-none" />
        <div className={`space-y-4 ${mainClassName}`}>
          {children}
        </div>
      </main>

      <FABContainer
        showAdd={showAdd}
        onAddClick={onAddClick}
        scrollTargetSelector="main"
      />
      {headerMode !== 'title' && <BottomNavBar />}
    </div>
  );
}
