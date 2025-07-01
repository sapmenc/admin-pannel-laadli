import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/config/api';

const deleteProductAPI = async (productId) => {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    credentials: 'include', // Important for cookie-based auth
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete product');
  }

  return await response.json();
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductAPI,
    onSuccess: (data, productId) => {
      console.log('✅ Product deleted successfully:', data);
      
      // Invalidate all products queries to refetch updated list
      queryClient.invalidateQueries(['products']);
      
      // Optimistically remove the deleted product from cache
      queryClient.setQueryData(['products'], (oldData) => {
        if (!oldData) return oldData;
        
        return {
          ...oldData,
          products: oldData.products.filter(p => p._id !== productId),
          totalCount: oldData.totalCount - 1
        };
      });
    },
    onError: (error) => {
      console.error('❌ Error deleting product:', error.message);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries(['products']);
    },
    retry: 1,
    retryDelay: 1000,
  });
};