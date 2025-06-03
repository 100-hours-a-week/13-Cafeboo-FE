import Header from '@/components/common/Header';

interface PageLayoutProps {
  children: React.ReactNode;
  headerMode?: 'logo' | 'title';
  headerTitle?: string;
  onBackClick?: () => void;
  mainClassName?: string;
  mainRef?: React.RefObject<HTMLDivElement>;
}

export default function PageLayout({
  children,
  headerMode = 'logo',
  headerTitle,
  onBackClick,
  mainClassName,
  mainRef,
}: PageLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      <Header mode={headerMode} title={headerTitle} onBackClick={onBackClick} />
      <main ref={mainRef} className={`mt-16 space-y-4 scrollbar-hide overflow-y-auto pb-8 ${mainClassName}`}>
        {children}
      </main>
    </div>
  );
}
