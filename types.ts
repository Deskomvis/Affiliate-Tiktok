
export enum View {
  Dashboard = 'Dashboard',
  Affiliates = 'Affiliates',
  Broadcast = 'Broadcast',
  Samples = 'Samples',
  Reminders = 'Reminders',
  Treatment = 'Treatment',
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
}

export interface Sample {
  id: string;
  name: string;
  request_date: string;
  status: 'Requested' | 'Processing' | 'Shipped' | 'Received';
  reminder_message?: string;
}

export interface Broadcast {
  id: string;
  broadcast_type: 'AI-generated' | 'Manual';
  message_template: string;
  delivery_schedule: string;
  target_affiliators: string;
}

export interface Reminder {
  id: string;
  reminder_type: string;
  frequency: string;
  day: string;
  message_template: string;
}

export interface Treatment {
  id: string;
  name: string;
  performance: string;
  ai_message: string;
  reward_suggestion: string;
}
