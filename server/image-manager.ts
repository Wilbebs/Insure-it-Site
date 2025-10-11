// Image management service for Firebase Storage integration
import { adminDb, adminStorage } from './firebase-admin.js';
import { InsurancePageImages } from '@shared/types.js';
import { collection, doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export class ImageManager {
  /**
   * Initialize default carousel images in Firebase Storage
   */
  static async initializeCarouselImages(): Promise<void> {
    try {
      // Check if carousel images are already configured
      const carouselImagesDoc = doc(adminDb, 'site_config', 'carousel_images');
      const configDoc = await getDoc(carouselImagesDoc);
      
      if (!configDoc.exists) {
        // Default image URLs - Different images for carousel/grid display
        const defaultImages: InsurancePageImages = {
          carouselImages: {
            auto: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            home: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600", 
            life: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            health: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
            commercial: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
          }
        };

        // Save to Firestore
        await setDoc(carouselImagesDoc, {
          ...defaultImages,
          lastUpdated: Timestamp.fromDate(new Date()),
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
      const carouselImagesDoc = doc(adminDb, 'site_config', 'carousel_images');
      const configDoc = await getDoc(carouselImagesDoc);
      
      if (configDoc.exists()) {
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
      const carouselImagesDoc = doc(adminDb, 'site_config', 'carousel_images');
      const updatePath = `carouselImages.${insuranceType}`;
      await updateDoc(carouselImagesDoc, {
        [updatePath]: imageUrl,
        lastUpdated: Timestamp.fromDate(new Date())
      });

      console.log(`Updated ${insuranceType} carousel image`);
    } catch (error) {
      console.error(`Error updating ${insuranceType} carousel image:`, error);
    }
  }

  /**
   * Reset carousel images to new defaults
   */
  static async resetCarouselImages(): Promise<void> {
    try {
      const carouselImagesDoc = doc(adminDb, 'site_config', 'carousel_images');
      
      // New default image URLs - Different images for carousel/grid display
      const defaultImages: InsurancePageImages = {
        carouselImages: {
          auto: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          home: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600", 
          life: "https://images.unsplash.com/photo-1609220136736-443140cffec6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          health: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
          commercial: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
        }
      };

      // Overwrite existing configuration
      await setDoc(carouselImagesDoc, {
        ...defaultImages,
        lastUpdated: Timestamp.fromDate(new Date()),
        source: 'unsplash_updated'
      });

      console.log('Reset carousel images to new defaults');
    } catch (error) {
      console.error('Error resetting carousel images:', error);
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
      const storageFileName = `carousel/${Date.now()}_${fileName}`;
      const storageRef = ref(adminStorage, storageFileName);
      
      const uploadResult = await uploadBytes(storageRef, file, {
        contentType: contentType,
        customMetadata: {
          originalName: fileName
        }
      });
      
      const publicUrl = await getDownloadURL(uploadResult.ref);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading carousel image:', error);
      throw new Error('Failed to upload carousel image');
    }
  }
}