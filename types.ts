
export enum View {
  Dashboard = 'Dashboard',
  Affiliates = 'Affiliates',
  Broadcast = 'Broadcast',
  Samples = 'Samples',
  Products = 'Products',
  BankKonten = 'Bank Konten',
}

export interface Affiliator {
  id: string;
  name: string;
  tiktok_account: string;
  followers: number;
  niche: string;
  whatsapp: string;
  tier: 'New' | 'Micro' | 'Mid' | 'Macro' | 'Mega';
  last_activity: string;
  productIds: string[];
}

export interface Sample {
  id: string;
  name: string;
  productId: string;
  request_date: string;
  status: 'Requested' | 'Processing' | 'Shipped' | 'Received';
  reminder_message?: string;
}

export interface Product {
  id: string;
  name: string;
  link: string;
}

export type ContentItemType = 'category' | 'link';

export interface ContentItem {
  id: string;
  name: string;
  type: ContentItemType;
  link?: string;
  parentId: string | null;
  affiliateId?: string | null;
}