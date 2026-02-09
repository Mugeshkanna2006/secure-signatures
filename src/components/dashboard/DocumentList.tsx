import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { 
  FileText, 
  MoreVertical, 
  Download, 
  Eye, 
  Clock,
  CheckCircle2,
  XCircle,
  FileSignature
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Document, DocumentStatus } from '@/types/adsms';
import { documentTypeLabels } from '@/data/mockData';

interface DocumentListProps {
  documents: Document[];
  title?: string;
  showAll?: boolean;
}

const statusConfig: Record<DocumentStatus, { 
  label: string; 
  variant: 'pending' | 'verified' | 'destructive' | 'secondary';
  icon: typeof Clock;
}> = {
  draft: { label: 'Draft', variant: 'secondary', icon: FileText },
  pending: { label: 'Pending', variant: 'pending', icon: Clock },
  signed: { label: 'Signed', variant: 'verified', icon: CheckCircle2 },
  rejected: { label: 'Rejected', variant: 'destructive', icon: XCircle },
  expired: { label: 'Expired', variant: 'secondary', icon: Clock },
};

export function DocumentList({ documents, title = 'Recent Documents', showAll = false }: DocumentListProps) {
  const displayDocs = showAll ? documents : documents.slice(0, 5);

  return (
    <Card className="border-0 shadow-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {!showAll && documents.length > 5 && (
          <Button variant="ghost" size="sm">
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {displayDocs.map((doc, index) => {
            const status = statusConfig[doc.status];
            const StatusIcon = status.icon;
            const pendingCount = doc.signatures.filter(s => s.status === 'pending').length;
            const completedCount = doc.signatures.filter(s => s.status === 'completed').length;

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <FileSignature className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-sm">{doc.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {documentTypeLabels[doc.type]}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{format(doc.uploadedAt, 'MMM dd, yyyy')}</span>
                      <span>•</span>
                      <span>v{doc.version}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <StatusIcon className="h-3 w-3" />
                        {completedCount}/{doc.signatures.length} signed
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={status.variant}>
                    {status.label}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Document
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      {doc.status === 'pending' && (
                        <DropdownMenuItem>
                          <FileSignature className="h-4 w-4 mr-2" />
                          Sign Now
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
