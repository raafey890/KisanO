export const operatorKeys = {
  all: ['operator'] as const,
  jobs: () => [...operatorKeys.all, 'jobs'] as const,
  services: () => [...operatorKeys.all, 'services'] as const,
  earnings: () => [...operatorKeys.all, 'earnings'] as const,
  stats: () => [...operatorKeys.all, 'stats'] as const,
};
