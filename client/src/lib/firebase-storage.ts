// Firebase Storage utilities for client-side operations
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export class FirebaseStorageService {
  /**
   * Upload an image file to Firebase Storage
   */
  static async uploadImage(file: File, folder: string = 'images'): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `${folder}/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw new Error('Failed to upload image');
    }
  }

  /**
   * Upload multiple files to Firebase Storage
   */
  static async uploadFiles(files: FileList, folder: string = 'documents'): Promise<string[]> {
    try {
      const uploadPromises = Array.from(files).map(file => 
        this.uploadImage(file, folder)
      );
      
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw new Error('Failed to upload files');
    }
  }

  /**
   * Delete a file from Firebase Storage by URL
   */
  static async deleteFile(downloadURL: string): Promise<void> {
    try {
      const fileRef = ref(storage, downloadURL);
      await deleteObject(fileRef);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }
}