import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, User, Shield, Bell, Palette } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const { user, profile, roles, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [studentId, setStudentId] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setDepartment(profile.department || '');
      setEmployeeId(profile.employee_id || '');
      setStudentId(profile.student_id || '');
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      name,
      department,
      employee_id: employeeId,
      student_id: studentId,
    }).eq('user_id', user.id);
    setSaving(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      await refreshProfile();
      toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
    }
  };

  const mockUser = {
    id: user?.id || '',
    email: user?.email || '',
    name: profile?.name || '',
    role: (roles[0] as any) || 'student',
    department: profile?.department,
    certificateStatus: (profile?.certificate_status as any) || 'pending',
    createdAt: new Date(),
  };

  return (
    <AppLayout user={mockUser as any} title="Settings">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto">
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile"><User className="h-4 w-4 mr-2" />Profile</TabsTrigger>
            <TabsTrigger value="security"><Shield className="h-4 w-4 mr-2" />Security</TabsTrigger>
            <TabsTrigger value="notifications"><Bell className="h-4 w-4 mr-2" />Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details and department info</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={user?.email || ''} disabled className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Select value={department} onValueChange={setDepartment}>
                      <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                      <SelectContent>
                        {['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical', 'Mathematics', 'Physics', 'Administration'].map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <Input value={employeeId} onChange={e => setEmployeeId(e.target.value)} placeholder="FAC-2024-001" />
                  </div>
                  <div className="space-y-2">
                    <Label>Student ID</Label>
                    <Input value={studentId} onChange={e => setStudentId(e.target.value)} placeholder="STU-2024-001" />
                  </div>
                  <div className="space-y-2">
                    <Label>Role</Label>
                    <Input value={roles.join(', ') || 'student'} disabled className="bg-muted capitalize" />
                  </div>
                </div>
                <Separator />
                <Button onClick={handleSaveProfile} disabled={saving}>
                  <Save className="h-4 w-4 mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your password and certificate</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Certificate Status</Label>
                  <Input value={profile?.certificate_status || 'pending'} disabled className="bg-muted capitalize" />
                </div>
                <div className="space-y-2">
                  <Label>Certificate Expiry</Label>
                  <Input value={profile?.certificate_expiry ? new Date(profile.certificate_expiry).toLocaleDateString() : 'N/A'} disabled className="bg-muted" />
                </div>
                <Separator />
                <Button variant="outline" onClick={async () => {
                  if (!user?.email) return;
                  await supabase.auth.resetPasswordForEmail(user.email, {
                    redirectTo: `${window.location.origin}/reset-password`,
                  });
                  toast({ title: 'Email sent', description: 'Check your inbox for password reset.' });
                }}>
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: 'New signature requests', desc: 'Get notified when a document needs your signature' },
                  { label: 'Document signed', desc: 'When someone signs your document' },
                  { label: 'Certificate expiry', desc: 'Reminder before your certificate expires' },
                  { label: 'Signature rejected', desc: 'When a signature is rejected' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
