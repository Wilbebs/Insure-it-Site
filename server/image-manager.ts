// Image management service for Firebase Storage integration
import { adminDb, adminStorage } from './firebase-admin.js';
import { InsurancePageImages } from '@shared/types.js';

export class ImageManager {
  /**
   * Initialize default carousel images in Firebase Storage
   */
  static async initializeCarouselImages(): Promise<void> {
    try {
      // Check if carousel images are already configured
      const configDoc = await adminDb.collection('site_config').doc('carousel_images').get();
      
      if (!configDoc.exists) {
        // Default image URLs (we'll replace these with Firebase Storage URLs after upload)
        const defaultImages: InsurancePageImages = {
          carouselImages: {
            auto: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            home: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600", 
            life: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            health: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            commercial: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
          }
        };

        // Save to Firestore
        await adminDb.collection('site_config').doc('carousel_images').set({
          ...defaultImages,
          lastUpdated: new Date(),
          source: 'unsplash_default'
        });

        console.log('Initialized default carousel images');
      }
    } catch (error) {
      console.error('Error initializing carousel images:', error);
    }
  }

  /**
   * Get current carousel images configuration
   */
  static async getCarouselImages(): Promise<InsurancePageImages | null> {
    try {
      const configDoc = await adminDb.collection('site_config').doc('carousel_images').get();
      
      if (configDoc.exists) {
        const data = configDoc.data();
        return {
          carouselImages: data?.carouselImages || {}
        } as InsurancePageImages;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting carousel images:', error);
      return null;
    }
  }

  /**
   * Update a specific carousel image
   */
  static async updateCarouselImage(
    insuranceType: keyof InsurancePageImages['carouselImages'], 
    imageUrl: string
  ): Promise<void> {
    try {
      const updatePath = `carouselImages.${insuranceType}`;
      await adminDb.collection('site_config').doc('carousel_images').update({
        [updatePath]: imageUrl,
        lastUpdated: new Date()
      });

      console.log(`Updated ${insuranceType} carousel image`);
    } catch (error) {
      console.error(`Error updating ${insuranceType} carousel image:`, error);
    }
  }

  /**
   * Upload image file to Firebase Storage and return public URL
   */
  static async uploadCarouselImage(
    file: Buffer, 
    fileName: string, 
    contentType: string
  ): Promise<string> {
    try {
      const bucket = adminStorage.bucket();
      const storageFileName = `carousel/${Date.now()}_${fileName}`;
      const fileUpload = bucket.file(storageFileName);
      
      await fileUpload.save(file, {
        metadata: {
          contentType: contentType,
          metadata: {
            originalName: fileName
          }
        }
      });
      
      // Make file publicly accessible
      await fileUpload.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${storageFileName}`;
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading carousel image:', error);
      throw new Error('Failed to upload carousel image');
    }
  }
}