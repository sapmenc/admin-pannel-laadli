import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/config/api';

export const useHomeContent = () => {
  return useQuery({
    queryKey: ['website', 'home'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/website/home`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to load home content');
      return res.json();
    },
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  });
};

export const useUpdateHomeContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      // payload contains: texts, files, and remove flags
      const formData = new FormData();

      // Texts
      if (payload.storyText !== undefined) formData.append('storyText', payload.storyText);
      if (payload.luxeText !== undefined) formData.append('luxeText', payload.luxeText);
      if (payload.premiumText !== undefined) formData.append('premiumText', payload.premiumText);
      for (let i = 0; i < 4; i++) {
        if (payload.book?.[i]?.text !== undefined) {
          formData.append(`book_${i}_text`, payload.book[i].text);
        }
      }

      // Single media
      if (payload.hero instanceof File) formData.append('hero', payload.hero);
      else if (typeof payload.hero === 'string') formData.append('hero_url', payload.hero);
      if (payload.luxe instanceof File) formData.append('luxe', payload.luxe);
      else if (typeof payload.luxe === 'string') formData.append('luxe_url', payload.luxe);
      if (payload.premium instanceof File) formData.append('premium', payload.premium);
      else if (typeof payload.premium === 'string') formData.append('premium_url', payload.premium);

      // Remove flags
      if (payload.hero === null) formData.append('hero__remove', 'true');
      if (payload.luxe === null) formData.append('luxe__remove', 'true');
      if (payload.premium === null) formData.append('premium__remove', 'true');

      // Veils
      if (Array.isArray(payload.veils)) {
        for (let i = 0; i < 4; i++) {
          const item = payload.veils[i];
          if (item instanceof File) formData.append(`veils_${i}`, item);
          else if (typeof item === 'string') formData.append(`veils_${i}_url`, item);
          if (item === null) formData.append(`veils_${i}__remove`, 'true');
        }
      }

      // Book media
      if (Array.isArray(payload.book)) {
        for (let i = 0; i < 4; i++) {
          const media = payload.book[i]?.media;
          if (media instanceof File) formData.append(`book_${i}`, media);
          else if (typeof media === 'string') formData.append(`book_${i}_url`, media);
          if (media === null) formData.append(`book_${i}__remove`, 'true');
        }
      }

      const res = await fetch(`${BASE_URL}/website/home`, {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to update home content');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['website', 'home']);
    },
  });
};


