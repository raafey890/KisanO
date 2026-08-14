export const aidoctorKeys = {
  all: ['aidoctor'] as const,
  scans: () => [...aidoctorKeys.all, 'scans'] as const,
  scanDetails: (id: string) => [...aidoctorKeys.all, 'scan', id] as const,
};
