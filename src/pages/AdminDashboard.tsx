import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Shield, Activity, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

interface UserWithRole {
  user_id: string;
  name: string;
  email: string;
  department: string | null;
  certificate_status: string;
  roles: string[];
}

interface RecentRequest {
  id: string;
  document_title: string;
  signer_name: string;
  signer_email: string;
  requested_at: string;
  status: string;
}

export default function AdminDashboard() {
  const { user, profile, roles } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalDocs: 0, pendingSigs: 0, signedDocs: 0 });
  const [recentRequests, setRecentRequests] = useState<RecentRequest[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roles.includes('admin')) loadDashboard();
  }, [roles]);

  const loadDashboard = async () => {
    setLoading(true);
    const [profilesRes, docsRes, sigsRes, logsRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('documents').select('id, status, title'),
      supabase.from('signature_requests').select('id, status, signer_name, signer_email, requested_at, document_id').order('requested_at', { ascending: false }).limit(10),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('user_roles').select('user_id, role'),
    ]);

    const profilesList = profilesRes.data || [];
    const rolesList = rolesRes.data || [];
    const docs = docsRes.data || [];
    const sigs = sigsRes.data || [];

    setUsers(profilesList.map(p => ({
      user_id: p.user_id,
      name: p.name,
      email: p.email,
      department: p.department,
      certificate_status: p.certificate_status || 'pending',
      roles: rolesList.filter(r => r.user_id === p.user_id).map(r => r.role),
    })));

    // Map requests with document titles
    const docMap = new Map(docs.map(d => [d.id, d.title]));
    setRecentRequests(sigs.map(s => ({
      id: s.id,
      document_title: docMap.get(s.document_id) || 'Unknown',
      signer_name: s.signer_name,
      signer_email: s.signer_email,
      requested_at: s.requested_at,
      status: s.status,
    })));

    setAuditLogs(logsRes.data || []);
    setStats({
      totalUsers: profilesList.length,
      totalDocs: docs.length,
      pendingSigs: sigs.filter(s => s.status === 'pending').length,
      signedDocs: docs.filter(d => d.status === 'signed').length,
    });
    setLoading(false);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    await supabase.from('user_roles').delete().eq('user_id', userId);
    const { error } = await (supabase.from('user_roles') as any).insert({ user_id: userId, role: newRole });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Role updated', description: `User role changed to ${newRole}` });
      loadDashboard();
    }
  };

  if (!roles.includes('admin')) {
    return (
      <DashboardLayout user={{ id: user?.id || '', email: user?.email || '', name: profile?.name || '', role: 'student', certificateStatus: 'pending', createdAt: new Date() } as any} title="Admin">
        <div className="flex items-center justify-center h-96">
          <Card className="max-w-md shadow-card">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You need admin privileges to access this page.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const mockUser = {
    id: user?.id || '', email: user?.email || '', name: profile?.name || '',
    role: 'admin' as const, department: profile?.department,
    certificateStatus: 'active' as const, createdAt: new Date(),
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, bgColor: 'bg-primary/10', iconColor: 'text-primary' },
    { label: 'Pending Requests', value: stats.pendingSigs, icon: Clock, bgColor: 'bg-warning/10', iconColor: 'text-warning' },
    { label: 'Documents', value: stats.totalDocs, icon: FileText, bgColor: 'bg-verified/10', iconColor: 'text-verified' },
    { label: 'Signed Documents', value: stats.signedDocs, icon: Shield, bgColor: 'bg-primary/10', iconColor: 'text-primary' },
  ];

  const statusBadge = (status: string) => {
    if (status === 'pending') return <Badge className="bg-warning/15 text-warning border-0 font-medium">Pending</Badge>;
    if (status === 'completed') return <Badge className="bg-verified/15 text-verified border-0 font-medium">Approved</Badge>;
    if (status === 'rejected') return <Badge className="bg-destructive/15 text-destructive border-0 font-medium">Rejected</Badge>;
    return <Badge variant="secondary">{status}</Badge>;
  };

  return (
    <DashboardLayout user={mockUser as any} title="Admin Dashboard">
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
          {/* Recent Signature Requests */}
          <Card className="lg:col-span-2 shadow-card border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Recent Signature Requests</CardTitle>
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
                  {recentRequests.map(r => (
                    <TableRow key={r.id}>
                      <TableCell className="font-medium text-sm">{r.document_title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.signer_name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(r.requested_at).toLocaleDateString()}</TableCell>
                      <TableCell>{statusBadge(r.status)}</TableCell>
                    </TableRow>
                  ))}
                  {recentRequests.length === 0 && !loading && (
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

        {/* User Management */}
        <Card className="shadow-card border-border/50">
          <CardHeader>
            <CardTitle className="text-base">User Management</CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Certificate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(u => (
                  <TableRow key={u.user_id}>
                    <TableCell className="font-medium">{u.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.email}</TableCell>
                    <TableCell>{u.department || '—'}</TableCell>
                    <TableCell>
                      <Select value={u.roles[0] || 'student'} onValueChange={val => updateUserRole(u.user_id, val)}>
                        <SelectTrigger className="w-28 h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="faculty">Faculty</SelectItem>
                          <SelectItem value="staff">Staff</SelectItem>
                          <SelectItem value="student">Student</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant={u.certificate_status === 'active' ? 'default' : 'secondary'} className={u.certificate_status === 'active' ? 'bg-verified/15 text-verified border-0' : ''}>
                        {u.certificate_status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && !loading && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No users found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
