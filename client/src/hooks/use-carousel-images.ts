// Custom hook to fetch carousel images from Firebase backend
import { useQuery } from '@tanstack/react-query';
import { InsurancePageImages } from '@shared/types';

const fetchCarouselImages = async (): Promise<InsurancePageImages> => {
  const response = await fetch('/api/carousel-images');
  if (!response.ok) {
    throw new Error('Failed to fetch carousel images');
  }
  return response.json();
};

export function useCarouselImages() {
  return useQuery({
    queryKey: ['carousel-images'],
    queryFn: fetchCarouselImages,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}