import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  PenTool,
  Search,
  Users,
  Shield,
  Settings,
  History,
  ChevronLeft,
  ChevronRight,
  LogOut,
  HelpCircle,
  Bell,
  FileSignature
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, UserRole } from '@/types/adsms';

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

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Documents', icon: FileText, href: '/documents' },
  { label: 'Sign Documents', icon: PenTool, href: '/sign' },
  { label: 'Verify', icon: Search, href: '/verify' },
  { label: 'Audit Logs', icon: History, href: '/audit' },
  { label: 'Users', icon: Users, href: '/users', roles: ['admin'] },
  { label: 'Certificates', icon: Shield, href: '/certificates', roles: ['admin'] },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export function Sidebar({ user, pendingCount = 0 }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const filteredNavItems = navItems.filter(
    item => !item.roles || item.roles.includes(user.role)
  );

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ duration: 0.2 }}
      className="h-screen bg-sidebar flex flex-col border-r border-sidebar-border"
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                <FileSignature className="h-5 w-5 text-accent-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sidebar-foreground">ADSMS</span>
                <span className="text-[10px] text-sidebar-foreground/60">Digital Signatures</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center mx-auto">
            <FileSignature className="h-5 w-5 text-accent-foreground" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          const showBadge = item.label === 'Sign Documents' && pendingCount > 0;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <Icon className={cn(
                'h-5 w-5 flex-shrink-0',
                isActive ? 'text-accent' : 'text-sidebar-foreground/70 group-hover:text-sidebar-foreground'
              )} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="text-sm font-medium whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {showBadge && (
                <Badge 
                  variant="info" 
                  className={cn(
                    'ml-auto text-[10px] h-5 min-w-5 flex items-center justify-center',
                    collapsed && 'absolute -top-1 -right-1'
                  )}
                >
                  {pendingCount}
                </Badge>
              )}
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 w-1 h-6 bg-accent rounded-r-full"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <div className={cn(
          'flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent/50',
          collapsed && 'justify-center'
        )}>
          <Avatar className="h-9 w-9 border-2 border-accent/20">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-accent text-accent-foreground text-sm">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <AnimatePresence mode="wait">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60 capitalize">
                  {user.role}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="w-full justify-center text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              <span>Collapse</span>
            </>
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
