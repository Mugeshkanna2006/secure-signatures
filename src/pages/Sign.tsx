import { motion } from 'framer-motion';
import { 
  FileSignature, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  FileText,
  AlertCircle
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { mockCurrentUser, mockDocuments, documentTypeLabels } from '@/data/mockData';
import { format } from 'date-fns';

const Sign = () => {
  const pendingDocs = mockDocuments.filter(
    doc => doc.status === 'pending' && 
    doc.signatures.some(s => s.signerId === mockCurrentUser.id && s.status === 'pending')
  );

  const pendingCount = pendingDocs.length;

  return (
    <AppLayout 
      user={mockCurrentUser} 
      title="Sign Documents"
      pendingCount={pendingCount}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Documents Awaiting Your Signature</h2>
          <p className="text-muted-foreground">
            Review and sign the following documents using your digital certificate
          </p>
        </div>

        {pendingDocs.length === 0 ? (
          <Card className="border-0 shadow-card">
            <CardContent className="text-center py-16">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-verified" />
              <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                You have no documents awaiting your signature
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingDocs.map((doc, index) => {
              const userSignature = doc.signatures.find(
                s => s.signerId === mockCurrentUser.id && s.status === 'pending'
              );
              const isUsersTurn = doc.signatures.findIndex(s => s.status === 'pending') === 
                doc.signatures.findIndex(s => s.signerId === mockCurrentUser.id);

              return (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`border-0 shadow-card transition-all hover:shadow-lg ${
                    isUsersTurn ? 'border-l-4 border-l-accent' : ''
                  }`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">{doc.title}</CardTitle>
                            {isUsersTurn && (
                              <Badge variant="info">Your Turn</Badge>
                            )}
                          </div>
                          <CardDescription>{doc.description}</CardDescription>
                        </div>
                        <Badge variant="outline">{documentTypeLabels[doc.type]}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Document Info */}
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>{doc.fileName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>Requested {format(userSignature?.requestedAt || doc.uploadedAt, 'MMM dd, yyyy')}</span>
                        </div>
                      </div>

                      <Separator />

                      {/* Signature Flow */}
                      <div className="space-y-3">
                        <p className="text-sm font-medium">Signature Flow</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {doc.signatures.map((sig, i) => {
                            const isCurrentUser = sig.signerId === mockCurrentUser.id;
                            const isPending = sig.status === 'pending';
                            const isCompleted = sig.status === 'completed';

                            return (
                              <div key={sig.id} className="flex items-center">
                                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                                  isCompleted ? 'bg-verified/10' :
                                  isCurrentUser && isPending ? 'bg-accent/10 ring-2 ring-accent' :
                                  'bg-muted'
                                }`}>
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className={`text-xs ${
                                      isCompleted ? 'bg-verified text-verified-foreground' :
                                      isCurrentUser ? 'bg-accent text-accent-foreground' :
                                      'bg-muted-foreground/20'
                                    }`}>
                                      {sig.signerName.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="text-left">
                                    <p className="text-xs font-medium">{sig.signerName}</p>
                                    <p className="text-[10px] text-muted-foreground capitalize">{sig.signerRole}</p>
                                  </div>
                                  {isCompleted && <CheckCircle2 className="h-4 w-4 text-verified ml-2" />}
                                </div>
                                {i < doc.signatures.length - 1 && (
                                  <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2">
                        {!isUsersTurn ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                            <span>Waiting for previous signer</span>
                          </div>
                        ) : (
                          <div />
                        )}
                        <div className="flex items-center gap-2">
                          <Button variant="outline">
                            Preview Document
                          </Button>
                          <Button 
                            variant="accent" 
                            disabled={!isUsersTurn}
                          >
                            <FileSignature className="h-4 w-4 mr-2" />
                            Sign Document
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
