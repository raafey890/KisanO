export const MARKETPLACE_KEYS = {
  all: ['marketplace'] as const,
  naruuListings: () => [...MARKETPLACE_KEYS.all, 'naruu'] as const,
  naruuListingsFiltered: (filters: Record<string, any>) => [...MARKETPLACE_KEYS.naruuListings(), filters] as const,
  products: () => [...MARKETPLACE_KEYS.all, 'products'] as const,
  wishlist: () => [...MARKETPLACE_KEYS.all, 'wishlist'] as const,
};
