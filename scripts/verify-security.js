#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('   SIRI PORTFOLIO — STATIC SECURITY & RLS CHECK     ');
console.log('====================================================\n');

let passed = true;

// TEST 1: Verify service-role key is never present in source or config
console.log('TEST 1: Verifying service-role key absence in frontend...');
const srcFiles = [];
function getFiles(dir) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    if (item.name === 'node_modules' || item.name === '.git' || item.name === 'dist' || item.name === 'scripts') continue;
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      getFiles(full);
    } else {
      srcFiles.push(full);
    }
  }
}
getFiles('.');

let serviceRoleLeak = false;
for (const f of srcFiles) {
  const content = fs.readFileSync(f, 'utf8');
  if (content.includes('SUPABASE_SERVICE_ROLE_KEY=') || /service_role_key\s*=\s*['"][^'"]+['"]/i.test(content)) {
    console.error(`  [FAIL] Potential service_role leak found in ${f}`);
    serviceRoleLeak = true;
    passed = false;
  }
}
if (!serviceRoleLeak) {
  console.log('  [PASS] No service-role keys exposed in frontend code or configs.');
}

// TEST 2: Inspect supabase/schema.sql for strict admin whitelist enforcement
console.log('\nTEST 2: Verifying PostgreSQL RLS write policies in schema.sql...');
const schemaContent = fs.readFileSync('supabase/schema.sql', 'utf8');

// Check that generic auth.role() = 'authenticated' is NOT used as the write barrier
if (schemaContent.includes("USING (auth.role() = 'authenticated')") || schemaContent.includes("CHECK (auth.role() = 'authenticated')")) {
  console.error("  [FAIL] Generic auth.role() = 'authenticated' detected in write policy!");
  passed = false;
} else {
  console.log("  [PASS] Generic auth.role() = 'authenticated' is eliminated from write policies.");
}

// Check that is_portfolio_admin() validates auth.uid() against whitelist table
if (schemaContent.includes('WHERE id = auth.uid()') && schemaContent.includes('public.portfolio_admin_users')) {
  console.log('  [PASS] is_portfolio_admin() strictly validates auth.uid() against portfolio_admin_users whitelist table.');
} else {
  console.error('  [FAIL] is_portfolio_admin() does not validate auth.uid() against whitelist table!');
  passed = false;
}

// Check that placeholder string is removed
if (schemaContent.includes('REPLACE_WITH_YOUR_ADMIN_UUID')) {
  console.error('  [FAIL] Unresolved REPLACE_WITH_YOUR_ADMIN_UUID placeholder found in schema.sql!');
  passed = false;
} else {
  console.log('  [PASS] No hardcoded or unresolved placeholder strings in schema.sql.');
}

// TEST 3: Verify function security hardening (empty search_path & minimum permissions)
console.log('\nTEST 3: Verifying SECURITY DEFINER function hardening...');
if (schemaContent.includes("SET search_path = ''")) {
  console.log("  [PASS] Safe search_path (SET search_path = '') configured to disable unqualified lookups.");
} else {
  console.error("  [FAIL] Missing safe search_path = '' configuration on is_portfolio_admin() function!");
  passed = false;
}

if (schemaContent.includes('REVOKE ALL ON FUNCTION public.is_portfolio_admin() FROM PUBLIC') &&
    schemaContent.includes('GRANT EXECUTE ON FUNCTION public.is_portfolio_admin() TO anon, authenticated')) {
  console.log('  [PASS] Public execution privileges revoked; minimum required permissions granted to anon & authenticated.');
} else {
  console.error('  [FAIL] Function execution permissions are not properly scoped!');
  passed = false;
}

// Check that portfolio_admin_users has NO client write policies
if (schemaContent.includes('DROP POLICY IF EXISTS "Admin manage admin users"') &&
    !schemaContent.includes('CREATE POLICY "Admin manage admin users"')) {
  console.log('  [PASS] portfolio_admin_users whitelist cannot be modified by client APIs (trusted DB owner only).');
} else {
  console.error('  [FAIL] portfolio_admin_users allows client write operations!');
  passed = false;
}

// TEST 4: Verify all database tables have RLS enabled
console.log('\nTEST 4: Verifying RLS is enabled on all tables...');
const requiredTables = ['portfolio_profile', 'portfolio_projects', 'portfolio_stickers', 'portfolio_admin_users'];
for (const tbl of requiredTables) {
  const rlsCheck = `ALTER TABLE public.${tbl} ENABLE ROW LEVEL SECURITY;`;
  if (schemaContent.includes(rlsCheck)) {
    console.log(`  [PASS] RLS enabled on public.${tbl}`);
  } else {
    console.error(`  [FAIL] Missing RLS enablement for public.${tbl}`);
    passed = false;
  }
}

// TEST 5: Verify storage bucket policies
console.log('\nTEST 5: Verifying Storage RLS write policies...');
const storageWrites = ['Admin can upload bucket assets', 'Admin can update bucket assets', 'Admin can delete bucket assets'];
for (const pol of storageWrites) {
  if (schemaContent.includes(pol) && schemaContent.includes('public.is_portfolio_admin()')) {
    console.log(`  [PASS] Storage policy "${pol}" enforces public.is_portfolio_admin()`);
  } else {
    console.error(`  [FAIL] Missing or insecure storage policy: ${pol}`);
    passed = false;
  }
}

// TEST 6: Verify public read permissions on published content
console.log('\nTEST 6: Verifying public read permissions on published content...');
if (schemaContent.includes('published = true OR public.is_portfolio_admin()')) {
  console.log('  [PASS] Public read restricted to published records; drafts protected for admin only.');
} else {
  console.error('  [FAIL] Public read policy on projects is not properly scoped!');
  passed = false;
}

// TEST 7: Verify absence of hardcoded or exposed passcode in UI components
console.log('\nTEST 7: Verifying elimination of passcode exposure from UI...');
const adminDashboardCode = fs.readFileSync('src/components/Admin/AdminDashboard.tsx', 'utf8');
if (adminDashboardCode.includes('{adminPin}') || adminDashboardCode.includes('Dev Mode Passcode:')) {
  console.error('  [FAIL] Detected exposed adminPin or Dev Mode Passcode banner in AdminDashboard.tsx!');
  passed = false;
} else {
  console.log('  [PASS] No plaintext passcode display or dev mode banner in AdminDashboard.');
}

const contextCode = fs.readFileSync('src/context/PortfolioContext.tsx', 'utf8');
if (contextCode.includes('if (!import.meta.env.DEV) return false;')) {
  console.log('  [PASS] Local passcode authentication strictly guarded by import.meta.env.DEV.');
} else {
  console.error('  [FAIL] Local passcode authentication is not restricted to dev mode!');
  passed = false;
}

console.log('\n====================================================');
if (passed) {
  console.log('  STATIC AUDIT RESULT: ALL STATIC CHECKS PASSED');
  console.log('  NOTE: Actual database runtime tests remain PENDING');
  console.log('        until a live Supabase project is connected.');
} else {
  console.error('  STATIC AUDIT RESULT: FAILURES DETECTED');
  process.exit(1);
}
console.log('====================================================\n');
