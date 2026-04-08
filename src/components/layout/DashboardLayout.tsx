import { ReactNode } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { Header } from './Header';
import { User } from '@/types/adsms';

interface DashboardLayoutProps {
  children: ReactNode;
  user: User;
  title?: string;
  headerContent?: ReactNode;
  pendingCount?: number;
}

export function DashboardLayout({ children, user, title, headerContent, pendingCount = 0 }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <DashboardSidebar user={user} pendingCount={pendingCount} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
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
