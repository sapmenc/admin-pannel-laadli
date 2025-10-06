import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/config/api';

export const useOurStoryContent = () => {
  return useQuery({
    queryKey: ['website', 'ourstory'],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/website/ourstory`, { credentials: 'include' });
      if (!res.ok) throw new Error('Failed to load our story content');
      return res.json();
    },
    refetchOnMount: 'always',
    refetchOnReconnect: 'always',
    refetchOnWindowFocus: 'always',
  });
};

export const useUpdateOurStoryContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const fd = new FormData();

      // texts
      if (typeof payload.section1Text === 'string') fd.append('section1_text', payload.section1Text);
      if (typeof payload.section2Text === 'string') fd.append('section2_text', payload.section2Text);
      if (typeof payload.section3Text === 'string') fd.append('section3_text', payload.section3Text);

      // single media fields
      const mapMedia = (key, value) => {
        if (value instanceof File) fd.append(key, value);
        else if (typeof value === 'string') fd.append(`${key}_url`, value);
        else if (value === null) fd.append(`${key}__remove`, 'true');
      };
      mapMedia('hero', payload.hero);
      mapMedia('section1', payload.section1Media);
      mapMedia('section2', payload.section2Media);
      mapMedia('section3', payload.section3Media);

      // last 3 (images or reel URLs)
      for (let i = 0; i < 3; i++) {
        const v = payload.last?.[i];
        if (v instanceof File) fd.append(`last_${i}`, v);
        else if (typeof v === 'string') fd.append(`last_${i}_url`, v);
        else if (v === null) fd.append(`last_${i}__remove`, 'true');
      }

      let res = await fetch(`${BASE_URL}/website/ourstory`, { method: 'PUT', body: fd, credentials: 'include' });
      if (!res.ok) {
        // fallback to POST (in case PUT is blocked)
        res = await fetch(`${BASE_URL}/website/ourstory`, { method: 'POST', body: fd, credentials: 'include' });
      }
      if (!res.ok) throw new Error('Failed to update our story content');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries(['website', 'ourstory']),
  });
};


