export interface OwnerEquipment {
  _id: string; // MongoDB _id
  id?: string;
  name?: string;
  equipmentName?: string;
  category?: string;
  equipmentType?: string;
  rate?: number | string;
  dailyRate?: number | string;
  status?: string;
  availability?: string;
  image?: string;
  ownerId?: string | Record<string, any>;
  [key: string]: any;
}

export interface BookingRequest {
  _id?: string;
  id?: string;
  equipmentId?: string | Record<string, any>;
  farmerId?: string | Record<string, any>;
  startDate?: string;
  endDate?: string;
  status?: string;
  totalAmount?: number;
  [key: string]: any;
}

export interface OwnerDashboardStats {
  activeEquipment: number;
  pendingBookings: number;
  completedBookings: number;
  totalRevenue: number;
}
