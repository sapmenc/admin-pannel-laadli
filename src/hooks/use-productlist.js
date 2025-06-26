import { useQuery } from '@tanstack/react-query';
import config from '@/config/env';

const getProductsAPI = async (page = 1) => {
  const response = await fetch(config.buildApiUrl(`products?page=${page}`), {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch products');
  }

  return response.json();
};

export const useGetProducts = (page = 1) => {
  return useQuery({
    queryKey: ['products', page],
    queryFn: () => getProductsAPI(page),
    onSuccess: (data) => {
      console.log('Products fetched successfully', data);
    },
    onError: (error) => {
      console.error('Error fetching products:', error.message);
    },
    retry: 1,
    retryDelay: 1000,
    keepPreviousData: true,
  });
};