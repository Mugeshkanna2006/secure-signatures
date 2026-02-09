import { useState } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppLayout } from '@/components/layout/AppLayout';
import { AuditLogList } from '@/components/dashboard/AuditLogList';
import { mockCurrentUser, mockAuditLogs, mockDocuments } from '@/data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const Audit = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const pendingCount = mockDocuments.filter(
    doc => doc.status === 'pending' && 
    doc.signatures.some(s => s.signerId === mockCurrentUser.id && s.status === 'pending')
  ).length;

  return (
    <AppLayout 
      user={mockCurrentUser} 
      title="Audit Logs"
      pendingCount={pendingCount}
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audit logs..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Action Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="document">Document Actions</SelectItem>
              <SelectItem value="signature">Signature Actions</SelectItem>
              <SelectItem value="user">User Actions</SelectItem>
              <SelectItem value="certificate">Certificate Actions</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="7days">
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Logs */}
        <AuditLogList logs={mockAuditLogs} maxHeight="calc(100vh - 280px)" />
      </div>
    </AppLayout>
  );
};

export default Audit;
