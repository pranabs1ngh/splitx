// Type definitions for the SplitX application

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[]; // Array of user IDs
  createdAt: string;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  paidBy: string; // User ID
  splitBetween: string[]; // Array of user IDs
  date: string;
}

export interface Settlement {
  id: string;
  groupId: string;
  fromUser: string; // User ID
  toUser: string; // User ID
  amount: number;
  date: string;
}

export interface Balance {
  userId: string;
  amount: number; // Positive means they are owed money, negative means they owe money
}

export interface GroupWithDetails extends Group {
  expenses: Expense[];
  settlements: Settlement[];
  balances: Record<string, Balance>;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
}

export interface DataContextType {
  groups: Group[];
  getGroupDetails: (groupId: string) => Promise<GroupWithDetails | null>;
  createGroup: (name: string, description: string) => Promise<Group>;
  addExpense: (groupId: string, description: string, amount: number, paidBy: string, splitBetween: string[]) => Promise<Expense>;
  addSettlement: (groupId: string, fromUser: string, toUser: string, amount: number) => Promise<Settlement>;
  inviteToGroup: (groupId: string, email?: string, name?: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}