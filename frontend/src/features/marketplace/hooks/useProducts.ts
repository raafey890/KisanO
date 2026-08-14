import { useQuery } from '@tanstack/react-query';
import { marketplaceApi } from '../api/marketplaceApi';
import { MARKETPLACE_KEYS } from '../queryKeys';
import { MarketplaceProduct } from '../types';

export const useProducts = () => {
  return useQuery<MarketplaceProduct[], Error>({
    queryKey: MARKETPLACE_KEYS.products(),
    queryFn: () => marketplaceApi.getProducts(),
    staleTime: 5 * 60 * 1000,
  });
};
