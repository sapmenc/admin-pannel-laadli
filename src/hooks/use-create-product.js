import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/config/api';

const createProductAPI = async (formData) => {  // Removed object destructuring
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || 'Product creation failed. Please try again.'
    );
  }

  return await response.json();
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductAPI,  // Simplified since we're passing formData directly
    onSuccess: (data) => {
      console.log('✅ Product created successfully:', data);
      // Optimistic updates options:
      // 1. Invalidate all products queries
      queryClient.invalidateQueries(['products']);
      
      // OR 2. Add the new product to existing cache
      // queryClient.setQueryData(['products'], (old) => {
      //   return { ...old, products: [data, ...old.products] };
      // });
    },
    onError: (error) => {
      console.error('❌ Product creation error:', error.message);
      // Consider adding toast notifications here
    },
    retry: 1,
    retryDelay: 1000,
  });
};