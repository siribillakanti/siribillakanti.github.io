-- ====================================================================
-- SIRI BILLAKANTI PORTFOLIO — HARDENED POSTGRESQL SCHEMA & STRICT RLS
-- ====================================================================
-- SECURITY LEVEL: Single-Admin Protected Whitelist (Zero Placeholders)
-- All administrative privileges are derived exclusively from the
-- protected 'public.portfolio_admin_users' whitelist table.
-- ====================================================================

-- 1. Create Storage Buckets (Public Read for Asset Delivery)
INSERT INTO storage.buckets (id, name, public)
VALUES ('stickers', 'stickers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-assets', 'portfolio-assets', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Administrator Whitelist Table
-- References auth.users(id). Only trusted database administrators can add entries.
CREATE TABLE IF NOT EXISTS public.portfolio_admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Profile & Metadata Table
CREATE TABLE IF NOT EXISTS public.portfolio_profile (
  id TEXT PRIMARY KEY DEFAULT 'siri',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Projects Table
CREATE TABLE IF NOT EXISTS public.portfolio_projects (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  category TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  published BOOLEAN DEFAULT true NOT NULL,
  order_num INT DEFAULT 0 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Stickers & Layouts Table
CREATE TABLE IF NOT EXISTS public.portfolio_stickers (
  page_id TEXT PRIMARY KEY,
  stickers JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ====================================================================
-- 6. HARDENED SECURITY FUNCTION: is_portfolio_admin()
-- - SECURITY DEFINER: Runs with owner privileges to safely verify whitelist.
-- - SET search_path = '': Highest security level; completely disables
--   unqualified object resolution and thwarts all search_path hijacking attacks.
-- - Fully qualified object references throughout (auth.uid(), public.portfolio_admin_users).
-- ====================================================================
CREATE OR REPLACE FUNCTION public.is_portfolio_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
BEGIN
  -- 1. Reject unauthenticated or anonymous sessions immediately
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;

  -- 2. Verify that auth.uid() exists in the protected whitelist table
  RETURN EXISTS (
    SELECT 1 
    FROM public.portfolio_admin_users 
    WHERE id = auth.uid()
  );
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;

-- Restrict function execution permissions:
-- Revoke from PUBLIC, and grant strictly the minimum execution privileges
-- required for 'anon' and 'authenticated' roles to evaluate RLS policies.
REVOKE ALL ON FUNCTION public.is_portfolio_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_portfolio_admin() TO anon, authenticated;

-- ====================================================================
-- 7. CLEANUP OBSOLETE / PERMISSIVE POLICIES
-- ====================================================================
-- Drop any potential legacy or permissive policies from prior migrations
DROP POLICY IF EXISTS "Public can modify profile" ON public.portfolio_profile;
DROP POLICY IF EXISTS "Public can modify projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Public can modify stickers" ON public.portfolio_stickers;
DROP POLICY IF EXISTS "Users can update profile" ON public.portfolio_profile;
DROP POLICY IF EXISTS "Authenticated can insert projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Authenticated can update projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Authenticated can delete projects" ON public.portfolio_projects;
DROP POLICY IF EXISTS "Authenticated can insert profile" ON public.portfolio_profile;
DROP POLICY IF EXISTS "Authenticated can update profile" ON public.portfolio_profile;
DROP POLICY IF EXISTS "Authenticated can delete profile" ON public.portfolio_profile;
DROP POLICY IF EXISTS "Authenticated can insert stickers" ON public.portfolio_stickers;
DROP POLICY IF EXISTS "Authenticated can update stickers" ON public.portfolio_stickers;
DROP POLICY IF EXISTS "Authenticated can delete stickers" ON public.portfolio_stickers;

-- ====================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES — DATABASE TABLES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.portfolio_admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_stickers ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------
-- A. portfolio_admin_users: Trusted Database Owner Only Modification
-- The administrator whitelist can ONLY be initialized or modified directly
-- by the trusted database owner (via the Supabase Dashboard SQL Editor).
-- Neither 'anon' nor 'authenticated' client roles have INSERT, UPDATE,
-- or DELETE privileges. Only existing administrators can view (SELECT) the table.
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Admin manage admin users" ON public.portfolio_admin_users;
DROP POLICY IF EXISTS "Admin view admin users" ON public.portfolio_admin_users;

-- Admin read-only access from client
CREATE POLICY "Admin view admin users"
  ON public.portfolio_admin_users
  FOR SELECT
  TO authenticated
  USING (public.is_portfolio_admin());

-- Notice: NO INSERT, UPDATE, or DELETE policy exists for client roles.
-- By default in PostgreSQL RLS, missing policies result in complete write denial
-- for all client connections. Only the database owner can manage administrators.

-- --------------------------------------------------------------------
-- B. portfolio_profile: Public Read, Strict Admin Write
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view profile" ON public.portfolio_profile;
CREATE POLICY "Public can view profile"
  ON public.portfolio_profile
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can insert profile" ON public.portfolio_profile;
CREATE POLICY "Admin can insert profile"
  ON public.portfolio_profile
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin can update profile" ON public.portfolio_profile;
CREATE POLICY "Admin can update profile"
  ON public.portfolio_profile
  FOR UPDATE
  TO authenticated
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin can delete profile" ON public.portfolio_profile;
CREATE POLICY "Admin can delete profile"
  ON public.portfolio_profile
  FOR DELETE
  TO authenticated
  USING (public.is_portfolio_admin());

-- --------------------------------------------------------------------
-- C. portfolio_projects: Public View Published, Strict Admin Write & Draft View
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view published projects" ON public.portfolio_projects;
CREATE POLICY "Public can view published projects"
  ON public.portfolio_projects
  FOR SELECT
  USING (published = true OR public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin can insert projects" ON public.portfolio_projects;
CREATE POLICY "Admin can insert projects"
  ON public.portfolio_projects
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin can update projects" ON public.portfolio_projects;
CREATE POLICY "Admin can update projects"
  ON public.portfolio_projects
  FOR UPDATE
  TO authenticated
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin can delete projects" ON public.portfolio_projects;
CREATE POLICY "Admin can delete projects"
  ON public.portfolio_projects
  FOR DELETE
  TO authenticated
  USING (public.is_portfolio_admin());

-- --------------------------------------------------------------------
-- D. portfolio_stickers: Public Read, Strict Admin Write
-- --------------------------------------------------------------------
DROP POLICY IF EXISTS "Public can view stickers" ON public.portfolio_stickers;
CREATE POLICY "Public can view stickers"
  ON public.portfolio_stickers
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin can insert stickers" ON public.portfolio_stickers;
CREATE POLICY "Admin can insert stickers"
  ON public.portfolio_stickers
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin can update stickers" ON public.portfolio_stickers;
CREATE POLICY "Admin can update stickers"
  ON public.portfolio_stickers
  FOR UPDATE
  TO authenticated
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

DROP POLICY IF EXISTS "Admin can delete stickers" ON public.portfolio_stickers;
CREATE POLICY "Admin can delete stickers"
  ON public.portfolio_stickers
  FOR DELETE
  TO authenticated
  USING (public.is_portfolio_admin());

-- ====================================================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES — SUPABASE STORAGE BUCKETS
-- ====================================================================

-- Drop any previous permissive storage policies
DROP POLICY IF EXISTS "Public uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated uploads" ON storage.objects;

-- A. Public Read: Any visitor can view sticker images & assets
DROP POLICY IF EXISTS "Public can view public bucket assets" ON storage.objects;
CREATE POLICY "Public can view public bucket assets"
  ON storage.objects
  FOR SELECT
  USING (bucket_id IN ('stickers', 'portfolio-assets'));

-- B. Strict Admin Upload: Only designated administrator UUID
DROP POLICY IF EXISTS "Admin can upload bucket assets" ON storage.objects;
CREATE POLICY "Admin can upload bucket assets"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('stickers', 'portfolio-assets') AND
    public.is_portfolio_admin()
  );

-- C. Strict Admin Update: Only designated administrator UUID
DROP POLICY IF EXISTS "Admin can update bucket assets" ON storage.objects;
CREATE POLICY "Admin can update bucket assets"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('stickers', 'portfolio-assets') AND
    public.is_portfolio_admin()
  )
  WITH CHECK (
    bucket_id IN ('stickers', 'portfolio-assets') AND
    public.is_portfolio_admin()
  );

-- D. Strict Admin Delete: Only designated administrator UUID
DROP POLICY IF EXISTS "Admin can delete bucket assets" ON storage.objects;
CREATE POLICY "Admin can delete bucket assets"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('stickers', 'portfolio-assets') AND
    public.is_portfolio_admin()
  );

-- ====================================================================
-- 10. TABLE & SCHEMA PRIVILEGES (EXPLICIT MINIMUM GRANTS)
-- ====================================================================
-- Explicitly grants minimum necessary SQL privileges for environments where
-- "Grant API access to new tables automatically" is unchecked.
-- In PostgreSQL, RLS policies are ONLY evaluated if the role first possesses
-- table-level SQL privileges.

-- A. Schema Usage
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT USAGE ON SCHEMA storage TO anon, authenticated;

-- B. Portfolio Content Tables:
-- 'anon' receives strictly SELECT access for public portfolio display.
-- 'authenticated' receives table-level write privileges, with actual write execution
-- strictly governed by RLS policies enforcing public.is_portfolio_admin().
GRANT SELECT ON TABLE public.portfolio_profile TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.portfolio_profile TO authenticated;

GRANT SELECT ON TABLE public.portfolio_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.portfolio_projects TO authenticated;

GRANT SELECT ON TABLE public.portfolio_stickers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.portfolio_stickers TO authenticated;

-- C. Admin Whitelist Table:
-- 'anon' and PUBLIC have zero access.
-- 'authenticated' receives SELECT only (further restricted by RLS to is_portfolio_admin()).
-- Client roles NEVER receive INSERT, UPDATE, or DELETE privileges.
REVOKE ALL ON TABLE public.portfolio_admin_users
FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE public.portfolio_admin_users
TO authenticated;

-- D. Storage Objects & Buckets:
-- Grants minimum privileges for storage API operations, with RLS governing access.
GRANT SELECT ON TABLE storage.buckets TO anon, authenticated;
GRANT SELECT ON TABLE storage.objects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE storage.objects TO authenticated;

-- ====================================================================
-- 11. CONTACT MESSAGES (ADDITIVE MESSAGE ARCHIVE)
-- ====================================================================
-- Optional, non-breaking archive for contact form submissions.
CREATE TABLE IF NOT EXISTS public.portfolio_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  read BOOLEAN NOT NULL DEFAULT FALSE
);

ALTER TABLE public.portfolio_messages ENABLE ROW LEVEL SECURITY;

-- Allow public visitors and authenticated users to submit contact messages
DROP POLICY IF EXISTS "Public insert contact messages" ON public.portfolio_messages;
CREATE POLICY "Public insert contact messages"
  ON public.portfolio_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only verified portfolio administrator can read or manage messages
DROP POLICY IF EXISTS "Admin manage contact messages" ON public.portfolio_messages;
CREATE POLICY "Admin manage contact messages"
  ON public.portfolio_messages
  FOR ALL
  TO authenticated
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

-- Minimum SQL Grants for portfolio_messages
GRANT INSERT ON TABLE public.portfolio_messages TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON TABLE public.portfolio_messages TO authenticated;

-- ====================================================================
-- 12. CONTACT SUBMISSIONS & MONTHLY QUOTA ENFORCEMENT (200 / MONTH)
-- ====================================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month_key TEXT NOT NULL DEFAULT to_char(timezone('utc', now()), 'YYYY-MM'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  status TEXT NOT NULL DEFAULT 'accepted'
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_month ON public.contact_submissions(month_key);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated cannot read other visitors' submissions
REVOKE ALL ON TABLE public.contact_submissions FROM PUBLIC, anon;

-- Admin can read/manage all contact submissions
DROP POLICY IF EXISTS "Admin view contact submissions" ON public.contact_submissions;
CREATE POLICY "Admin view contact submissions"
  ON public.contact_submissions
  FOR ALL
  TO authenticated
  USING (public.is_portfolio_admin())
  WITH CHECK (public.is_portfolio_admin());

GRANT SELECT ON TABLE public.contact_submissions TO authenticated;

-- Function 1: Get Current Monthly Quota Status (Read-only, resets at 00:00 UTC on 1st of month)
CREATE OR REPLACE FUNCTION public.get_contact_quota()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_month TEXT := to_char(timezone('utc', now()), 'YYYY-MM');
  v_count INTEGER;
  v_limit CONSTANT INTEGER := 200;
  v_resets_at TIMESTAMPTZ;
BEGIN
  -- Count only successfully accepted submissions for the current UTC calendar month
  SELECT count(*)::INTEGER INTO v_count
  FROM public.contact_submissions
  WHERE month_key = v_month AND status = 'accepted';

  -- Calculate next reset at 00:00 UTC on 1st of next month
  v_resets_at := date_trunc('month', timezone('utc', now())) + interval '1 month';

  RETURN jsonb_build_object(
    'allowed', (v_count < v_limit),
    'current_count', v_count,
    'max_limit', v_limit,
    'month_key', v_month,
    'resets_at_utc', v_resets_at
  );
END;
$$;

-- Function 2: Record Successful Submission with Concurrency Lock (Atomic check & insert)
CREATE OR REPLACE FUNCTION public.record_contact_submission()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_month TEXT := to_char(timezone('utc', now()), 'YYYY-MM');
  v_count INTEGER;
  v_limit CONSTANT INTEGER := 200;
  v_resets_at TIMESTAMPTZ;
BEGIN
  -- Transaction-level advisory lock prevents concurrent race conditions from exceeding 200
  PERFORM pg_advisory_xact_lock(hashtext('contact_quota_lock_' || v_month));

  SELECT count(*)::INTEGER INTO v_count
  FROM public.contact_submissions
  WHERE month_key = v_month AND status = 'accepted';

  v_resets_at := date_trunc('month', timezone('utc', now())) + interval '1 month';

  IF v_count >= v_limit THEN
    RETURN jsonb_build_object(
      'success', false,
      'allowed', false,
      'current_count', v_count,
      'max_limit', v_limit,
      'month_key', v_month,
      'resets_at_utc', v_resets_at,
      'message', 'Monthly submission quota of 200 messages has been reached for this calendar month.'
    );
  END IF;

  INSERT INTO public.contact_submissions (month_key, status)
  VALUES (v_month, 'accepted');

  RETURN jsonb_build_object(
    'success', true,
    'allowed', ((v_count + 1) < v_limit),
    'current_count', v_count + 1,
    'max_limit', v_limit,
    'month_key', v_month,
    'resets_at_utc', v_resets_at,
    'message', 'Submission successfully recorded against monthly quota.'
  );
END;
$$;

-- Execution permissions: safe for anon & authenticated via SECURITY DEFINER
REVOKE ALL ON FUNCTION public.get_contact_quota() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_contact_quota() TO anon, authenticated;

REVOKE ALL ON FUNCTION public.record_contact_submission() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.record_contact_submission() TO anon, authenticated;
