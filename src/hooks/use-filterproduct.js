import { useQuery } from '@tanstack/react-query';
import { BASE_URL } from '@/config/api';

const getFilteredProductsAPI = async ({ page, category, status, search }) => {
  const params = new URLSearchParams();

  if (page) params.append('page', page);
  if (category) params.append('category', category);
  if (typeof status === 'boolean') {
    params.append('status', status.toString());
  }
  if (search) params.append('search', search);

  const response = await fetch(`${BASE_URL}/products?${params.toString()}`, {
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

  const data = await response.json();

  return {
    products: data.products || [],
    currentPage: data.page,
    totalPages: data.pages,
    totalCount: data.total,
  };
};

export const useFilteredProducts = ({ page, category, status, search }) => {
  return useQuery({
    queryKey: ['products', page, category, status, search],
    queryFn: () => getFilteredProductsAPI({ page, category, status, search }),
    enabled: !!page,
    keepPreviousData: true,
    retry: 1,
    retryDelay: 1000,
    onSuccess: (data) => {
      console.log('✅ Filtered Products fetched successfully:', data);
    },
    onError: (error) => {
      console.error('❌ Error fetching filtered products:', error.message);
    },
  });
};
