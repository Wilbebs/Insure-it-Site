import { storage } from './firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
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
 * Uploads a policy document to Firebase Storage
 * @param file The file to upload
 * @param onProgress Callback for upload progress updates
 * @returns Promise with uploaded document metadata
 */
export function uploadPolicyDocument(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadedDocument> {
  return new Promise((resolve, reject) => {
    // Validate file first
    const validation = validatePolicyDocument(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const storagePath = `policy-documents/${uniqueFileName}`;

    // Create storage reference
    const storageRef = ref(storage, storagePath);

    // Start upload with resumable upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Monitor upload progress
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.({
          progress,
          status: 'uploading'
        });
      },
      (error) => {
        // Handle upload errors
        onProgress?.({
          progress: 0,
          status: 'error',
          error: error.message
        });
        reject(error);
      },
      async () => {
        // Upload completed successfully
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          const uploadedDoc: UploadedDocument = {
            url: downloadURL,
            storagePath,
            originalName: file.name,
            size: file.size,
            uploadedAt: new Date().toISOString()
          };

          onProgress?.({
            progress: 100,
            status: 'complete'
          });

          resolve(uploadedDoc);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
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
