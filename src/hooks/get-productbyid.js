import { useQuery } from '@tanstack/react-query';
import config from '@/config/env';

const getProductByIdAPI = async (productId) => {
  const response = await fetch(config.buildApiUrl(`products/${productId}`), {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch product');
  }

  return response.json();
};

export const useGetProductById = (productId) => {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProductByIdAPI(productId),
    onSuccess: (data) => {
      console.log('Product fetched successfully', data);
    },
    onError: (error) => {
      console.error('Error fetching product:', error.message);
    },
    retry: 1,
    retryDelay: 1000,
    enabled: !!productId, // Only run query if productId exists
  });
};