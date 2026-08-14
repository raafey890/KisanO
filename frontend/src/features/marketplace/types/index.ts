export interface NaruuListing {
  _id: string;
  id?: string;
  cropName: string;
  qty: string;
  price: string;
  phone: string;
  village: string;
  district: string;
  state: string;
  farmer: any;
  createdAt: string;
}

export interface NaruuPayload {
  cropName: string;
  qty: string;
  price: string;
  phone: string;
  village: string;
  district: string;
  state: string;
}

export interface MarketplaceProduct {
  id: number | string;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  seller: string;
  location: string;
  isFeatured?: boolean;
  stock?: number;
}
