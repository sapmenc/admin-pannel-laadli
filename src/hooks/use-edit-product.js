import { useMutation, useQueryClient } from '@tanstack/react-query';
import config from '@/config/env';

const updateProductAPI = async ({ id, updates, files }) => {
  const formData = new FormData();
  
  // Append all updates to formData
  Object.keys(updates).forEach(key => {
    formData.append(key, updates[key]);
  });

  // Append files if they exist
  if (files && files.length > 0) {
    files.forEach(file => {
      formData.append('files', file);
    });
  }

  const response = await fetch(config.buildApiUrl(`products/${id}`), {
    method: 'PUT',
    credentials: 'include',
    body: formData,
   
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update product');
  }

  return response.json();
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates, files }) => updateProductAPI({ id, updates, files }),
    onSuccess: (data, variables) => {
      console.log('Product updated successfully', data);
  
      queryClient.invalidateQueries(['products']);
   
      queryClient.setQueryData(['product', variables.id], data);
    },
    onError: (error) => {
      console.error('Error updating product:', error.message);
    },
    retry: 1,
    retryDelay: 1000,
  });
};