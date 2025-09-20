// Firestore database utilities for client-side operations
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import { ContactFormData } from '@shared/types';

export class FirebaseFirestoreService {
  /**
   * Submit contact form data to Firestore
   */
  static async submitContactForm(formData: Omit<ContactFormData, 'id' | 'submittedAt' | 'status'>): Promise<string> {
    try {
      const submissionData: ContactFormData = {
        ...formData,
        submittedAt: new Date(),
        status: 'pending'
      };

      const docRef = await addDoc(collection(db, 'contact_submissions'), {
        ...submissionData,
        submittedAt: Timestamp.fromDate(submissionData.submittedAt)
      });

      return docRef.id;
    } catch (error) {
      console.error('Error submitting contact form:', error);
      throw new Error('Failed to submit contact form');
    }
  }

  /**
   * Get all contact submissions (admin function)
   */
  static async getContactSubmissions(): Promise<ContactFormData[]> {
    try {
      const q = query(
        collection(db, 'contact_submissions'), 
        orderBy('submittedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const submissions: ContactFormData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        submissions.push({
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt.toDate()
        } as ContactFormData);
      });

      return submissions;
    } catch (error) {
      console.error('Error getting contact submissions:', error);
      throw new Error('Failed to retrieve contact submissions');
    }
  }

  /**
   * Update contact submission status
   */
  static async updateSubmissionStatus(
    submissionId: string, 
    status: ContactFormData['status']
  ): Promise<void> {
    try {
      const docRef = doc(db, 'contact_submissions', submissionId);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Error updating submission status:', error);
      throw new Error('Failed to update submission status');
    }
  }

  /**
   * Delete contact submission
   */
  static async deleteSubmission(submissionId: string): Promise<void> {
    try {
      const docRef = doc(db, 'contact_submissions', submissionId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting submission:', error);
      throw new Error('Failed to delete submission');
    }
  }

  /**
   * Get submissions by status
   */
  static async getSubmissionsByStatus(status: ContactFormData['status']): Promise<ContactFormData[]> {
    try {
      const q = query(
        collection(db, 'contact_submissions'),
        where('status', '==', status),
        orderBy('submittedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const submissions: ContactFormData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        submissions.push({
          id: doc.id,
          ...data,
          submittedAt: data.submittedAt.toDate()
        } as ContactFormData);
      });

      return submissions;
    } catch (error) {
      console.error('Error getting submissions by status:', error);
      throw new Error('Failed to retrieve submissions');
    }
  }
}