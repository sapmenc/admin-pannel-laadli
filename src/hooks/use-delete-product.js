import { useMutation, useQueryClient } from '@tanstack/react-query';
import config from '@/config/env';

const deleteProductAPI = async (productId) => {
  const response = await fetch(config.buildApiUrl(`products/${productId}`), {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete product');
  }

  return response.json();
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId) => deleteProductAPI(productId),
    onSuccess: (data, productId) => {
      console.log('Product deleted successfully', data);
      
      queryClient.invalidateQueries(['products']);
      // Remove the specific product from cache if it exists
      queryClient.removeQueries(['product', productId]);
    },
    onError: (error) => {
      console.error('Error deleting product:', error.message);
    },
    retry: 1,
    retryDelay: 1000,
  });
};