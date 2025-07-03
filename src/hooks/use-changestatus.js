import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/config/api';

const toggleProductStatusAPI = async (productId) => {
  const response = await fetch(`${BASE_URL}/products/status/${productId}`, {
    method: 'PUT', 
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to toggle product status');
  }

  const data = await response.json();
  return data;
};

export const useToggleProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleProductStatusAPI,

   
    onMutate: async (productId) => {
      await queryClient.cancelQueries(['products']);

      const previousData = queryClient.getQueryData(['products']);

      queryClient.setQueryData(['products'], (oldData) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          products: oldData.products.map((product) =>
            product._id === productId
              ? { ...product, status: !product.status }
              : product
          ),
        };
      });

      return { previousData };
    },

   
    onError: (error, productId, context) => {
      console.error('❌ Error toggling product status:', error.message);
      if (context?.previousData) {
        queryClient.setQueryData(['products'], context.previousData);
      }
    },

    // Refetch after success or failure to ensure fresh data -- important
    onSettled: () => {
      queryClient.invalidateQueries(['products']);
    },

    onSuccess: (data) => {
      console.log('✅ Product status successfully toggled:', data);
    },
  });
};
