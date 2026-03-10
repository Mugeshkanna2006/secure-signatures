import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Shield, Activity, TrendingUp, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export default function AdminDashboard() {
  const { user, profile, roles } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [stats, setStats] = useState({ totalUsers: 0, totalDocs: 0, pendingSigs: 0, activeCerts: 0 });
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (roles.includes('admin')) {
      loadDashboard();
    }
  }, [roles]);

  const loadDashboard = async () => {
    setLoading(true);
    const [profilesRes, docsRes, sigsRes, certsRes, logsRes, rolesRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('documents').select('id, status'),
      supabase.from('signature_requests').select('id, status'),
      supabase.from('certificates').select('id, status'),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20),
      supabase.from('user_roles').select('user_id, role'),
    ]);

    const profilesList = profilesRes.data || [];
    const rolesList = rolesRes.data || [];
    
    const usersWithRoles: UserWithRole[] = profilesList.map(p => ({
      user_id: p.user_id,
      name: p.name,
      email: p.email,
      department: p.department,
      certificate_status: p.certificate_status || 'pending',
      roles: rolesList.filter(r => r.user_id === p.user_id).map(r => r.role),
    }));

    setUsers(usersWithRoles);
    setAuditLogs(logsRes.data || []);
    setStats({
      totalUsers: profilesList.length,
      totalDocs: (docsRes.data || []).length,
      pendingSigs: (sigsRes.data || []).filter(s => s.status === 'pending').length,
      activeCerts: (certsRes.data || []).filter(c => c.status === 'active').length,
    });
    setLoading(false);
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    // Remove existing roles then add new one
    await supabase.from('user_roles').delete().eq('user_id', userId);
    const { error } = await supabase.from('user_roles').insert({
      user_id: userId,
      role: newRole,
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Role updated', description: `User role changed to ${newRole}` });
      loadDashboard();
    }
  };

  if (!roles.includes('admin')) {
    return (
      <AppLayout user={{ id: user?.id || '', email: user?.email || '', name: profile?.name || '', role: 'student', certificateStatus: 'pending', createdAt: new Date() } as any} title="Admin">
        <div className="flex items-center justify-center h-96">
          <Card className="max-w-md">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You need admin privileges to access this page.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </AppLayout>
    );
  }

  const mockUser = {
    id: user?.id || '',
    email: user?.email || '',
    name: profile?.name || '',
    role: 'admin' as const,
    department: profile?.department,
    certificateStatus: 'active' as const,
    createdAt: new Date(),
  };

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-accent' },
    { label: 'Documents', value: stats.totalDocs, icon: FileText, color: 'text-primary' },
    { label: 'Pending Signatures', value: stats.pendingSigs, icon: Activity, color: 'text-warning' },
    { label: 'Active Certificates', value: stats.activeCerts, icon: Shield, color: 'text-verified' },
  ];

  return (
    <AppLayout user={mockUser as any} title="Admin Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card>
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-muted ${s.color}`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{loading ? '...' : s.value}</p>
                    <p className="text-sm text-muted-foreground">{s.label}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Management */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
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
                        <Badge variant={u.certificate_status === 'active' ? 'verified' : u.certificate_status === 'expired' ? 'destructive' : 'secondary'}>
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

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {auditLogs.map(log => (
                  <div key={log.id} className="flex flex-col gap-1 pb-3 border-b border-border last:border-0">
                    <p className="text-sm font-medium">{log.action.replace(/_/g, ' ')}</p>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                    <p className="text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</p>
                  </div>
                ))}
                {auditLogs.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No activity yet</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
