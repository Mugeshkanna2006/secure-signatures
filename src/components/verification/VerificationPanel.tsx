import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileText,
  User,
  Calendar,
  Hash,
  Building
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { VerificationResult } from '@/types/adsms';

export function VerificationPanel() {
  const [documentId, setDocumentId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);

  const handleVerify = async () => {
    if (!documentId.trim()) return;
    
    setIsVerifying(true);
    
    // Simulate verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock result
    setResult({
      isValid: true,
      documentId: documentId,
      documentTitle: 'B.Tech Degree Certificate - Aarav Patel',
      signedAt: new Date('2024-01-12'),
      signerName: 'Prof. Suresh Iyer',
      signerRole: 'Registrar',
      certificateSerial: 'CERT-2024-00156',
      certificateIssuer: 'University Certificate Authority',
      verifiedAt: new Date(),
      tamperedDetected: false,
      message: 'This document is authentic and has not been modified since signing.',
    });
    
    setIsVerifying(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-0 shadow-card">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-accent" />
          </div>
          <CardTitle className="text-2xl">Verify Document Signature</CardTitle>
          <CardDescription>
            Enter the document ID or scan the QR code to verify the authenticity of a digitally signed document.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="documentId">Document ID or Verification Code</Label>
            <div className="flex gap-2">
              <Input
                id="documentId"
                placeholder="e.g., DOC-2024-00156 or paste verification URL"
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying || !documentId.trim()}
                variant="accent"
              >
                {isVerifying ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Search className="h-4 w-4" />
                  </motion.div>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Verify
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Separator className="flex-1" />
            <span className="text-xs text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </div>

          <Button variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Upload Document to Verify
          </Button>
        </CardContent>
      </Card>

      {/* Verification Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className={`border-0 shadow-card ${
            result.isValid ? 'border-l-4 border-l-verified' : 'border-l-4 border-l-destructive'
          }`}>
            <CardHeader>
              <div className="flex items-center gap-3">
                {result.isValid ? (
                  <div className="w-12 h-12 rounded-full bg-verified/10 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-verified" />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-destructive" />
                  </div>
                )}
                <div>
                  <CardTitle className={result.isValid ? 'text-verified' : 'text-destructive'}>
                    {result.isValid ? 'Document Verified' : 'Verification Failed'}
                  </CardTitle>
                  <CardDescription>{result.message}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    Document Title
                  </div>
                  <p className="font-medium">{result.documentTitle}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Hash className="h-4 w-4" />
                    Document ID
                  </div>
                  <p className="font-medium font-mono">{result.documentId}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    Signed By
                  </div>
                  <p className="font-medium">{result.signerName}</p>
                  <Badge variant="secondary" className="text-xs">{result.signerRole}</Badge>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Signed On
                  </div>
                  <p className="font-medium">{result.signedAt.toLocaleDateString()}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="h-4 w-4" />
                    Certificate Serial
                  </div>
                  <p className="font-medium font-mono text-sm">{result.certificateSerial}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building className="h-4 w-4" />
                    Issuing Authority
                  </div>
                  <p className="font-medium text-sm">{result.certificateIssuer}</p>
                </div>
              </div>

              {!result.tamperedDetected && (
                <div className="p-3 rounded-lg bg-verified/5 border border-verified/20 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-verified" />
                  <div>
                    <p className="text-sm font-medium text-verified">Integrity Check Passed</p>
                    <p className="text-xs text-muted-foreground">
                      No modifications detected since original signing
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
