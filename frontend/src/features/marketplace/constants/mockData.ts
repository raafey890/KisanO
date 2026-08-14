import tomatoSeedsImg from '../../../assets/products/tomato_seeds.jpg';
import npkFertilizerImg from '../../../assets/products/npk_fertilizer.jpg';
import rotavatorBladeImg from '../../../assets/products/rotavator_blade.jpg';
import dripIrrigationImg from '../../../assets/products/drip_irrigation.jpg';
import neemOilImg from '../../../assets/products/neem_oil.jpg';
import cattleFeedImg from '../../../assets/products/cattle_feed.jpg';
import mangoSeedlingImg from '../../../assets/products/mango_seedling.jpg';
import handTrowelImg from '../../../assets/products/hand_trowel.jpg';

export const CATEGORIES = [
  'All', 'Seeds', 'Seedlings', 'Fertilizers', 'Pesticides', 
  'Farm Tools', 'Irrigation', 'Organic Products', 'Animal Feed'
];

export const MOCK_PRODUCTS = [
  {
    id: 'p1',
    name: 'Premium Hybrid Tomato Seeds (100g)',
    category: 'Seeds',
    sellerName: 'Kisan Seeds Co.',
    price: 450,
    originalPrice: 500,
    discount: '10% OFF',
    rating: 4.8,
    reviews: 124,
    availability: 'In Stock',
    deliveryEstimate: 'Tomorrow',
    image: tomatoSeedsImg,
    isFeatured: true
  },
  {
    id: 'p2',
    name: 'Organic NPK Fertilizer (50kg)',
    category: 'Fertilizers',
    sellerName: 'GreenFarm Organics',
    price: 1200,
    originalPrice: 1500,
    discount: '20% OFF',
    rating: 4.6,
    reviews: 89,
    availability: 'In Stock',
    deliveryEstimate: '2 Days',
    image: npkFertilizerImg,
    isFeatured: true
  },
  {
    id: 'p3',
    name: 'Heavy Duty Steel Rotavator Blade',
    category: 'Farm Tools',
    sellerName: 'Agro Implement Tools',
    price: 850,
    originalPrice: null,
    discount: null,
    rating: 4.9,
    reviews: 210,
    availability: 'Few Left',
    deliveryEstimate: '3 Days',
    image: rotavatorBladeImg,
    isFeatured: true
  },
  {
    id: 'p4',
    name: 'Drip Irrigation Starter Kit',
    category: 'Irrigation',
    sellerName: 'AquaFlow Solutions',
    price: 3400,
    originalPrice: 4000,
    discount: '15% OFF',
    rating: 4.7,
    reviews: 56,
    availability: 'In Stock',
    deliveryEstimate: 'Tomorrow',
    image: dripIrrigationImg,
    isFeatured: true
  },
  {
    id: 'p5',
    name: 'Neem Oil Natural Pesticide (1L)',
    category: 'Pesticides',
    sellerName: 'BioSafe Farms',
    price: 380,
    originalPrice: 400,
    discount: '5% OFF',
    rating: 4.5,
    reviews: 34,
    availability: 'In Stock',
    deliveryEstimate: 'Tomorrow',
    image: neemOilImg,
    isFeatured: false
  },
  {
    id: 'p6',
    name: 'Premium Cattle Feed (25kg)',
    category: 'Animal Feed',
    sellerName: 'Nandi Feeds Ltd.',
    price: 950,
    originalPrice: null,
    discount: null,
    rating: 4.4,
    reviews: 112,
    availability: 'Out of Stock',
    deliveryEstimate: 'Unknown',
    image: cattleFeedImg,
    isFeatured: false
  },
  {
    id: 'p7',
    name: 'Mango Seedlings (Alphonso) - Pack of 5',
    category: 'Seedlings',
    sellerName: 'Ratnagiri Nursery',
    price: 600,
    originalPrice: null,
    discount: null,
    rating: 4.8,
    reviews: 45,
    availability: 'In Stock',
    deliveryEstimate: '3 Days',
    image: mangoSeedlingImg,
    isFeatured: false
  },
  {
    id: 'p8',
    name: 'Multi-purpose Hand Trowel',
    category: 'Farm Tools',
    sellerName: 'Agro Implement Tools',
    price: 250,
    originalPrice: 300,
    discount: '16% OFF',
    rating: 4.3,
    reviews: 78,
    availability: 'In Stock',
    deliveryEstimate: 'Tomorrow',
    image: handTrowelImg,
    isFeatured: false
  }
];
