/*
  # Create projects table for storing user projects

  1. New Tables
    - `projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `name` (text, project name)
      - `description` (text, optional description)
      - `components` (jsonb, frontend components data)
      - `logic_blocks` (jsonb, backend logic blocks)
      - `database_tables` (jsonb, database schema)
      - `generated_code` (jsonb, generated code for frontend/backend/database)
      - `deployment_config` (jsonb, deployment settings)
      - `is_deployed` (boolean, deployment status)
      - `deployment_url` (text, live app URL)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `projects` table
    - Add policies for users to manage their own projects
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '',
  components jsonb DEFAULT '[]'::jsonb,
  logic_blocks jsonb DEFAULT '[]'::jsonb,
  database_tables jsonb DEFAULT '[]'::jsonb,
  generated_code jsonb DEFAULT '{"frontend": "", "backend": "", "database": ""}'::jsonb,
  deployment_config jsonb DEFAULT '{}'::jsonb,
  is_deployed boolean DEFAULT false,
  deployment_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON projects
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON projects
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON projects
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for projects table
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();