import { v4 as uuidv4 } from 'uuid';

export interface UploadProgress {
  progress: number; // 0-100
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

export interface UploadedDocument {
  url: string;
  storagePath: string;
  originalName: string;
  size: number;
  uploadedAt: string;
}

// Allowed file types for policy documents
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/jpg'
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Validates a file before upload
 */
export function validatePolicyDocument(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG files only.'
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`
    };
  }

  return { valid: true };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}
