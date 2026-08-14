export interface FarmerDashboardData {
  stats: {
    totalBookings: number;
    activeRentals: number;
    upcomingServices: number;
    walletBalance: number;
  };
  recentActivities: Array<{
    id: string;
    type: string;
    title: string;
    date: string;
    status: string;
  }>;
}

export interface Equipment {
  _id: string; // The backend uses MongoDB _id
  id?: string;
  name: string;
  category: string;
  type?: string;
  location?: string;
  rate: number | string;
  price?: number;
  status: string;
  image: string;
  ownerId?: {
    _id: string;
    name: string;
    rating?: number;
  } | string;
  features?: string[];
  specs?: Record<string, string>;
  description?: string;
  rating?: number;
  reviews?: number;
}
