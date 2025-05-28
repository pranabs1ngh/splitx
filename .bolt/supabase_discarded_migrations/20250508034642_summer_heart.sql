/*
  # Initial Schema Setup for SplitX

  1. New Tables
    - `profiles`
      - Extends Supabase auth.users with additional user data
      - Stores name and avatar URL
    - `groups`
      - Stores expense groups (trips, roommates, etc.)
      - Contains name, description, and creation info
    - `group_members`
      - Junction table for group memberships
      - Links users to groups with role information
    - `expenses`
      - Stores individual expenses within groups
      - Tracks amount, description, and payment details
    - `expense_splits`
      - Records how expenses are split between users
      - Tracks individual shares of expenses
    - `settlements`
      - Records payments between users to settle debts
      - Tracks amount, date, and involved users

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Ensure users can only access their own data and groups
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE groups ENABLE ROW LEVEL SECURITY;

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount decimal(12,2) NOT NULL CHECK (amount > 0),
  paid_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Create expense_splits table
CREATE TABLE IF NOT EXISTS expense_splits (
  expense_id uuid REFERENCES expenses(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  amount decimal(12,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (expense_id, user_id)
);

ALTER TABLE expense_splits ENABLE ROW LEVEL SECURITY;

-- Create settlements table
CREATE TABLE IF NOT EXISTS settlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid REFERENCES groups(id) ON DELETE CASCADE,
  from_user uuid REFERENCES profiles(id) ON DELETE SET NULL,
  to_user uuid REFERENCES profiles(id) ON DELETE SET NULL,
  amount decimal(12,2) NOT NULL CHECK (amount > 0),
  date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for groups
CREATE POLICY "Users can view groups they are members of"
  ON groups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups"
  ON groups
  FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Add RLS policies for group_members
CREATE POLICY "Users can view members of their groups"
  ON group_members
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Group creators can add members"
  ON group_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM groups
      WHERE groups.id = group_members.group_id
      AND groups.created_by = auth.uid()
    )
  );

-- Add RLS policies for expenses
CREATE POLICY "Users can view expenses in their groups"
  ON expenses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = expenses.group_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add expenses to their groups"
  ON expenses
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = expenses.group_id
      AND group_members.user_id = auth.uid()
    )
  );

-- Add RLS policies for expense_splits
CREATE POLICY "Users can view expense splits in their groups"
  ON expense_splits
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM expenses e
      JOIN group_members gm ON e.group_id = gm.group_id
      WHERE e.id = expense_splits.expense_id
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can add expense splits to their expenses"
  ON expense_splits
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM expenses e
      WHERE e.id = expense_splits.expense_id
      AND e.paid_by = auth.uid()
    )
  );

-- Add RLS policies for settlements
CREATE POLICY "Users can view settlements in their groups"
  ON settlements
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = settlements.group_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can record settlements in their groups"
  ON settlements
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = settlements.group_id
      AND group_members.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_expenses_group_id ON expenses(group_id);
CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by);
CREATE INDEX IF NOT EXISTS idx_expense_splits_expense_id ON expense_splits(expense_id);
CREATE INDEX IF NOT EXISTS idx_expense_splits_user_id ON expense_splits(user_id);
CREATE INDEX IF NOT EXISTS idx_settlements_group_id ON settlements(group_id);
CREATE INDEX IF NOT EXISTS idx_settlements_from_user ON settlements(from_user);
CREATE INDEX IF NOT EXISTS idx_settlements_to_user ON settlements(to_user);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON groups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();