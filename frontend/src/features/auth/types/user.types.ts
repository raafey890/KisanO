export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: Status;
  profile?: Profile;
}

export interface Profile {
  avatarUrl?: string;
  phoneNumber?: string;
  address?: string;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  FARMER = 'FARMER',
  SUPPLIER = 'SUPPLIER',
}

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}
