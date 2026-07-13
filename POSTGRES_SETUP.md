# PostgreSQL Setup & Troubleshooting Guide

This guide covers how to set up PostgreSQL for the Base Application and how to resolve common connectivity issues, especially when using Supabase.

## 1. Setting up PostgreSQL

### A. Using Supabase (Cloud)
If you are using Supabase, your database is already managed. However, you must connect Prisma to it.
1. Go to your **Supabase Dashboard** -> **Project Settings** -> **Database**.
2. Copy the **Connection string** (choose the "Prisma" tab).
3. In `backend/.env`, set:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-HOST]:5432/postgres"
   ```

### B. Using Docker (Local)
If you want to run PostgreSQL locally using Docker:
```bash
docker run --name base-app-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
```
Then set your `DATABASE_URL` to:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/postgres?schema=public"
```

## 2. Syncing the Schema (Prisma)

Once your `DATABASE_URL` is configured, you must push the schema to the database:
```bash
cd backend
npx prisma db push
```
This command creates all the tables (profiles, roles, permissions, etc.) defined in `schema.prisma`.

## 3. Troubleshooting: PGRST205 Error

### The Problem
The error `PGRST205: Could not find the table 'public.profiles' in the schema cache` usually occurs when using the Supabase SDK (`supabase-js`) to query a table that Supabase's PostgREST API hasn't "seen" or indexed yet.

### The Solution
1. **Ensure Tables Exist**: Verify that you have run `npx prisma db push`.
2. **Reload Schema Cache**:
   - Go to your **Supabase Dashboard** -> **API Settings**.
   - Sometimes simply making a change to the table (like adding a dummy column and deleting it) in the Supabase UI forces a refresh.
   - Alternatively, use the SQL Editor in Supabase and run:
     ```sql
     NOTIFY pgrst, 'reload schema';
     ```
3. **Use Prisma for Data**:
   The Base Application is designed to use **Prisma** for all business data. If you see this error, ensure you are not using `supabase.from('profiles')` in your code for relational data. Use `prisma.user` instead.

## 4. Initializing RBAC Data

After pushing the schema, you should seed the initial roles and permissions so you can log in as an admin:
```bash
# In backend directory
npx prisma db seed
```
*(Ensure you have a seed script configured in package.json, or run the SQL in POSTGRES_GUIDE.md manually in your SQL Editor)*
