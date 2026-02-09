import { motion } from 'framer-motion';
import { 
  FileText, 
  PenTool, 
  Clock, 
  XCircle, 
  Users, 
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardStats } from '@/types/adsms';

interface StatsCardsProps {
  stats: DashboardStats;
}

const statsConfig = [
  {
    key: 'totalDocuments' as const,
    title: 'Total Documents',
    icon: FileText,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    trend: '+12%',
    trendUp: true,
  },
  {
    key: 'pendingSignatures' as const,
    title: 'Pending Signatures',
    icon: Clock,
    color: 'text-pending',
    bgColor: 'bg-pending/10',
    trend: '-3',
    trendUp: false,
  },
  {
    key: 'completedToday' as const,
    title: 'Completed Today',
    icon: PenTool,
    color: 'text-verified',
    bgColor: 'bg-verified/10',
    trend: '+5',
    trendUp: true,
  },
  {
    key: 'rejectedDocuments' as const,
    title: 'Rejected',
    icon: XCircle,
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    trend: '-2',
    trendUp: false,
  },
  {
    key: 'activeUsers' as const,
    title: 'Active Users',
    icon: Users,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    trend: '+18',
    trendUp: true,
  },
  {
    key: 'expiringCertificates' as const,
    title: 'Expiring Soon',
    icon: AlertTriangle,
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    trend: '5 certs',
    trendUp: false,
  },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsConfig.map((stat, index) => {
        const Icon = stat.icon;
        const value = stats[stat.key];
        
        return (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="card-interactive border-0 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <div className="flex items-center gap-1 mt-1">
                  {stat.trendUp ? (
                    <ArrowUpRight className="h-3 w-3 text-verified" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-muted-foreground" />
                  )}
                  <span className={`text-xs ${stat.trendUp ? 'text-verified' : 'text-muted-foreground'}`}>
                    {stat.trend}
                  </span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
