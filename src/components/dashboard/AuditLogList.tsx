import { motion } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  FileText,
  PenTool,
  UserCheck,
  LogIn,
  AlertTriangle,
  Shield,
  XCircle,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AuditLog, AuditAction } from '@/types/adsms';

interface AuditLogListProps {
  logs: AuditLog[];
  maxHeight?: string;
}

const actionConfig: Record<AuditAction, { 
  icon: typeof FileText; 
  color: string;
  bgColor: string;
}> = {
  document_uploaded: { icon: FileText, color: 'text-primary', bgColor: 'bg-primary/10' },
  document_viewed: { icon: Eye, color: 'text-muted-foreground', bgColor: 'bg-muted' },
  document_downloaded: { icon: FileText, color: 'text-accent', bgColor: 'bg-accent/10' },
  document_deleted: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  signature_requested: { icon: PenTool, color: 'text-pending', bgColor: 'bg-pending/10' },
  signature_completed: { icon: PenTool, color: 'text-verified', bgColor: 'bg-verified/10' },
  signature_rejected: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10' },
  user_login: { icon: LogIn, color: 'text-verified', bgColor: 'bg-verified/10' },
  user_logout: { icon: LogIn, color: 'text-muted-foreground', bgColor: 'bg-muted' },
  user_created: { icon: UserCheck, color: 'text-accent', bgColor: 'bg-accent/10' },
  user_updated: { icon: UserCheck, color: 'text-primary', bgColor: 'bg-primary/10' },
  certificate_issued: { icon: Shield, color: 'text-verified', bgColor: 'bg-verified/10' },
  certificate_revoked: { icon: AlertTriangle, color: 'text-warning', bgColor: 'bg-warning/10' },
  system_config_changed: { icon: Shield, color: 'text-primary', bgColor: 'bg-primary/10' },
};

function formatActionLabel(action: AuditAction): string {
  return action
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function AuditLogList({ logs, maxHeight = '400px' }: AuditLogListProps) {
  return (
    <Card className="border-0 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">Activity Log</CardTitle>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }}>
          <div className="divide-y divide-border">
            {logs.map((log, index) => {
              const config = actionConfig[log.action];
              const Icon = config.icon;

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="flex items-start gap-3 p-4"
                >
                  <div className={`p-2 rounded-lg ${config.bgColor} mt-0.5`}>
                    <Icon className={`h-4 w-4 ${config.color}`} />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{log.userName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{formatActionLabel(log.action)}</span>
                      {log.ipAddress && (
                        <>
                          <span>•</span>
                          <span>{log.ipAddress}</span>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
