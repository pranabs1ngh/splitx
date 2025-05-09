/*
  # Add RLS policies for profiles table

  1. Security
    - Add policy to allow authenticated users to insert their own profile
    - Add policy to allow authenticated users to read their own profile
    - Add policy to allow authenticated users to update their own profile
*/

-- Policy to allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy to allow users to read their own profile
CREATE POLICY "Users can read their own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);