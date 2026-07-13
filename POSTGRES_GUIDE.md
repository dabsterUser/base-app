# PostgreSQL Guide for Supabase

This guide provides common PostgreSQL commands and schema definitions for the Base Application. You can run these commands in the **SQL Editor** of your Supabase dashboard.

## Table Definitions

### 1. Core Auth & RBAC
```sql
-- Profiles (User Metadata)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  phone TEXT,
  profile_image TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
  last_login TIMESTAMP WITH TIME ZONE,
  role_id UUID, -- References roles(id) later
  created_by_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Roles
CREATE TABLE public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Permissions
CREATE TABLE public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE, -- e.g., 'users.view'
  module TEXT NOT NULL,
  action TEXT NOT NULL
);

-- Role-Permission Mapping
CREATE TABLE public.role_permissions (
  role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- User-Permission Mapping (Overrides)
CREATE TABLE public.user_permissions (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'allow' CHECK (type IN ('allow', 'deny')),
  PRIMARY KEY (user_id, permission_id)
);

-- Add foreign key back to profiles for role
ALTER TABLE public.profiles ADD CONSTRAINT fk_profiles_role FOREIGN KEY (role_id) REFERENCES public.roles(id);
```

### 2. Activity Logs
```sql
CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  module TEXT NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  ip_address TEXT,
  browser TEXT,
  device TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### 3. Form Builder System
```sql
CREATE TABLE public.forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'unpublished')),
  version INTEGER DEFAULT 1,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.form_fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  placeholder TEXT,
  description TEXT,
  default_value TEXT,
  required BOOLEAN DEFAULT false,
  readonly BOOLEAN DEFAULT false,
  disabled BOOLEAN DEFAULT false,
  validation JSONB,
  settings JSONB,
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id UUID REFERENCES public.forms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  data JSONB NOT NULL,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

### 4. Notifications & Settings
```sql
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'system', 'user', 'form'
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  "group" TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

## Useful Commands

### 1. Seed Initial RBAC Data
```sql
-- Create Default Roles
INSERT INTO public.roles (name, description) VALUES
('Super Admin', 'Full access to the system'),
('User', 'Regular user access');

-- Create Basic Permissions
INSERT INTO public.permissions (name, module, action) VALUES
('users.view', 'users', 'view'),
('users.create', 'users', 'create'),
('users.edit', 'users', 'edit'),
('users.delete', 'users', 'delete'),
('forms.view', 'forms', 'view'),
('forms.create', 'forms', 'create'),
('forms.edit', 'forms', 'edit'),
('forms.delete', 'forms', 'delete'),
('settings.view', 'settings', 'view'),
('settings.edit', 'settings', 'edit');

-- Map all permissions to Super Admin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name = 'Super Admin';

-- Map view permissions to User
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM public.roles r, public.permissions p
WHERE r.name = 'User' AND p.name IN ('forms.view', 'settings.view');
```

### 2. Enable RLS (Recommended)
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
```
