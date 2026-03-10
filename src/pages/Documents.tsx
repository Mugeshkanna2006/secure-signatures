import { useEffect, useState } from 'react';
import { Plus, Search, Filter, Grid, List } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppLayout } from '@/components/layout/AppLayout';
import { DocumentList } from '@/components/dashboard/DocumentList';
import { DocumentUpload } from '@/components/documents/DocumentUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Document as DocType } from '@/types/adsms';

const Documents = () => {
  const { user, profile, roles } = useAuth();
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [documents, setDocuments] = useState<DocType[]>([]);

  useEffect(() => { loadDocuments(); }, [user]);

  const loadDocuments = async () => {
    if (!user) return;
    const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    if (data) {
      setDocuments(data.map(d => ({
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
        signatures: [],
      })));
    }
  };

  const currentUser = {
    id: user?.id || '', email: user?.email || '', name: profile?.name || '',
    role: (roles[0] as any) || 'student', certificateStatus: 'active' as const, createdAt: new Date(),
  };

  return (
    <AppLayout user={currentUser as any} title="Documents" pendingCount={0}>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search documents..." className="pl-9" />
            </div>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border rounded-lg p-1">
              <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('list')}><List className="h-4 w-4" /></Button>
              <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('grid')}><Grid className="h-4 w-4" /></Button>
            </div>
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="accent"><Plus className="h-4 w-4 mr-2" />Upload Document</Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl p-0 overflow-hidden">
                <div className="p-6"><DocumentUpload /></div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Documents</TabsTrigger>
            <TabsTrigger value="pending">Pending<span className="ml-1.5 bg-pending/20 text-pending px-1.5 py-0.5 rounded text-xs">{documents.filter(d => d.status === 'pending').length}</span></TabsTrigger>
            <TabsTrigger value="signed">Signed</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4"><DocumentList documents={documents} title="All Documents" showAll /></TabsContent>
          <TabsContent value="pending" className="mt-4"><DocumentList documents={documents.filter(d => d.status === 'pending')} title="Pending" showAll /></TabsContent>
          <TabsContent value="signed" className="mt-4"><DocumentList documents={documents.filter(d => d.status === 'signed')} title="Signed" showAll /></TabsContent>
          <TabsContent value="rejected" className="mt-4"><DocumentList documents={documents.filter(d => d.status === 'rejected')} title="Rejected" showAll /></TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Documents;
