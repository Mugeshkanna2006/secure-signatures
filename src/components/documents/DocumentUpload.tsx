import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  X, 
  Check,
  Plus,
  Users,
  ArrowRight,
  Send
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { documentTypeLabels } from '@/data/mockData';
import { DocumentType, UserRole } from '@/types/adsms';

interface Signer {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

const mockUsers: Signer[] = [
  { id: 'user-001', name: 'Dr. Priya Sharma', email: 'dr.sharma@university.edu', role: 'faculty' },
  { id: 'user-002', name: 'Prof. Rajesh Kumar', email: 'hod.cs@university.edu', role: 'faculty' },
  { id: 'user-006', name: 'Dr. Anita Verma', email: 'dean@university.edu', role: 'admin' },
  { id: 'user-007', name: 'Prof. Suresh Iyer', email: 'registrar@university.edu', role: 'admin' },
];

export function DocumentUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [docType, setDocType] = useState<DocumentType>('other');
  const [signers, setSigners] = useState<Signer[]>([]);
  const [step, setStep] = useState(1);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
    }
  };

  const addSigner = (user: Signer) => {
    if (!signers.find(s => s.id === user.id)) {
      setSigners([...signers, user]);
    }
  };

  const removeSigner = (id: string) => {
    setSigners(signers.filter(s => s.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step >= s ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            <span className={`text-sm ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s === 1 ? 'Upload' : s === 2 ? 'Details' : 'Signers'}
            </span>
            {s < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Upload */}
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Upload Document</CardTitle>
                <CardDescription>
                  Upload a PDF document that requires digital signatures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                    isDragging ? 'border-accent bg-accent/5' : 'border-muted-foreground/25 hover:border-accent/50'
                  }`}
                >
                  {file ? (
                    <div className="flex items-center justify-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFile(null)}
                        className="ml-4"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-lg font-medium mb-2">Drop your PDF here</p>
                      <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button asChild variant="outline">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Select File
                        </label>
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!file}
                  variant="accent"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Document Details</CardTitle>
                <CardDescription>
                  Provide information about the document
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Document Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., B.Tech Final Year Project Approval"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Document Type</Label>
                  <Select value={docType} onValueChange={(v) => setDocType(v as DocumentType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(documentTypeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the document..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!title}
                  variant="accent"
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}

        {/* Step 3: Signers */}
        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle>Add Signers</CardTitle>
                <CardDescription>
                  Select who needs to sign this document and in what order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Selected Signers */}
                {signers.length > 0 && (
                  <div className="space-y-2">
                    <Label>Signing Order</Label>
                    <div className="space-y-2">
                      {signers.map((signer, index) => (
                        <motion.div
                          key={signer.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                        >
                          <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {signer.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{signer.name}</p>
                            <p className="text-xs text-muted-foreground">{signer.email}</p>
                          </div>
                          <Badge variant="secondary" className="capitalize">{signer.role}</Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSigner(signer.id)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Signer */}
                <div className="space-y-2">
                  <Label>Add Signer</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {mockUsers.filter(u => !signers.find(s => s.id === u.id)).map((user) => (
                      <Button
                        key={user.id}
                        variant="outline"
                        className="justify-start h-auto py-2"
                        onClick={() => addSigner(user)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        <div className="text-left">
                          <p className="text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  disabled={signers.length === 0}
                  variant="accent"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send for Signatures
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
