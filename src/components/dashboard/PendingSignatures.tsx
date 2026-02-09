import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Clock, 
  ArrowRight, 
  FileSignature,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Document } from '@/types/adsms';
import { documentTypeLabels } from '@/data/mockData';

interface PendingSignaturesProps {
  documents: Document[];
  currentUserId: string;
}

export function PendingSignatures({ documents, currentUserId }: PendingSignaturesProps) {
  // Filter documents where current user has pending signatures
  const pendingDocs = documents.filter(doc => 
    doc.status === 'pending' && 
    doc.signatures.some(sig => sig.signerId === currentUserId && sig.status === 'pending')
  );

  if (pendingDocs.length === 0) {
    return (
      <Card className="border-0 shadow-card">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <FileSignature className="h-5 w-5 text-accent" />
            Awaiting Your Signature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <FileSignature className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No documents awaiting your signature</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-card border-l-4 border-l-accent">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <FileSignature className="h-5 w-5 text-accent" />
          Awaiting Your Signature
          <Badge variant="info" className="ml-2">{pendingDocs.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingDocs.map((doc, index) => {
          const userSignature = doc.signatures.find(
            sig => sig.signerId === currentUserId && sig.status === 'pending'
          );
          const otherSigners = doc.signatures.filter(sig => sig.signerId !== currentUserId);

          return (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-lg bg-accent/5 border border-accent/20 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{doc.title}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {documentTypeLabels[doc.type]}
                    </Badge>
                    <span>•</span>
                    <Clock className="h-3 w-3" />
                    <span>Requested {format(userSignature?.requestedAt || doc.uploadedAt, 'MMM dd')}</span>
                  </div>
                </div>
                <Button size="sm" variant="accent">
                  Sign Now
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

              {/* Signature flow visualization */}
              <div className="flex items-center gap-2 pt-2">
                <span className="text-xs text-muted-foreground">Signature flow:</span>
                <div className="flex items-center gap-1">
                  {doc.signatures.map((sig, i) => (
                    <div key={sig.id} className="flex items-center">
                      <Avatar className="h-6 w-6 border-2 border-background">
                        <AvatarFallback className={`text-xs ${
                          sig.status === 'completed' ? 'bg-verified text-verified-foreground' :
                          sig.signerId === currentUserId ? 'bg-accent text-accent-foreground' :
                          'bg-muted'
                        }`}>
                          {sig.signerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      {i < doc.signatures.length - 1 && (
                        <ArrowRight className="h-3 w-3 mx-1 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
