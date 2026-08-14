import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceApi } from '../api/marketplaceApi';
import { MARKETPLACE_KEYS } from '../queryKeys';
import { NaruuListing, NaruuPayload } from '../types';

export const useNaruuListings = (district?: string, village?: string) => {
  return useQuery<NaruuListing[], Error>({
    queryKey: MARKETPLACE_KEYS.naruuListingsFiltered({ district, village }),
    queryFn: () => marketplaceApi.getNaruuListings(district, village),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateNaruu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NaruuPayload) => marketplaceApi.createNaruuListing(payload),
    onMutate: async (newListing) => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: MARKETPLACE_KEYS.naruuListings() });

      // Snapshot the previous value
      const previousListings = queryClient.getQueryData(MARKETPLACE_KEYS.naruuListingsFiltered({}));

      // Optimistically update to the new value
      const optimisticListing: NaruuListing = {
        _id: Math.random().toString(),
        ...newListing,
        farmer: {}, // Add dummy farmer info for UI mapping
        createdAt: new Date().toISOString(),
      };

      // Invalidate the generic key to affect all filtered instances
      // Or manually update the exact caches. Here we just invalidate on success, 
      // but for onMutate we can inject it into the currently active query if needed.
      // But because filters can vary, invalidation on success is safest for other queries.
      
      return { previousListings };
    },
    onError: (err, newListing, context) => {
      // Rollback on error
      if (context?.previousListings) {
        queryClient.setQueryData(MARKETPLACE_KEYS.naruuListingsFiltered({}), context.previousListings);
      }
    },
    onSettled: () => {
      // Invalidate to refetch real data
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_KEYS.naruuListings() });
    },
  });
};

export const useDeleteNaruu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => marketplaceApi.deleteNaruuListing(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: MARKETPLACE_KEYS.naruuListings() });

      const previousListings = queryClient.getQueryData<NaruuListing[]>(MARKETPLACE_KEYS.naruuListingsFiltered({}));

      // Optimistically remove the listing
      if (previousListings) {
        queryClient.setQueryData<NaruuListing[]>(
          MARKETPLACE_KEYS.naruuListingsFiltered({}),
          previousListings.filter((listing) => listing._id !== id && listing.id !== id)
        );
      }

      return { previousListings };
    },
    onError: (err, id, context) => {
      if (context?.previousListings) {
        queryClient.setQueryData(MARKETPLACE_KEYS.naruuListingsFiltered({}), context.previousListings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: MARKETPLACE_KEYS.naruuListings() });
    },
  });
};
