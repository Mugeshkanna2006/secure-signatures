import { useState } from 'react';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppLayout } from '@/components/layout/AppLayout';
import { DocumentList } from '@/components/dashboard/DocumentList';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { 
  mockCurrentUser, 
  mockDocuments 
} from '@/data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';

const Documents = () => {
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [uploadOpen, setUploadOpen] = useState(false);

  const pendingCount = mockDocuments.filter(
    doc => doc.status === 'pending' && 
    doc.signatures.some(s => s.signerId === mockCurrentUser.id && s.status === 'pending')
  ).length;

  return (
    <AppLayout 
      user={mockCurrentUser} 
      title="Documents"
      pendingCount={pendingCount}
    >
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                className="pl-9"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button 
                variant={view === 'list' ? 'secondary' : 'ghost'} 
                size="icon"
                className="h-8 w-8"
                onClick={() => setView('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button 
                variant={view === 'grid' ? 'secondary' : 'ghost'} 
                size="icon"
                className="h-8 w-8"
                onClick={() => setView('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
            
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="accent">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <div className="p-6">
                  <DocumentUpload />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <span className="ml-1.5 bg-pending/20 text-pending px-1.5 py-0.5 rounded text-xs">
                {mockDocuments.filter(d => d.status === 'pending').length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="signed">Signed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4">
            <DocumentList documents={mockDocuments} title="All Documents" showAll />
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <DocumentList 
              documents={mockDocuments.filter(d => d.status === 'pending')} 
              title="Pending Documents" 
              showAll 
            />
          </TabsContent>
          <TabsContent value="signed" className="mt-4">
            <DocumentList 
              documents={mockDocuments.filter(d => d.status === 'signed')} 
              title="Signed Documents" 
              showAll 
            />
          </TabsContent>
          <TabsContent value="rejected" className="mt-4">
            <DocumentList 
              documents={mockDocuments.filter(d => d.status === 'rejected')} 
              title="Rejected Documents" 
              showAll 
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Documents;
