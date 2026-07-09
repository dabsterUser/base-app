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

### Backend Setup

1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_anon_key
   ```
4. `npm run start:dev`

### Frontend Setup

1. `cd frontend`
2. `npm install`
3. Create a `.env` file with:
   ```
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   REACT_APP_API_URL=http://localhost:3000
   ```
4. `npm start`
