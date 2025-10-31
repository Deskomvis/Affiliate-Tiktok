
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
    { id: '1', name: 'Ayu Sari', tiktok_account: '@ayusari_fit', followers: 12500, niche: 'Health & Beauty', whatsapp: '+6281234567890', tier: 'Mid', last_activity: '2025-10-28' },
    { id: '2', name: 'Budi Santoso', tiktok_account: '@budicontent', followers: 8900, niche: 'Lifestyle', whatsapp: '+6289988776655', tier: 'Micro', last_activity: '2025-10-27' },
    { id: '3', name: 'Rizky Anwar', tiktok_account: '@rizkygaming', followers: 150000, niche: 'Gaming', whatsapp: '+6281122334455', tier: 'Macro', last_activity: '2025-10-29' }
];

// FIX: Explicitly type the array with Sample[] to prevent type widening on the 'status' property.
export const INITIAL_SAMPLES: Sample[] = [
    { id: '1', name: 'Ayu Sari', request_date: '2025-10-20', status: 'Shipped', reminder_message: 'Hi Ayu, paket sample kamu sudah dikirim ya! Jangan lupa konfirmasi penerimaan 😊' },
    { id: '2', name: 'Budi Santoso', request_date: '2025-10-23', status: 'Requested', reminder_message: 'Hi Budi, tim sedang menyiapkan sample kamu. Akan dikirim dalam 2 hari.' }
];

// FIX: Explicitly type the array with Reminder[] for consistency and type safety.
export const INITIAL_REMINDERS: Reminder[] = [
    { id: '1', reminder_type: 'Posting Deadline', frequency: 'Weekly', day: 'Every Friday', message_template: 'Hi {name}, jangan lupa upload konten promo minggu ini sebelum Jumat malam ya! 📅' }
];