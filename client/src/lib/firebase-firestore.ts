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
import { ContactFormData, StrategicSuggestion } from '@shared/types';

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

  /**
   * Add a strategic suggestion
   */
  static async addSuggestion(suggestion: Omit<StrategicSuggestion, 'id' | 'createdAt'>): Promise<string> {
    try {
      const suggestionData: StrategicSuggestion = {
        ...suggestion,
        createdAt: new Date(),
      };

      const docRef = await addDoc(collection(db, 'strategic_suggestions'), {
        ...suggestionData,
        createdAt: Timestamp.fromDate(suggestionData.createdAt)
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding suggestion:', error);
      throw new Error('Failed to add suggestion');
    }
  }

  /**
   * Get all strategic suggestions
   */
  static async getSuggestions(): Promise<StrategicSuggestion[]> {
    try {
      const q = query(
        collection(db, 'strategic_suggestions'), 
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const suggestions: StrategicSuggestion[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        suggestions.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt ? data.updatedAt.toDate() : undefined
        });
      });

      return suggestions;
    } catch (error) {
      console.error('Error getting suggestions:', error);
      throw new Error('Failed to retrieve suggestions');
    }
  }

  /**
   * Update a strategic suggestion
   */
  static async updateSuggestion(
    suggestionId: string, 
    updates: Partial<Pick<StrategicSuggestion, 'title' | 'description'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, 'strategic_suggestions', suggestionId);
      await updateDoc(docRef, { 
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating suggestion:', error);
      throw new Error('Failed to update suggestion');
    }
  }

  /**
   * Delete a strategic suggestion
   */
  static async deleteSuggestion(suggestionId: string): Promise<void> {
    try {
      const docRef = doc(db, 'strategic_suggestions', suggestionId);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting suggestion:', error);
      throw new Error('Failed to delete suggestion');
    }
  }
}