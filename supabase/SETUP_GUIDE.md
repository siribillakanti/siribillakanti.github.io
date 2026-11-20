# Supabase Setup Procedure — Siri Portfolio

Follow these steps when you create your free Supabase project at [supabase.com](https://supabase.com).

---

## Step 1: Create Your Free Supabase Project

1. Log in to [supabase.com](https://supabase.com) and click **New Project**.
2. Name your project (e.g. `siri-portfolio`).
3. Set a strong database password and choose your nearest region.
4. Select the **Free Tier**.

---

## Step 2: Create Your Administrator Account

1. In your Supabase project dashboard, navigate to **Authentication** (left sidebar) $\rightarrow$ **Users**.
2. Click **Add User** $\rightarrow$ **Create User**.
3. Enter your administrator email and a secure password.
4. Check **Auto Confirm User** (so you can log in immediately without waiting for confirmation email).
5. Click **Create User**.

---

## Step 3: Obtain Your Administrator UUID

1. In the **Users** table, locate the row of your newly created user.
2. Click the copy icon next to your **User UID** (it is a standard UUID format, e.g. `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
3. Note this down for the next step.

---

## Step 4: Run the Database & RLS Migration

1. In your Supabase dashboard, click **SQL Editor** (left sidebar) $\rightarrow$ **New Query**.
2. Open and copy the entire contents of [`supabase/schema.sql`](./schema.sql).
3. Paste into the SQL editor and click **Run**.
   - This creates all tables (`portfolio_profile`, `portfolio_projects`, `portfolio_stickers`, `portfolio_admin_users`).
   - This creates public storage buckets (`stickers`, `portfolio-assets`).
   - This activates strict Row-Level Security (RLS) on all tables and storage objects.

---

## Step 5: Whitelist Your Administrator UUID

In the same **SQL Editor**, run the following single SQL statement:

```sql
INSERT INTO public.portfolio_admin_users (id, email)
VALUES ('<PASTE_YOUR_COPIED_USER_UID_HERE>', '<PASTE_YOUR_ADMIN_EMAIL_HERE>')
ON CONFLICT (id) DO NOTHING;
```

> **Note:** Only entries in `public.portfolio_admin_users` receive write privileges. Ordinary authenticated users cannot modify portfolio data or add themselves to this table.

---

## Step 6: Configure Environment Variables

In your Supabase dashboard, navigate to **Project Settings** (gear icon) $\rightarrow$ **API**.

You will see:
- **Project URL** (e.g., `https://abcdefghijklmnopqrst.supabase.co`)
- **Project API Keys** $\rightarrow$ `anon` / `public` key

### For Local Development:
Create a `.env.local` file in your project root (this file is git-ignored):

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-publishable-key>
VITE_ADMIN_USER_ID=<your-copied-user-uuid>
```

> [!CAUTION]
> **NEVER** use or copy the `service_role` key into client-side environment variables or frontend code. Only use the public `anon` key.

### For GitHub Actions Deployment:
In your GitHub repository, go to:
**Settings** $\rightarrow$ **Secrets and variables** $\rightarrow$ **Actions** $\rightarrow$ **New repository secret**

Add these three secrets:
1. `VITE_SUPABASE_URL`: Your Supabase Project URL
2. `VITE_SUPABASE_ANON_KEY`: Your Supabase public `anon` key
3. `VITE_ADMIN_USER_ID`: Your Administrator User UUID

---

## Step 7: Storage Bucket Verification

Navigate to **Storage** in your Supabase dashboard. You should see two public buckets created automatically by `schema.sql`:
1. `stickers` (Public: Yes)
2. `portfolio-assets` (Public: Yes)

Their policies are already enforced by `schema.sql`:
- **Read**: Public (anyone can view published sticker images).
- **Upload / Update / Delete**: Restricted strictly to `public.is_portfolio_admin()`.
