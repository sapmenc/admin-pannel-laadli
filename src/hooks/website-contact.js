import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/config/api';

export const useContactContent = () => {
  return useQuery({
    queryKey: ['website', 'contact'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/website/contact`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load contact content');
      return res.json();
    },
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  });
};

export const useUpdateContactContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ hero, contentText }) => {
      const fd = new FormData();
      if (typeof contentText === 'string') fd.append('contentText', contentText);
      if (hero instanceof File) fd.append('hero', hero);
      else if (typeof hero === 'string') fd.append('hero_url', hero);
      if (hero === null) fd.append('hero__remove', 'true');
      const res = await fetch(`${BASE_URL}/website/contact`, { method: 'PUT', body: fd, credentials: 'include' });
      if (!res.ok) throw new Error('Failed to update contact content');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(['website', 'contact']),
  });
};



