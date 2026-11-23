-- ====================================================================
-- CLEANUP MIGRATION: REMOVE RETIRED CONTACT FORM & QUOTA OBJECTS
-- ====================================================================
-- Note: This migration removes objects from earlier iterations that
-- were dedicated exclusively to the retired Web3Forms contact form
-- and monthly quota tracker.
--
-- DEPENDENCY AUDIT:
-- 1. public.contact_submissions:
--    - Dependent Indexes: idx_contact_submissions_month, idx_contact_submissions_sender, idx_contact_submissions_ip
--    - Dependent RLS Policies: "Admin view contact submissions"
--    - Foreign Keys referencing it: NONE (0 dependencies from other tables)
--    - CASCADE is NOT used. Standard DROP TABLE drops only the table and its own indexes/policies.
--
-- 2. public.portfolio_messages:
--    - Dependent Indexes: portfolio_messages_pkey
--    - Dependent RLS Policies: "Public insert contact messages", "Admin manage contact messages"
--    - Foreign Keys referencing it: NONE (0 dependencies from other tables)
--    - CASCADE is NOT used. Standard DROP TABLE drops only the table and its own policies.
--
-- CORE PORTFOLIO OBJECTS PRESERVED & COMPLETELY UNTOUCHED:
--   ✓ public.portfolio_profile (all customized portfolio content — verified intact)
--   ✓ public.portfolio_projects (project list and metadata)
--   ✓ public.portfolio_stickers (visual stickers and coordinates — verified intact)
--   ✓ public.portfolio_admin_users (admin UID whitelist)
--   ✓ public.is_portfolio_admin() (RLS security function)
--   ✓ Storage bucket: portfolio-assets (images, logos, stickers)
-- ====================================================================

-- 1. Drop contact quota RPC functions (if present)
DROP FUNCTION IF EXISTS public.claim_contact_slot(TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.claim_contact_slot();
DROP FUNCTION IF EXISTS public.release_contact_slot(UUID);
DROP FUNCTION IF EXISTS public.record_contact_submission();
DROP FUNCTION IF EXISTS public.get_contact_quota();

-- 2. Drop contact submissions table (monthly quota tracking)
-- Standard DROP TABLE without CASCADE: drops only this table, its indexes and its RLS policies.
DROP TABLE IF EXISTS public.contact_submissions;

-- 3. Drop portfolio messages table (retired contact form inbox archive)
-- Standard DROP TABLE without CASCADE: drops only this table and its RLS policies.
DROP TABLE IF EXISTS public.portfolio_messages;
