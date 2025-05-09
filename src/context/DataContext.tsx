import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Group, GroupWithDetails, Expense, Settlement, Balance, DataContextType, User } from '../types';
import { useAuth } from './AuthContext';

export const DataContext = createContext<DataContextType>({
  groups: [],
  getGroupDetails: async () => null,
  createGroup: async () => ({} as Group),
  addExpense: async () => ({} as Expense),
  addSettlement: async () => ({} as Settlement),
  inviteToGroup: async () => false,
  isLoading: false,
  error: null,
});

interface DataProviderProps {
  children: React.ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch user's groups whenever the user changes
  useEffect(() => {
    const fetchGroups = async () => {
      if (!user) {
        setGroups([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('groups')
          .select(`
            *,
            group_members!inner (
              user_id,
              profiles (
                id,
                name,
                email
              )
            )
          `)
          .eq('group_members.user_id', user.id);

        if (error) throw error;

        // Transform the data to match the Group type
        const transformedGroups = data.map(group => ({
          id: group.id,
          name: group.name,
          description: group.description,
          createdBy: group.created_by,
          members: group.group_members.map((member: any) => member.profiles),
          createdAt: group.created_at
        }));

        setGroups(transformedGroups);
      } catch (err) {
        console.error('Error fetching groups:', err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [user]);

  // Get user's groups
  const getUserGroups = async (): Promise<Group[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('groups')
      .select(`
        *,
        group_members!inner(user_id)
      `)
      .eq('group_members.user_id', user.id);

    if (error) throw error;
    return data || [];
  };

  // Get group members
  const getGroupMembers = async (groupId: string): Promise<User[]> => {
    const { data, error } = await supabase
      .from('group_members')
      .select(`
        profiles (
          id,
          name,
          email
        )
      `)
      .eq('group_id', groupId);

    if (error) throw error;
    return data?.map(item => item.profiles) || [];
  };

  // Calculate balances for a group
  const calculateBalances = async (groupId: string): Promise<Record<string, Balance>> => {
    const balances: Record<string, Balance> = {};

    // Get all expenses for the group
    const { data: expenses } = await supabase
      .from('expenses')
      .select(`
        *,
        expense_splits(*)
      `)
      .eq('group_id', groupId);

    // Get all settlements for the group
    const { data: settlements } = await supabase
      .from('settlements')
      .select('*')
      .eq('group_id', groupId);

    if (!expenses || !settlements) return {};

    // Calculate balances from expenses and splits
    expenses.forEach(expense => {
      const paidBy = expense.paid_by;
      balances[paidBy] = balances[paidBy] || { userId: paidBy, amount: 0 };
      balances[paidBy].amount += expense.amount;

      expense.expense_splits.forEach((split: any) => {
        const userId = split.user_id;
        balances[userId] = balances[userId] || { userId, amount: 0 };
        balances[userId].amount -= split.amount;
      });
    });

    // Apply settlements
    settlements.forEach(settlement => {
      balances[settlement.from_user].amount -= settlement.amount;
      balances[settlement.to_user].amount += settlement.amount;
    });

    return balances;
  };

  // Get detailed information about a specific group
  const getGroupDetails = async (groupId: string): Promise<GroupWithDetails | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .select(`
          *,
          group_members(
            user_id,
            profiles(*)
          )
        `)
        .eq('id', groupId)
        .single();

      if (groupError) throw groupError;

      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select(`
          *,
          profiles!paid_by(name, email),
          expense_splits(
            *,
            profiles(*)
          )
        `)
        .eq('group_id', groupId);

      if (expensesError) throw expensesError;

      const { data: settlements, error: settlementsError } = await supabase
        .from('settlements')
        .select(`
          *,
          from_user_profile:profiles!from_user(name, email),
          to_user_profile:profiles!to_user(name, email)
        `)
        .eq('group_id', groupId);

      if (settlementsError) throw settlementsError;

      const balances = await calculateBalances(groupId);

      return {
        ...group,
        members: group.group_members.map((member: any) => member.profiles),
        expenses: expenses || [],
        settlements: settlements || [],
        balances,
      };
    } catch (err) {
      setError((err as Error).message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Create a new group
  const createGroup = async (name: string, description: string): Promise<Group> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!user) {
        throw new Error('User not logged in');
      }

      // Insert new group
      const { data: group, error: groupError } = await supabase
        .from('groups')
        .insert([
          {
            name,
            description,
            created_by: user.id,
          },
        ])
        .select()
        .single();

      if (groupError) throw groupError;

      // Add creator as a member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: group.id,
            user_id: user.id,
            role: 'admin',
          },
        ]);

      if (memberError) throw memberError;

      // Refresh groups list
      const updatedGroups = await getUserGroups();
      setGroups(updatedGroups);

      return group;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new expense to a group
  const addExpense = async (
    groupId: string,
    description: string,
    amount: number,
    paidBy: string,
    splitBetween: string[]
  ): Promise<Expense> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Insert expense
      const { data: expense, error: expenseError } = await supabase
        .from('expenses')
        .insert([
          {
            group_id: groupId,
            description,
            amount,
            paid_by: paidBy,
          },
        ])
        .select()
        .single();

      if (expenseError) throw expenseError;

      // Calculate split amount
      const splitAmount = amount / splitBetween.length;

      // Create expense splits
      const splits = splitBetween.map(userId => ({
        expense_id: expense.id,
        user_id: userId,
        amount: splitAmount,
      }));

      const { error: splitsError } = await supabase
        .from('expense_splits')
        .insert(splits);

      if (splitsError) throw splitsError;

      return expense;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Record a settlement between users
  const addSettlement = async (
    groupId: string,
    fromUser: string,
    toUser: string,
    amount: number
  ): Promise<Settlement> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: settlement, error } = await supabase
        .from('settlements')
        .insert([
          {
            group_id: groupId,
            from_user: fromUser,
            to_user: toUser,
            amount,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return settlement;
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a user to a group
  const inviteToGroup = async (
    groupId: string,
    email?: string,
    name?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!name) {
        throw new Error('Name is required');
      }
      if (!user) {
        throw new Error('User not logged in');
      }

      let userId: string;

      if (email) {
        // Check if user exists using maybeSingle() instead of single()
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', email)
          .maybeSingle();

        if (existingUser) {
          userId = existingUser.id;
        } else {
          // Create new user profile
          const { data: newUser, error: userError } = await supabase
            .from('profiles')
            .insert([
              {
                name,
                email,
                invited_by: user.id
              },
            ])
            .select()
            .single();

          if (userError) throw userError;
          userId = newUser.id;
        }
      } else {
        // Create new user profile without email
        const { data: newUser, error: userError } = await supabase
          .from('profiles')
          .insert([
            {
              name,
              invited_by: user.id
            },
          ])
          .select()
          .single();

        if (userError) throw userError;
        userId = newUser.id;
      }

      // Add user to group
      const { error: memberError } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: groupId,
            user_id: userId,
          },
        ]);

      if (memberError) throw memberError;

      return true;
    } catch (err) {
      setError((err as Error).message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    groups,
    getGroupDetails,
    createGroup,
    addExpense,
    addSettlement,
    inviteToGroup,
    isLoading,
    error,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Export the useData hook for consuming components
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};