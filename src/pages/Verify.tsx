import { AppLayout } from '@/components/layout/AppLayout';
import { VerificationPanel } from '@/components/verification/VerificationPanel';
import { mockCurrentUser, mockDocuments } from '@/data/mockData';

const Verify = () => {
  const pendingCount = mockDocuments.filter(
    doc => doc.status === 'pending' && 
    doc.signatures.some(s => s.signerId === mockCurrentUser.id && s.status === 'pending')
  ).length;

  return (
    <AppLayout 
      user={mockCurrentUser} 
      title="Verify Document"
      pendingCount={pendingCount}
    >
      <VerificationPanel />
    </AppLayout>
  );
};

export default Verify;
