# Base Application Boilerplate

This project is a base application boilerplate built with **React**, **NestJS**, and **Supabase**.

## Features

- **Auth System**: Integrated with Supabase Auth.
- **User Roles & Permissions**: Role-based access control (RBAC) implemented in the backend using a `profiles` table.
- **Notifications**: Database notifications via Supabase.
- **Activity Logs**: Automatic logging of user actions via NestJS Interceptor.
- **Custom Form Builder**: Core logic for creating forms and handling submissions.
- **User Management**: Admin interface to view users and their roles.

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS, Lucide Icons, Supabase SDK.
- **Backend**: NestJS, Passport, Supabase SDK.
- **Database**: Supabase (PostgreSQL).

## Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase account and project.

### PostgreSQL Connection Setup

To connect your backend to PostgreSQL, follow these steps:

1. **Database URL**: In `backend/.env`, set the `DATABASE_URL` variable.
   - If using Supabase: Go to Project Settings -> Database -> Connection string -> Prisma.
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres`

2. **Prisma Synchronization**:
   Run the following commands in the `backend` directory:
   ```bash
   # Generate Prisma client
   npx prisma generate

   # Push schema to database (for development)
   npx prisma db push
   ```

3. **Database Schema**:
   The `POSTGRES_GUIDE.md` file contains SQL scripts to initialize necessary tables and RBAC data if you are starting with a fresh database.

### Supabase Setup

Create the following tables in your Supabase project:

1. **profiles**
   - `id`: uuid (primary key, references auth.users)
   - `email`: text
   - `role`: text (default: 'user')
   - `created_by_id`: uuid (references auth.users)
   - `created_at`: timestamp

2. **forms**
   - `id`: uuid (primary key)
   - `title`: text
   - `description`: text
   - `fields`: jsonb (stores form structure)
   - `user_id`: uuid (references auth.users)
   - `created_at`: timestamp

3. **form_submissions**
   - `id`: uuid (primary key)
   - `form_id`: uuid (references forms)
   - `user_id`: uuid (references auth.users)
   - `data`: jsonb (stores submission data)
   - `created_at`: timestamp

4. **activity_logs**
   - `id`: uuid (primary key)
   - `user_id`: uuid (references auth.users)
   - `action`: text
   - `details`: jsonb
   - `created_at`: timestamp

5. **notifications**
   - `id`: uuid (primary key)
   - `user_id`: uuid (references auth.users)
   - `message`: text
   - `read`: boolean (default: false)
   - `created_at`: timestamp

### Quick Start (Recommended)

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   - In `backend/.env`:
     ```
     DATABASE_URL="postgresql://..."
     SUPABASE_URL="https://your-project.supabase.co"
     SUPABASE_KEY="your-anon-key"
     ```
   - In `frontend/.env`:
     ```
     VITE_SUPABASE_URL="https://your-project.supabase.co"
     VITE_SUPABASE_ANON_KEY="your-anon-key"
     VITE_API_URL="http://localhost:3000"
     ```

3. **Run both Backend and Frontend concurrently:**
   ```bash
   npm run dev
   ```

### Individual Service Setup

#### Backend
1. `cd backend`
2. `npm install`
3. `npm run start:dev`

#### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
