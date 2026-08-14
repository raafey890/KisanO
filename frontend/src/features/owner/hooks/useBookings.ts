import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ownerApi } from '../api/ownerApi';
import { BookingRequest } from '../types';

export const useBookings = () => {
  return useQuery<BookingRequest[], Error>({
    queryKey: ['ownerBookings'],
    queryFn: ownerApi.getBookings,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      ownerApi.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ownerBookings'] });
    },
  });
};
