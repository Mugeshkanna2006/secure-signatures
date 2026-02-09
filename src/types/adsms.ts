// Core types for Academic Digital Signature Management System

export type UserRole = 'admin' | 'faculty' | 'staff' | 'student';

export type DocumentStatus = 'draft' | 'pending' | 'signed' | 'rejected' | 'expired';

export type SignatureStatus = 'pending' | 'completed' | 'rejected' | 'expired';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  employeeId?: string;
  studentId?: string;
  certificateStatus: 'active' | 'expired' | 'pending' | 'revoked';
  certificateExpiry?: Date;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  type: DocumentType;
  status: DocumentStatus;
  fileName: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  version: number;
  signatures: SignatureRequest[];
  currentSignerIndex: number;
  completedAt?: Date;
  expiresAt?: Date;
}

export type DocumentType = 
  | 'certificate'
  | 'transcript'
  | 'marksheet'
  | 'project_approval'
  | 'bonafide_letter'
  | 'administrative_form'
  | 'other';

export interface SignatureRequest {
  id: string;
  documentId: string;
  signerId: string;
  signerName: string;
  signerEmail: string;
  signerRole: UserRole;
  order: number;
  status: SignatureStatus;
  requestedAt: Date;
  signedAt?: Date;
  rejectedAt?: Date;
  rejectionReason?: string;
  signatureData?: string;
  certificateId?: string;
}

export interface AuditLog {
  id: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: AuditAction;
  resourceType: 'document' | 'user' | 'signature' | 'certificate' | 'system';
  resourceId: string;
  details: string;
  ipAddress?: string;
  userAgent?: string;
}

export type AuditAction =
  | 'document_uploaded'
  | 'document_viewed'
  | 'document_downloaded'
  | 'document_deleted'
  | 'signature_requested'
  | 'signature_completed'
  | 'signature_rejected'
  | 'user_login'
  | 'user_logout'
  | 'user_created'
  | 'user_updated'
  | 'certificate_issued'
  | 'certificate_revoked'
  | 'system_config_changed';

export interface Certificate {
  id: string;
  userId: string;
  serialNumber: string;
  issuer: string;
  subject: string;
  validFrom: Date;
  validTo: Date;
  status: 'active' | 'expired' | 'revoked' | 'pending';
  publicKey: string;
  fingerprint: string;
}

export interface DashboardStats {
  totalDocuments: number;
  pendingSignatures: number;
  completedToday: number;
  rejectedDocuments: number;
  activeUsers: number;
  expiringCertificates: number;
}

export interface VerificationResult {
  isValid: boolean;
  documentId: string;
  documentTitle: string;
  signedAt: Date;
  signerName: string;
  signerRole: string;
  certificateSerial: string;
  certificateIssuer: string;
  verifiedAt: Date;
  tamperedDetected: boolean;
  message: string;
}
