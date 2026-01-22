
export type Platform = 'TikTok' | 'YouTube' | 'Instagram';
export type AccountStatus = 'Active' | 'Testing' | 'Banned' | 'Scaling';

export interface Account {
  id: string;
  name: string;
  platform: Platform[]; // Alterado para Array para suportar múltiplas redes
  niche: string;
  status: AccountStatus;
  creationDate: string;
  followers: number;
  totalViews: number;
  revenue: number;
  notes?: string;
}

export interface VideoPost {
  id: string;
  accountId: string;
  title: string;
  url: string;
  postDate: string;
  contentType: string;
  productionCost: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  retention: number;
  ctr: number;
  revenue: number;
  classification: 'Flop' | 'Average' | 'Viral';
}

export interface FinanceRecord {
  id: string;
  type: 'Revenue' | 'Expense';
  amount: number;
  category: string;
  date: string;
  accountId?: string;
  videoId?: string;
  description: string;
}

export interface KanbanTask {
  id: string;
  title: string;
  status: 'Idea' | 'Production' | 'Editing' | 'Ready' | 'Posted';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  platform: Platform;
}
