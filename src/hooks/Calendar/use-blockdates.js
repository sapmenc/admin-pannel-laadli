import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { BASE_URL } from '@/config/api';
import { format, parseISO, isSameDay } from 'date-fns';
import { toast } from 'react-toastify';

// Helper functions
const formatDate = (date) => format(date, 'yyyy-MM-dd');
const parseDate = (dateStr) => parseISO(dateStr);

// Fetch API
const fetchBlockDates = async () => {
  const response = await fetch(`${BASE_URL}/blockdates`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch blocked dates');
  }

  const data = await response.json();
  return data.map(parseDate);
};

const setBlockDatesAPI = async (dates) => {
  const datesArray = Array.isArray(dates) ? dates : [dates];
  const formattedDates = datesArray.map(formatDate);

  const response = await fetch(`${BASE_URL}/blockdates`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ blockDates: formattedDates }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to set blocked dates');
  }

  return await response.json();
};

export const useBlockedDates = () => {
  const queryClient = useQueryClient();

  const {
    data: blockedDates = [],
    isLoading,
    error,
    refetch: fetchBlockedDates,
  } = useQuery({
    queryKey: ['blockedDates'],
    queryFn: fetchBlockDates,
    onSuccess: (data) => {
      console.log('✅ Blocked dates fetched:', data);
    },
    onError: (error) => {
      console.error('❌ Fetch error:', error.message);
    },
  });

  const { mutateAsync: setAllBlockedDates } = useMutation({
    mutationFn: setBlockDatesAPI,
    onMutate: async (newDates) => {
      await queryClient.cancelQueries(['blockedDates']);
      const previousDates = queryClient.getQueryData(['blockedDates']);

      const normalizedDates = (Array.isArray(newDates) ? newDates : [newDates]).map((d) =>
        typeof d === 'string' ? parseDate(d) : d
      );

      queryClient.setQueryData(['blockedDates'], normalizedDates);
      return { previousDates };
    },
    onError: (error, _, context) => {
      if (context?.previousDates) {
        queryClient.setQueryData(['blockedDates'], context.previousDates);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(['blockedDates']);
    },
  });

  const addBlockedDate = async (date) => {
    const alreadyBlocked = blockedDates.some((d) => isSameDay(d, date));
    if (alreadyBlocked) return;

    const newDates = [...blockedDates, date];
    await setAllBlockedDates(newDates);
  };

  const removeBlockedDate = async (dateToRemove) => {
    const updatedDates = blockedDates.filter((d) => !isSameDay(d, dateToRemove));
    await setAllBlockedDates(updatedDates);
  };

  // ✅ Toggle block/unblock date with toast message
  const toggleBlockDate = async (date) => {
    const isAlreadyBlocked = blockedDates.some((d) => isSameDay(d, date));
    if (isAlreadyBlocked) {
      toast.info("This date is already blocked. Unblocking now.");
      await removeBlockedDate(date);
    } else {
      await addBlockedDate(date);
    }
  };

  return {
    blockedDates,
    loading: isLoading,
    error,
    fetchBlockedDates,
    setAllBlockedDates,
    addBlockedDate,
    removeBlockedDate,
    toggleBlockDate, // ✅ expose it
  };
};
