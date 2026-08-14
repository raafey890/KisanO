import { MOCK_ADMIN_EQUIPMENT, MOCK_ADMIN_VERIFICATIONS, MOCK_ADMIN_USERS } from '../constants/mockData';

export const adminApi = {
  getEquipment: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_ADMIN_EQUIPMENT;
  },

  approveEquipment: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id };
  },

  rejectEquipment: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id };
  },

  getVerifications: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_ADMIN_VERIFICATIONS;
  },

  approveVerification: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id };
  },

  rejectVerification: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id };
  },

  getUsers: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_ADMIN_USERS;
  },

  suspendUser: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id };
  }
};
