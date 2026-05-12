/**
 * Script to create admin user in Supabase
 *
 * Usage:
 * 1. Go to Supabase Dashboard: https://supabase.com/dashboard
 * 2. Select your project
 * 3. Go to Authentication → Users
 * 4. Click "Add user" → "Create new user"
 * 5. Enter:
 *    - Email: artiomvozianadmin@example.com
 *    - Password: password
 *    - Auto Confirm User: YES (check this box)
 * 6. Click "Create user"
 *
 * Or run this SQL in Supabase SQL Editor:
 */

const createUserSQL = `
-- Create admin user
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'artiomvozianadmin@example.com',
  crypt('password', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
`;

console.log('To create admin user, run this SQL in Supabase SQL Editor:');
console.log(createUserSQL);
