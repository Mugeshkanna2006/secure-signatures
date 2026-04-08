import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, PenTool, Search, Users, Shield,
  Settings, History, ChevronLeft, ChevronRight, LogOut, ShieldCheck,
  FileCheck, BarChart3, UserCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, UserRole } from '@/types/adsms';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  user: User;
  pendingCount?: number;
}

interface NavItem {
  label: string;
  icon: typeof LayoutDashboard;
  href: string;
  badge?: number;
  roles?: UserRole[];
}

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Users', icon: Users, href: '/admin' },
  { label: 'Documents', icon: FileText, href: '/documents' },
  { label: 'Signature Requests', icon: PenTool, href: '/sign' },
  { label: 'Signed Documents', icon: FileCheck, href: '/documents?status=signed' },
  { label: 'Audit Logs', icon: History, href: '/audit' },
  { label: 'Reports', icon: BarChart3, href: '/reports' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

const studentNavItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'My Documents', icon: FileText, href: '/documents' },
  { label: 'Signature Requests', icon: PenTool, href: '/sign' },
  { label: 'Signed Documents', icon: FileCheck, href: '/documents?status=signed' },
  { label: 'Profile', icon: UserCircle, href: '/settings' },
];

export function DashboardSidebar({ user, pendingCount = 0 }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, roles } = useAuth();

  const isAdmin = roles.includes('admin');
  const navItems = isAdmin ? adminNavItems : studentNavItems;

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 72 : 256 }}
      transition={{ duration: 0.2 }}
      className="h-screen bg-sidebar flex flex-col border-r border-sidebar-border flex-shrink-0"
    >
      {/* Logo */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-sidebar-primary-foreground" />
              </div>
              <span className="font-bold text-sidebar-foreground text-sm tracking-wide">ADSMS</span>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-9 h-9 rounded-lg bg-sidebar-primary flex items-center justify-center mx-auto">
            <ShieldCheck className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
            {isAdmin ? 'Administration' : 'Menu'}
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href.split('?')[0]));
          const showBadge = item.label === 'Signature Requests' && pendingCount > 0;

          return (
            <Link key={item.href + item.label} to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent'
              )}>
              <Icon className="h-[18px] w-[18px] flex-shrink-0" />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: 'auto' }} exit={{ opacity: 0, width: 0 }} className="text-sm font-medium whitespace-nowrap">
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {showBadge && (
                <Badge className={cn(
                  'ml-auto text-[10px] h-5 min-w-5 flex items-center justify-center bg-destructive text-destructive-foreground border-0',
                  collapsed && 'absolute -top-1 -right-1'
                )}>
                  {pendingCount}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-sidebar-border">
        <div className={cn('flex items-center gap-3 p-2 rounded-lg', collapsed && 'justify-center')}>
          <Avatar className="h-9 w-9 border-2 border-sidebar-accent">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-xs font-semibold">
              {user.name ? user.name.split(' ').map(n => n[0]).join('') : '?'}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 min-w-0">
                <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
                <p className="text-xs text-sidebar-foreground/50 capitalize">{user.role}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="flex gap-1 mt-2">
          <Button variant="ghost" size="sm" onClick={handleSignOut}
            className="flex-1 justify-center text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2 text-xs">Sign out</span>}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent">
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </motion.aside>
  );
}
