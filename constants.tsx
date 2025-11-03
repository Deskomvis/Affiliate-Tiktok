
import { View, Affiliator, Sample, Product } from './types';
import { HomeIcon, UsersIcon, MegaphoneIcon, BeakerIcon, SparklesIcon, PackageIcon } from './components/Icons';

export const NAV_ITEMS = [
  { id: View.Dashboard, label: 'Dashboard', icon: <HomeIcon /> },
  { id: View.Products, label: 'Products', icon: <PackageIcon /> },
  { id: View.Affiliates, label: 'Affiliates', icon: <UsersIcon /> },
  { id: View.Broadcast, label: 'Broadcast', icon: <MegaphoneIcon /> },
  { id: View.Samples, label: 'Samples', icon: <BeakerIcon /> },
  { id: View.Treatment, label: 'Treatment', icon: <SparklesIcon /> },
];

// FIX: Explicitly type the array with Affiliator[] to prevent type widening on the 'tier' property.
export const INITIAL_AFFILIATORS: Affiliator[] = [
    {
        id: 'aff-1',
        name: 'Andhika',
        tiktok_account: '@mentari',
        followers: 1600,
        niche: 'Fashion',
        whatsapp: '+6281227032108',
        tier: 'Micro',
        last_activity: '2025-10-28',
    },
    {
        id: 'aff-2',
        name: 'Ayu Sari',
        tiktok_account: '@ayusari_fit',
        followers: 12500,
        niche: 'Health & Beauty',
        whatsapp: '+6281234567890',
        tier: 'Mid',
        last_activity: '2025-10-25',
    }
];

// FIX: Explicitly type the array with Sample[] to prevent type widening on the 'status' property.
export const INITIAL_SAMPLES: Sample[] = [
    {
        id: 'sample-1',
        name: 'Andhika',
        product_name: 'Serum Wajah Vitamin C',
        request_date: '2025-10-15',
        status: 'Shipped',
    },
    {
        id: 'sample-2',
        name: 'Ayu Sari',
        product_name: 'Matte Lipstick Shade "Ruby"',
        request_date: '2025-10-20',
        status: 'Processing',
    },
];

export const INITIAL_PRODUCTS: Product[] = [
    { id: 'prod-1', name: 'Serum Wajah Vitamin C', link: 'https://tokopedia.link/serum-vitc' },
    { id: 'prod-2', name: 'Matte Lipstick Shade "Ruby"', link: 'https://tokopedia.link/lipstick-ruby' },
];
