import { motion } from 'framer-motion';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { DocumentList } from '@/components/dashboard/DocumentList';
import { PendingSignatures } from '@/components/dashboard/PendingSignatures';
import { AuditLogList } from '@/components/dashboard/AuditLogList';
import { 
  mockCurrentUser, 
  mockDocuments, 
  mockAuditLogs, 
  mockDashboardStats 
} from '@/data/mockData';

const Index = () => {
  const pendingCount = mockDocuments.filter(
    doc => doc.status === 'pending' && 
    doc.signatures.some(s => s.signerId === mockCurrentUser.id && s.status === 'pending')
  ).length;

  return (
    <AppLayout 
      user={mockCurrentUser} 
      title="Dashboard"
      pendingCount={pendingCount}
      headerContent={
        <Button variant="accent" className="ml-4">
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-hero rounded-2xl p-6 text-primary-foreground"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                Welcome back, {mockCurrentUser.name.split(' ')[0]}
              </h2>
              <p className="text-primary-foreground/80">
                You have {pendingCount} document{pendingCount !== 1 ? 's' : ''} awaiting your signature
              </p>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Button variant="hero-outline">
                View All Documents
              </Button>
              <Button variant="hero">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <StatsCards stats={mockDashboardStats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Documents */}
          <div className="lg:col-span-2 space-y-6">
            <PendingSignatures 
              documents={mockDocuments} 
              currentUserId={mockCurrentUser.id} 
            />
            <DocumentList documents={mockDocuments} />
          </div>

          {/* Right Column - Activity */}
          <div>
            <AuditLogList logs={mockAuditLogs} maxHeight="600px" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
