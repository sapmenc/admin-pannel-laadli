import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/config/api';

const getProductsAPI = async (page) => {
  const response = await fetch(`${BASE_URL}/products?page=${page}`, {
    method: 'GET',
    credentials: 'include', // Important for cookie-based auth
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch products');
  }

  const data = await response.json();

  // Return whole object so UI can use total, page, pages
  return {
    products: data.products || [],
    currentPage: data.page,
    totalPages: data.pages,
    totalCount: data.total,
  };
};

export const useGetProducts = (page) => {
  return useQuery({
    queryKey: ['products', page],
    queryFn: () => getProductsAPI(page),
    enabled: !!page,
    keepPreviousData: true,
    retry: 1,
    retryDelay: 1000,
    onSuccess: (data) => {
      console.log('✅ Products fetched successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Error fetching products:', error.message);
    },
  });
};
