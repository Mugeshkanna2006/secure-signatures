import { useEffect, useState } from 'react';
import { Search, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuditLogList } from '@/components/dashboard/AuditLogList';
import { AuditLog } from '@/types/adsms';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Audit = () => {
  const { user, profile, roles } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => { loadLogs(); }, [user]);

  const loadLogs = async () => {
    if (!user) return;
    const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(100);
    if (data) {
      setLogs(data.map(l => ({
        id: l.id,
        timestamp: new Date(l.created_at),
        userId: l.user_id || '',
        userName: l.user_name,
        action: l.action as any,
        resourceType: l.resource_type as any,
        resourceId: l.resource_id,
        details: l.details,
        ipAddress: l.ip_address || undefined,
      })));
    }
  };

  const currentUser = {
    id: user?.id || '', email: user?.email || '', name: profile?.name || '',
    role: (roles[0] as any) || 'student', certificateStatus: 'active' as const, createdAt: new Date(),
  };

  const filteredLogs = searchTerm
    ? logs.filter(l => l.details.toLowerCase().includes(searchTerm.toLowerCase()) || l.userName.toLowerCase().includes(searchTerm.toLowerCase()))
    : logs;

  return (
    <AppLayout user={currentUser as any} title="Audit Logs" pendingCount={0}>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search audit logs..." className="pl-9" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40"><SelectValue placeholder="Action Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="document">Document</SelectItem>
              <SelectItem value="signature">Signature</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Download className="h-4 w-4 mr-2" />Export</Button>
        </div>
        <AuditLogList logs={filteredLogs} maxHeight="calc(100vh - 280px)" />
      </div>
    </AppLayout>
  );
};

export default Audit;
