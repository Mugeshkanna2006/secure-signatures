import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileSignature, CheckCircle2, Clock, ArrowRight, FileText, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Document as DocType } from '@/types/adsms';
import { documentTypeLabels } from '@/data/mockData';

const Sign = () => {
  const { user, profile, roles } = useAuth();
  const { toast } = useToast();
  const [pendingDocs, setPendingDocs] = useState<DocType[]>([]);
  const [signing, setSigning] = useState<string | null>(null);

  useEffect(() => { loadPendingDocs(); }, [user]);

  const loadPendingDocs = async () => {
    if (!user) return;
    const { data: sigs } = await supabase
      .from('signature_requests')
      .select('*, documents(*)')
      .eq('signer_id', user.id)
      .eq('status', 'pending');

    if (!sigs) return;

    const docs: DocType[] = [];
    for (const sig of sigs) {
      const doc = sig.documents as any;
      if (!doc) continue;
      
      // Get all signatures for this document
      const { data: allSigs } = await supabase
        .from('signature_requests')
        .select('*')
        .eq('document_id', doc.id)
        .order('sign_order');

      const existingDoc = docs.find(d => d.id === doc.id);
      if (existingDoc) continue;

      docs.push({
        id: doc.id,
        title: doc.title,
        description: doc.description,
        type: doc.type,
        status: doc.status,
        fileName: doc.file_name,
        fileSize: Number(doc.file_size),
        uploadedBy: doc.uploaded_by,
        uploadedAt: new Date(doc.created_at),
        version: doc.version,
        currentSignerIndex: doc.current_signer_index,
        signatures: (allSigs || []).map(s => ({
          id: s.id,
          documentId: s.document_id,
          signerId: s.signer_id,
          signerName: s.signer_name,
          signerEmail: s.signer_email,
          signerRole: 'faculty' as any,
          order: s.sign_order,
          status: s.status as any,
          requestedAt: new Date(s.requested_at),
          signedAt: s.signed_at ? new Date(s.signed_at) : undefined,
        })),
      });
    }
    setPendingDocs(docs);
  };

  const handleSign = async (docId: string, sigId: string) => {
    setSigning(sigId);
    // Update signature request
    const { error: sigError } = await supabase.from('signature_requests').update({
      status: 'completed',
      signed_at: new Date().toISOString(),
      signature_data: `SIG-${user?.id}-${Date.now()}`,
    }).eq('id', sigId);

    if (sigError) {
      toast({ title: 'Error', description: sigError.message, variant: 'destructive' });
      setSigning(null);
      return;
    }

    // Check if all signatures are complete
    const { data: remaining } = await supabase
      .from('signature_requests')
      .select('id')
      .eq('document_id', docId)
      .eq('status', 'pending');

    if (remaining && remaining.length === 0) {
      await supabase.from('documents').update({
        status: 'signed',
        completed_at: new Date().toISOString(),
      }).eq('id', docId);
    } else {
      // Advance current_signer_index
      await supabase.from('documents').update({
        current_signer_index: (remaining?.length || 0),
      }).eq('id', docId);
    }

    // Audit log
    await supabase.from('audit_logs').insert({
      user_id: user?.id,
      user_name: profile?.name || '',
      action: 'signature_completed',
      resource_type: 'document',
      resource_id: docId,
      details: `Signed document`,
    });

    toast({ title: 'Document signed!', description: 'Your digital signature has been applied.' });
    setSigning(null);
    loadPendingDocs();
  };

  const handleReject = async (docId: string, sigId: string) => {
    const { error } = await supabase.from('signature_requests').update({
      status: 'rejected',
      rejected_at: new Date().toISOString(),
      rejection_reason: 'Rejected by signer',
    }).eq('id', sigId);

    if (!error) {
      await supabase.from('documents').update({ status: 'rejected' }).eq('id', docId);
      await supabase.from('audit_logs').insert({
        user_id: user?.id,
        user_name: profile?.name || '',
        action: 'signature_rejected',
        resource_type: 'document',
        resource_id: docId,
        details: 'Signature rejected',
      });
      toast({ title: 'Signature rejected' });
      loadPendingDocs();
    }
  };

  const currentUser = {
    id: user?.id || '', email: user?.email || '', name: profile?.name || '',
    role: (roles[0] as any) || 'student', certificateStatus: 'active' as const, createdAt: new Date(),
  };

  return (
    <AppLayout user={currentUser as any} title="Sign Documents" pendingCount={pendingDocs.length}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Documents Awaiting Your Signature</h2>
          <p className="text-muted-foreground">Review and sign documents using your digital certificate</p>
        </div>

        {pendingDocs.length === 0 ? (
          <Card className="border-0 shadow-card">
            <CardContent className="text-center py-16">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-verified" />
              <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">No documents awaiting your signature</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingDocs.map((doc, index) => {
              const userSig = doc.signatures.find(s => s.signerId === user?.id && s.status === 'pending');
              const isUsersTurn = doc.signatures.findIndex(s => s.status === 'pending') ===
                doc.signatures.findIndex(s => s.signerId === user?.id);

              return (
                <motion.div key={doc.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className={`border-0 shadow-card transition-all hover:shadow-lg ${isUsersTurn ? 'border-l-4 border-l-accent' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{doc.title}</CardTitle>
                            {isUsersTurn && <Badge variant="info">Your Turn</Badge>}
                          </div>
                          <CardDescription>{doc.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{documentTypeLabels[doc.type]}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2"><FileText className="h-4 w-4" /><span>{doc.fileName}</span></div>
                        <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>Requested {format(doc.uploadedAt, 'MMM dd, yyyy')}</span></div>
                      </div>
                      <Separator />
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Signature Flow</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {doc.signatures.map((sig, i) => (
                            <div key={sig.id} className="flex items-center">
                              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                sig.status === 'completed' ? 'bg-verified/10' :
                                sig.signerId === user?.id ? 'bg-accent/10 ring-2 ring-accent' : 'bg-muted'
                              }`}>
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className={`text-xs ${
                                    sig.status === 'completed' ? 'bg-verified text-verified-foreground' :
                                    sig.signerId === user?.id ? 'bg-accent text-accent-foreground' : 'bg-muted-foreground/20'
                                  }`}>{sig.signerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div className="text-left">
                                  <p className="text-xs font-medium">{sig.signerName}</p>
                                </div>
                                {sig.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-verified ml-2" />}
                              </div>
                              {i < doc.signatures.length - 1 && <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                        {!isUsersTurn ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <AlertCircle className="h-4 w-4" /><span>Waiting for previous signer</span>
                          </div>
                        ) : <div />}
                        <div className="flex items-center gap-2">
                          <Button variant="outline" onClick={() => userSig && handleReject(doc.id, userSig.id)} disabled={!isUsersTurn}>Reject</Button>
                          <Button variant="accent" disabled={!isUsersTurn || signing === userSig?.id} onClick={() => userSig && handleSign(doc.id, userSig.id)}>
                            <FileSignature className="h-4 w-4 mr-2" />
                            {signing === userSig?.id ? 'Signing...' : 'Sign Document'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Sign;
