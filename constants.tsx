import { View, Affiliator, Sample, Reminder } from './types';
import { HomeIcon, UsersIcon, MegaphoneIcon, BeakerIcon, BellIcon, SparklesIcon } from './components/Icons';

export const NAV_ITEMS = [
  { id: View.Dashboard, label: 'Dashboard', icon: <HomeIcon /> },
  { id: View.Affiliates, label: 'Affiliates', icon: <UsersIcon /> },
  { id: View.Broadcast, label: 'Broadcast', icon: <MegaphoneIcon /> },
  { id: View.Samples, label: 'Samples', icon: <BeakerIcon /> },
  { id: View.Reminders, label: 'Reminders', icon: <BellIcon /> },
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
    }
];

// FIX: Explicitly type the array with Sample[] to prevent type widening on the 'status' property.
export const INITIAL_SAMPLES: Sample[] = [];

// FIX: Explicitly type the array with Reminder[] for consistency and type safety.
export const INITIAL_REMINDERS: Reminder[] = [];