# PostgreSQL & Supabase Setup Guide

The application uses the `pg` package and includes a ready-to-run schema file at `supabase/schema.sql`.

---

## Setting up Supabase

1. Create a project in [Supabase](https://supabase.com).
2. Open the **SQL Editor** in your Supabase project dashboard.
3. Paste and run the entire contents of [`supabase/schema.sql`](../supabase/schema.sql). This creates:
   - `users` table (UUID, phone, timestamps)
   - `loans` table (UUID, user_id, friend_name, amount, due_date, is_repaid, repaid_at)
   - Performance indexes on `user_id`, `due_date`, and `is_repaid`
   - Automatic `updated_at` triggers
4. Go to **Project Settings > Database > Connection String > URI**.
5. Copy the URI and paste it into `apps/backend/.env`:
   ```bash
   DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require"
   ```
6. Restart the backend:
   ```bash
   npm run dev:backend
   ```
   The server will print:
   ```text
   [MiniLedger DB] Successfully connected to PostgreSQL / Supabase!
   ```

---

## Setting up Local PostgreSQL (Alternative)

If using a local PostgreSQL installation:
1. Create a database:
   ```sql
   CREATE DATABASE mini_ledger;
   ```
2. Apply the schema:
   ```bash
   psql -U postgres -d mini_ledger -f supabase/schema.sql
   ```
3. Update `apps/backend/.env`:
   ```bash
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/mini_ledger"
   ```
