import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, XCircle, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function StudentDashboard() {
  const { user, profile, roles } = useAuth();
  const [stats, setStats] = useState({ myDocs: 0, pending: 0, signed: 0, rejected: 0 });
  const [requests, setRequests] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    const [docsRes, sigsRes, logsRes] = await Promise.all([
      supabase.from('documents').select('id, status, title').eq('uploaded_by', user.id),
      supabase.from('signature_requests').select('id, status, signer_name, requested_at, document_id, signer_email').eq('signer_id', user.id).order('requested_at', { ascending: false }).limit(10),
      supabase.from('audit_logs').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10),
    ]);
    const docs = docsRes.data || [];
    const sigs = sigsRes.data || [];

    // Get document titles for requests
    const docIds = [...new Set(sigs.map(s => s.document_id))];
    let docMap = new Map<string, string>();
    if (docIds.length > 0) {
      const { data: docTitles } = await supabase.from('documents').select('id, title').in('id', docIds);
      docMap = new Map((docTitles || []).map(d => [d.id, d.title]));
    }

    setRequests(sigs.map(s => ({ ...s, document_title: docMap.get(s.document_id) || 'Unknown' })));
    setAuditLogs(logsRes.data || []);
    setStats({
      myDocs: docs.length,
      pending: sigs.filter(s => s.status === 'pending').length,
      signed: sigs.filter(s => s.status === 'completed').length,
      rejected: sigs.filter(s => s.status === 'rejected').length,
    });
    setLoading(false);
  };

  const currentUser = {
    id: user?.id || '', email: user?.email || '', name: profile?.name || '',
    role: (roles[0] as any) || 'student', certificateStatus: (profile?.certificate_status as any) || 'pending', createdAt: new Date(),
  };

  const statCards = [
    { label: 'My Documents', value: stats.myDocs, icon: FileText, bgColor: 'bg-primary/10', iconColor: 'text-primary' },
    { label: 'Pending Requests', value: stats.pending, icon: Clock, bgColor: 'bg-warning/10', iconColor: 'text-warning' },
    { label: 'Signed Documents', value: stats.signed, icon: CheckCircle, bgColor: 'bg-verified/10', iconColor: 'text-verified' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, bgColor: 'bg-destructive/10', iconColor: 'text-destructive' },
  ];

  const statusBadge = (status: string) => {
    if (status === 'pending') return <Badge className="bg-warning/15 text-warning border-0 font-medium">Pending</Badge>;
    if (status === 'completed') return <Badge className="bg-verified/15 text-verified border-0 font-medium">Signed</Badge>;
    if (status === 'rejected') return <Badge className="bg-destructive/15 text-destructive border-0 font-medium">Rejected</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <DashboardLayout user={currentUser as any} title="Dashboard" pendingCount={stats.pending}>
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="shadow-card border-border/50">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${s.bgColor}`}>
                    <s.icon className={`h-5 w-5 ${s.iconColor}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{loading ? '—' : s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* My Signature Requests */}
          <Card className="lg:col-span-2 shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-base">My Signature Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Requested To</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-sm">{r.document_title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.signer_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(r.requested_at).toLocaleDateString()}</TableCell>
                      <TableCell>{statusBadge(r.status)}</TableCell>
                    </TableRow>
                  ))}
                  {requests.length === 0 && !loading && (
                    <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No requests yet</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {auditLogs.map(log => (
                  <div key={log.id} className="flex gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="mt-0.5">
                      <Activity className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{log.action.replace(/_/g, ' ')}</p>
                      <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(log.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {auditLogs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
