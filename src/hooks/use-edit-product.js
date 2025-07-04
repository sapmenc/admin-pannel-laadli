import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/config/api';

const updateProductAPI = async ({ id, updates, files }) => {
  console.groupCollapsed('🔄 updateProductAPI called');
  console.log('Product ID:', id);
  console.log('Updates:', updates);
  console.log('Files:', files);

  try {
    const formData = new FormData();

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        console.warn(`⚠️ Skipping ${key} because value is undefined/null`);
        return;
      }

      if (Array.isArray(value)) {
        // ✅ Fix: Append each item individually (for media URLs)
        value.forEach((v) => {
          formData.append(key, v);
        });
      } else if (typeof value === 'object' && !(value instanceof File)) {
        console.log(`📦 Stringifying object field: ${key}`);
        formData.append(key, JSON.stringify(value));
      } else {
        console.log(`📝 Adding simple field: ${key}`);
        formData.append(key, value);
      }
    });

    // 2. Handle file uploads
    if (files?.length) {
      console.log(`📁 Adding ${files.length} file(s)`);
      files.forEach((file) => {
        formData.append('media', file);
      });
    }

    // 3. API call
    console.log('🚀 Sending PATCH request...');
    const response = await fetch(`${BASE_URL}/products/${id}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('❌ Server error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      throw new Error(errorData?.message || `Server responded with ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Update successful:', result);
    return result;
  } catch (error) {
    console.error('🔥 updateProductAPI failed:', error);
    throw error;
  } finally {
    console.groupEnd();
  }
};

export const useUpdateProduct = (options = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductAPI,
    ...options,

    onMutate: async (variables) => {
      console.groupCollapsed('🔄 useUpdateProduct optimistic update');
      try {
        // Cancel outgoing refetches
        await queryClient.cancelQueries(['product', variables.id]);

        const previousProduct = queryClient.getQueryData(['product', variables.id]);

        // Optimistically update cache
        queryClient.setQueryData(['product', variables.id], (old) => ({
          ...old,
          ...variables.updates,
          media: variables.files
            ? [...(old?.media || []), ...variables.files.map(f => ({ name: f.name, type: 'optimistic' }))]
            : old?.media
        }));

        console.log('🚀 Optimistic update applied');
        return { previousProduct };
      } finally {
        console.groupEnd();
      }
    },

    onError: (error, variables, context) => {
      console.group('❌ useUpdateProduct error');
      console.error('Error details:', {
        error: error.message,
        variables,
        context
      });

      if (context?.previousProduct) {
        console.log('↩️ Rolling back optimistic update');
        queryClient.setQueryData(['product', variables.id], context.previousProduct);
      }

      options.onError?.(error, variables, context);
      console.groupEnd();
    },

    onSuccess: (data, variables, context) => {
      console.group('✅ useUpdateProduct success');
      console.log('Updated product data:', data);
      console.log('Mutation variables:', variables);

      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['product', variables.id]);

      options.onSuccess?.(data, variables, context);
      console.groupEnd();
    },

    onSettled: (data, error, variables) => {
      console.log('🏁 Mutation settled - finalizing state');
      options.onSettled?.(data, error, variables);
    },

    retry: (failureCount, error) => {
      const shouldRetry = error.message.includes('Failed to fetch') && failureCount < 2;
      console.log(`♻️ Retry ${failureCount + 1}/2:`, shouldRetry ? 'Yes' : 'No');
      return shouldRetry;
    },
    retryDelay: 1500
  });
};
