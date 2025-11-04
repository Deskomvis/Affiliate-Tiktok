
import { View, Affiliator, Sample, Product, ContentItem } from './types';
import { HomeIcon, UsersIcon, MegaphoneIcon, BeakerIcon, PackageIcon, FolderIcon } from './components/Icons';

export const NAV_ITEMS = [
  { id: View.Dashboard, label: 'Dashboard', icon: <HomeIcon /> },
  { id: View.Products, label: 'Products', icon: <PackageIcon /> },
  { id: View.Affiliates, label: 'Affiliates', icon: <UsersIcon /> },
  { id: View.Broadcast, label: 'Broadcast', icon: <MegaphoneIcon /> },
  { id: View.Samples, label: 'Samples', icon: <BeakerIcon /> },
  { id: View.BankKonten, label: 'Bank Konten', icon: <FolderIcon /> },
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
        productIds: ['prod-1'],
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
        productIds: ['prod-1', 'prod-2'],
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

export const INITIAL_CONTENT_BANK_ITEMS: ContentItem[] = [];


export interface BroadcastTemplate {
  title: string;
  message: string;
}

export interface TemplateCategory {
  category: string;
  templates: BroadcastTemplate[];
}

export const BROADCAST_TEMPLATES: TemplateCategory[] = [
  {
    category: "Onboarding & Welcome",
    templates: [
      {
        title: "Pesan Selamat Datang",
        message: "Halo kak {name}, selamat datang di tim affiliate kami! Senang sekali bisa bekerja sama denganmu. Cek link berikut untuk panduan awal ya: [Link Panduan]",
      },
      {
        title: "Tugas Pertama",
        message: "Hai {name}! Siap untuk tugas pertamamu? Coba buat 1 video perkenalan produk andalan kita, yaitu [nama produk]. Cek produknya di sini ya: [link produk]. Ditunggu kreasinya!",
      },
      {
        title: "Info Produk Sampel",
        message: "Kak {name}, sample produk [nama produk] mu sedang kami siapkan ya. Sambil menunggu, bisa pelajari dulu detail produknya di sini: [link produk]",
      },
    ],
  },
  {
    category: "Engagement & Motivasi",
    templates: [
      {
        title: "Motivasi Mingguan",
        message: "Semangat pagi {name}! Yuk, minggu ini kita kejar target bareng-bareng. Jangan lupa posting konten yang engaging ya! 💪",
      },
      {
        title: "Ide Konten Produk",
        message: "Butuh ide konten, {name}? Coba deh bikin video 'A Day with [nama produk]'. Pasti seru! Cek produknya di [link produk]",
      },
      {
        title: "Menyapa & Cek Kabar",
        message: "Hai {name}, gimana kabarnya? Ada kendala atau butuh bantuan? Jangan ragu buat tanya ya, kami siap bantu!",
      },
    ],
  },
  {
    category: "Promosi & Campaign",
    templates: [
      {
        title: "Info Flash Sale",
        message: "URGENT! Kak {name}, besok akan ada Flash Sale 12.12 untuk produk [nama produk]! Siapkan konten terbaikmu. Info lengkap komisi & materi ada di sini: [Link Materi Promo]. Link produk: [link produk]",
      },
      {
        title: "Peluncuran Produk Baru",
        message: "Kabar gembira, {name}! Kita baru aja launching [nama produk] yang keren banget. Jadilah yang pertama mereview dan dapatkan komisi spesial! Cek di sini: [link produk]",
      },
      {
        title: "Pengingat Campaign",
        message: "Jangan lupa, {name}! Campaign {Nama Campaign} akan berakhir 3 hari lagi. Yuk maksimalkan postinganmu untuk dapat bonus komisi!",
      },
       {
        title: "Stok Produk Menipis",
        message: "Hi {name}, info penting! Stok produk best seller kita, [nama produk], sudah mulai menipis. Ajak followers kamu buat checkout sekarang sebelum kehabisan! Link produk: [link produk]",
      },
    ],
  },
  {
    category: "Edukasi & Tips",
    templates: [
      {
        title: "Tips Algoritma TikTok",
        message: "Hi {name}, mau videomu FYP? Coba deh pakai sound yang lagi viral ini dan posting di jam-jam prime time (19.00-21.00). Good luck!",
      },
      {
        title: "Highlight Keunggulan Produk",
        message: "Tips pro buat kak {name}: Saat review [nama produk], jangan lupa highlight keunggulan utamanya ya. Ini akan bantu yakinkan calon pembeli. Link produk: [link produk]",
      },
      {
        title: "Review Performa",
        message: "Halo {name}, performa kontenmu bulan lalu bagus lho! Coba tingkatkan lagi di bagian {Area Peningkatan} untuk hasil yang lebih maksimal. Semangat!",
      },
    ],
  },
];