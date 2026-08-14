import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { adminKeys } from '../constants/queryKeys';

// --- Equipment ---
export const useAdminEquipment = () => {
  return useQuery({
    queryKey: adminKeys.equipment(),
    queryFn: adminApi.getEquipment,
    staleTime: 5 * 60 * 1000,
  });
};

export const useApproveEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.approveEquipment(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminKeys.equipment() });
      const previous = queryClient.getQueryData(adminKeys.equipment());
      queryClient.setQueryData(adminKeys.equipment(), (old: any) => {
        if (!old) return old;
        return old.map((item: any) => item.id === id ? { ...item, status: 'Active' } : item);
      });
      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) queryClient.setQueryData(adminKeys.equipment(), context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.equipment() });
    },
  });
};

export const useRejectEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.rejectEquipment(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminKeys.equipment() });
      const previous = queryClient.getQueryData(adminKeys.equipment());
      queryClient.setQueryData(adminKeys.equipment(), (old: any) => {
        if (!old) return old;
        return old.map((item: any) => item.id === id ? { ...item, status: 'Rejected' } : item);
      });
      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) queryClient.setQueryData(adminKeys.equipment(), context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.equipment() });
    },
  });
};


// --- Verifications ---
export const useAdminVerifications = () => {
  return useQuery({
    queryKey: adminKeys.verifications(),
    queryFn: adminApi.getVerifications,
    staleTime: 5 * 60 * 1000,
  });
};

export const useApproveVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.approveVerification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminKeys.verifications() });
      const previous = queryClient.getQueryData(adminKeys.verifications());
      queryClient.setQueryData(adminKeys.verifications(), (old: any) => {
        if (!old) return old;
        return old.map((item: any) => item.id === id ? { ...item, status: 'Approved' } : item);
      });
      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) queryClient.setQueryData(adminKeys.verifications(), context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.verifications() });
    },
  });
};

export const useRejectVerification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.rejectVerification(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminKeys.verifications() });
      const previous = queryClient.getQueryData(adminKeys.verifications());
      queryClient.setQueryData(adminKeys.verifications(), (old: any) => {
        if (!old) return old;
        return old.map((item: any) => item.id === id ? { ...item, status: 'Rejected' } : item);
      });
      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) queryClient.setQueryData(adminKeys.verifications(), context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.verifications() });
    },
  });
};


// --- Users ---
export const useAdminUsers = () => {
  return useQuery({
    queryKey: adminKeys.users(),
    queryFn: adminApi.getUsers,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSuspendUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.suspendUser(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: adminKeys.users() });
      const previous = queryClient.getQueryData(adminKeys.users());
      queryClient.setQueryData(adminKeys.users(), (old: any) => {
        if (!old) return old;
        return old.map((item: any) => item.id === id ? { ...item, status: 'Suspended' } : item);
      });
      return { previous };
    },
    onError: (err, id, context) => {
      if (context?.previous) queryClient.setQueryData(adminKeys.users(), context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() });
    },
  });
};
