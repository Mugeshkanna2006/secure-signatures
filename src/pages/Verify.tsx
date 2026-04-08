import { useAuth } from '@/hooks/useAuth';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { VerificationPanel } from '@/components/verification/VerificationPanel';

const Verify = () => {
  const { user, profile, roles } = useAuth();

  const currentUser = {
    id: user?.id || '', email: user?.email || '', name: profile?.name || '',
    role: (roles[0] as any) || 'student', certificateStatus: 'active' as const, createdAt: new Date(),
  };

  return (
    <DashboardLayout user={currentUser as any} title="Verify Document" pendingCount={0}>
      <VerificationPanel />
    </DashboardLayout>
  );
};

export default Verify;
