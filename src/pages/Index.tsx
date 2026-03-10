import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { DocumentList } from '@/components/dashboard/DocumentList';
import { PendingSignatures } from '@/components/dashboard/PendingSignatures';
import { AuditLogList } from '@/components/dashboard/AuditLogList';
import { DashboardStats, Document as DocType, AuditLog } from '@/types/adsms';

const Index = () => {
  const { user, profile, roles } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<DocType[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalDocuments: 0, pendingSignatures: 0, completedToday: 0,
    rejectedDocuments: 0, activeUsers: 0, expiringCertificates: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const loadDashboard = async () => {
    if (!user) return;
    const [docsRes, sigsRes, logsRes] = await Promise.all([
      supabase.from('documents').select('*').order('created_at', { ascending: false }).limit(10),
      supabase.from('signature_requests').select('*').eq('signer_id', user.id),
      supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(10),
    ]);

    const docs = (docsRes.data || []).map(d => ({
      id: d.id,
      title: d.title,
      description: d.description,
      type: d.type as any,
      status: d.status as any,
      fileName: d.file_name,
      fileSize: Number(d.file_size),
      uploadedBy: d.uploaded_by,
      uploadedAt: new Date(d.created_at),
      version: d.version,
      currentSignerIndex: d.current_signer_index,
      completedAt: d.completed_at ? new Date(d.completed_at) : undefined,
      expiresAt: d.expires_at ? new Date(d.expires_at) : undefined,
      signatures: [],
    }));

    // Map signature requests to documents
    const sigs = sigsRes.data || [];
    for (const sig of sigs) {
      const doc = docs.find(d => d.id === sig.document_id);
      if (doc) {
        doc.signatures.push({
          id: sig.id,
          documentId: sig.document_id,
          signerId: sig.signer_id,
          signerName: sig.signer_name,
          signerEmail: sig.signer_email,
          signerRole: 'faculty',
          order: sig.sign_order,
          status: sig.status as any,
          requestedAt: new Date(sig.requested_at),
          signedAt: sig.signed_at ? new Date(sig.signed_at) : undefined,
          rejectedAt: sig.rejected_at ? new Date(sig.rejected_at) : undefined,
          rejectionReason: sig.rejection_reason || undefined,
        });
      }
    }

    setDocuments(docs);

    const logs: AuditLog[] = (logsRes.data || []).map(l => ({
      id: l.id,
      timestamp: new Date(l.created_at),
      userId: l.user_id || '',
      userName: l.user_name,
      action: l.action as any,
      resourceType: l.resource_type as any,
      resourceId: l.resource_id,
      details: l.details,
      ipAddress: l.ip_address || undefined,
    }));
    setAuditLogs(logs);

    const pendingCount = sigs.filter(s => s.status === 'pending').length;
    setStats({
      totalDocuments: docs.length,
      pendingSignatures: pendingCount,
      completedToday: docs.filter(d => d.completedAt && new Date(d.completedAt).toDateString() === new Date().toDateString()).length,
      rejectedDocuments: docs.filter(d => d.status === 'rejected').length,
      activeUsers: 0,
      expiringCertificates: 0,
    });
  };

  const currentUser = {
    id: user?.id || '',
    email: user?.email || '',
    name: profile?.name || '',
    role: (roles[0] as any) || 'student',
    department: profile?.department,
    certificateStatus: (profile?.certificate_status as any) || 'pending',
    createdAt: new Date(),
  };

  const pendingCount = documents.filter(
    doc => doc.status === 'pending' && doc.signatures.some(s => s.signerId === user?.id && s.status === 'pending')
  ).length;

  return (
    <AppLayout
      user={currentUser as any}
      title="Dashboard"
      pendingCount={pendingCount}
      headerContent={
        <Button variant="accent" className="ml-4" onClick={() => navigate('/documents')}>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      }
    >
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Welcome back, {(profile?.name || 'User').split(' ')[0]}
              </h2>
              <p className="text-primary-foreground/80">
                You have {pendingCount} document{pendingCount !== 1 ? 's' : ''} awaiting your signature
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Button variant="hero-outline" onClick={() => navigate('/documents')}>View All Documents</Button>
              <Button variant="hero" onClick={() => navigate('/documents')}>
                <Plus className="h-4 w-4 mr-2" />New Request
              </Button>
            </div>
          </div>
        </motion.div>

        <StatsCards stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PendingSignatures documents={documents} currentUserId={user?.id || ''} />
            <DocumentList documents={documents} />
          </div>
          <div>
            <AuditLogList logs={auditLogs} maxHeight="600px" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
