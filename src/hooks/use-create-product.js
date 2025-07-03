import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/config/api';

const createProductAPI = async (formData) => {  // Removed object destructuring ... 
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
    mutationFn: createProductAPI, 
    onSuccess: (data) => {
      console.log('✅ Product created successfully:', data);
     
      queryClient.invalidateQueries(['products']);
      
    },
    onError: (error) => {
      console.error('❌ Product creation error:', error.message);
      // Consider adding toast notifications here
    },
    retry: 1,
    retryDelay: 1000,
  });
};