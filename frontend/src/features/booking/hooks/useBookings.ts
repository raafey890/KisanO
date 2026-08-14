import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { bookingKeys } from '../constants/queryKeys';

export const useFarmerBookings = () => {
  return useQuery({
    queryKey: bookingKeys.lists(),
    queryFn: bookingApi.getFarmerBookings,
    staleTime: 5 * 60 * 1000,
  });
};

export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: any) => bookingApi.confirmBooking(bookingData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
};

export const useUpdateFarmerBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => bookingApi.updateBookingStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: bookingKeys.lists() });
      const previousBookings = queryClient.getQueryData(bookingKeys.lists());

      queryClient.setQueryData(bookingKeys.lists(), (old: any) => {
        if (!old) return old;
        return old.map((booking: any) =>
          booking.id === id ? { ...booking, status } : booking
        );
      });

      return { previousBookings };
    },
    onError: (err, variables, context) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(bookingKeys.lists(), context.previousBookings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.lists() });
    },
  });
};
