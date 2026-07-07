# Base Application Boilerplate

This project is a base application boilerplate built with **React**, **NestJS**, and **Supabase**.

## Features

- **Auth System**: Integrated with Supabase Auth.
- **User Roles & Permissions**: Role-based access control (RBAC) implemented in the backend.
- **Notifications**: Database notifications via Supabase.
- **Activity Logs**: Automatic logging of user actions via NestJS Interceptor.
- **Custom Form Builder**: Core logic for creating forms and handling submissions.

## Tech Stack

- **Frontend**: React, React Router, Tailwind CSS (optional), Axios, Supabase SDK.
- **Backend**: NestJS, Passport, Supabase SDK.
- **Database**: Supabase (PostgreSQL).

## Getting Started

### Prerequisites

- Node.js (v18+)
- Supabase account and project.

### Supabase Setup

Create the following tables in your Supabase project:

1. **user_roles**
   - `user_id`: uuid (references auth.users)
   - `role`: text (e.g., 'admin', 'user')

2. **forms**
   - `id`: uuid (primary key)
   - `title`: text
   - `description`: text
   - `fields`: jsonb (stores form structure)
   - `user_id`: uuid (references auth.users)

3. **form_submissions**
   - `id`: uuid (primary key)
   - `form_id`: uuid (references forms)
   - `user_id`: uuid (references auth.users)
   - `data`: jsonb (stores submission data)

4. **activity_logs**
   - `id`: uuid (primary key)
   - `user_id`: uuid (references auth.users)
   - `action`: text
   - `details`: jsonb
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
   ```
4. `npm start`
