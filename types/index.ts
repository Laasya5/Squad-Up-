export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: NotificationSettings;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  groupUpdates: boolean;
  expenseAlerts: boolean;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string;
  type: 'trip' | 'outing' | 'event';
  status: 'planning' | 'active' | 'completed' | 'archived';
  startDate?: Date;
  endDate?: Date;
  location?: string;
  timezone: string;
  currency: string;
  ownerId: string;
  members: GroupMember[];
  settings: GroupSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMember {
  userId: string;
  role: 'owner' | 'admin' | 'member';
  joinedAt: Date;
}

export interface GroupSettings {
  visibility: 'private' | 'invite' | 'public';
  allowMemberInvites: boolean;
  requireApprovalForExpenses: boolean;
  defaultSplitMethod: 'equal' | 'percentage' | 'shares' | 'custom';
}

export type PlaceCategory = 'restaurant' | 'attraction' | 'stay' | 'activity' | 'nightlife' | 'cafe';

export interface Place {
  id: string;
  groupId: string;
  name: string;
  description: string;
  category: PlaceCategory;
  address: string;
  coordinates: { lat: number; lng: number };
  photos: string[];
  priceLevel: 1 | 2 | 3 | 4;
  rating: number;
  tags: string[];
  addedBy: string;
  votes: PlaceVote[];
  createdAt: Date;
}

export interface PlaceVote {
  userId: string;
  type: 'up' | 'down' | 'favorite';
  createdAt: Date;
}

export interface Task {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeIds: string[];
  dueDate?: Date;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ItineraryType = 'activity' | 'meal' | 'transport' | 'accommodation' | 'free_time';

export interface ItineraryItem {
  id: string;
  groupId: string;
  day: number; // 1-indexed
  startTime: string; // HH:mm
  endTime: string;
  title: string;
  description?: string;
  type: ItineraryType;
  location?: string;
  placeId?: string;
  assigneeIds: string[];
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ExpenseCategory = 'food' | 'transport' | 'stay' | 'activity' | 'shopping' | 'other';
export type SplitMethod = 'equal' | 'percentage' | 'shares' | 'custom';

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  paidBy: string; // userId
  splitMethod: SplitMethod;
  splits: ExpenseSplit[];
  category: ExpenseCategory;
  date: Date;
  receiptUrl?: string;
  tags: string[];
  status: 'pending' | 'approved' | 'rejected' | 'settled';
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseSplit {
  userId: string;
  amount: number;
  percentage?: number;
  shares?: number;
  settled: boolean;
}

export interface SettlementBalance {
  userId: string;
  netBalance: number; // Positive = owed money, Negative = owes money
  owesTo: { userId: string; amount: number }[];
  owedFrom: { userId: string; amount: number }[];
}

export interface Memory {
  id: string;
  groupId: string;
  type: 'photo' | 'video' | 'note';
  mediaUrl?: string;
  caption?: string;
  location?: string;
  takenAt: Date;
  uploadedBy: string;
  reactions: Reaction[];
  comments: Comment[];
  tags: string[];
  createdAt: Date;
}

export interface Reaction {
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
}
