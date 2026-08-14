// @ts-ignore
import api from '../../../services/api';
import { MARKETPLACE_ENDPOINTS } from './marketplaceEndpoints';
import { NaruuListing, NaruuPayload, MarketplaceProduct } from '../types';

import { MOCK_PRODUCTS } from '../constants/mockData';

export const marketplaceApi = {
  getNaruuListings: async (district?: string, village?: string): Promise<NaruuListing[]> => {
    const params: Record<string, string> = {};
    if (district) params.district = district;
    if (village) params.village = village;
    
    const response = await api.get<any, { data: { data: NaruuListing[] } }>(
      MARKETPLACE_ENDPOINTS.NARUU,
      { params }
    );
    // Support both wrapped structures based on the legacy component
    return response?.data?.data || (response?.data as unknown as NaruuListing[]) || [];
  },

  createNaruuListing: async (payload: NaruuPayload): Promise<NaruuListing> => {
    const response = await api.post<any, { data: { data: NaruuListing } }>(
      MARKETPLACE_ENDPOINTS.NARUU,
      payload
    );
    return response?.data?.data || (response?.data as unknown as NaruuListing);
  },

  deleteNaruuListing: async (id: string): Promise<void> => {
    await api.delete(MARKETPLACE_ENDPOINTS.NARUU_DETAIL(id));
  },

  getProducts: async (): Promise<MarketplaceProduct[]> => {
    // TODO: Backend integration pending
    return MOCK_PRODUCTS;
  }
};
