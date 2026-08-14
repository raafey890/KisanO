import { MOCK_SCANS } from '../constants/mockData';

export const aidoctorApi = {
  getScans: async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_SCANS;
  },

  getScanDetails: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      id: id || 'NEW-SCAN',
      date: 'Just Now',
      cropName: 'Cotton',
      diseaseName: 'Bacterial Blight',
      status: 'Diseased',
      confidence: '94%',
      severity: 'High',
      summary: 'The AI has detected signs of Bacterial Blight on the cotton leaves. Immediate action is required to prevent it from spreading to healthy parts of the crop.',
      diseaseInfo: {
        description: 'Bacterial blight is a highly contagious disease caused by Xanthomonas axonopodis. It primarily affects leaves, stems, and bolls of cotton plants.',
        symptoms: ['Water-soaked angular spots on leaves', 'Blackening of stem (blackarm)', 'Premature boll drop'],
        causes: ['Infected seeds', 'Rain splashes spreading bacteria', 'High humidity and warm temperatures'],
        spread: 'Spreads rapidly during monsoon through wind-driven rain and infected farming tools.',
        affectedCrops: ['Cotton', 'Beans', 'Rice']
      },
      treatments: {
        organic: [
          'Prune and destroy infected leaves immediately.',
          'Apply copper-based organic sprays.',
          'Ensure proper spacing between plants to improve air circulation.'
        ],
        chemical: [
          'Spray Copper Oxychloride (50% WP) @ 2.5g/L of water.',
          'Mix with Streptocycline (1g/10L water) for severe infections.',
          'Apply 2-3 sprays at 15-day intervals.'
        ],
        safety: 'Always wear protective gear (mask, gloves) when mixing and spraying chemicals.'
      },
      prevention: [
        'Use certified disease-free seeds for next planting.',
        'Practice crop rotation with non-host crops like cereals.',
        'Avoid overhead irrigation to keep foliage dry.'
      ]
    };
  },

  deleteScan: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { id };
  },

  analyzeImage: async (file: File) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { 
      id: `SCN-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      crop: 'Unknown', 
      disease: 'Pending Analysis',
      severity: 'Unknown',
      color: 'bg-gray-100 text-gray-700 border-gray-200'
    };
  }
};
