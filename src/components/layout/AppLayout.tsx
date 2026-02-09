import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { User } from '@/types/adsms';

interface AppLayoutProps {
  children: ReactNode;
  user: User;
  title?: string;
  headerContent?: ReactNode;
  pendingCount?: number;
}

export function AppLayout({ 
  children, 
  user, 
  title, 
  headerContent,
  pendingCount = 0 
}: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar user={user} pendingCount={pendingCount} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header user={user} title={title}>
          {headerContent}
        </Header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
