import { useMutation, useQueryClient } from '@tanstack/react-query';
import config from '@/config/env';

const createProductAPI = async ({ formData }) => {
  const response = await fetch(config.buildApiUrl('products'), {
    method: 'POST',
    credentials: 'include',
    body: formData,
 
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create product');
  }

  return response.json();
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData }) => createProductAPI({ formData }),
    onSuccess: (data) => {
      console.log('Product created successfully', data);
      // Invalidate and refetch products query to update the UI
      queryClient.invalidateQueries(['products']);
    },
    onError: (error) => {
      console.error('Error creating product:', error.message);
    },
    retry: 1,
    retryDelay: 1000,
  });
};