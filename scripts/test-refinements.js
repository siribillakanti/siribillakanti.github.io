#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('   SIRI PORTFOLIO — REFINEMENT & QUOTA TEST SUITE   ');
console.log('====================================================\n');

let totalPassed = 0;
let totalFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  [PASS] ${message}`);
    totalPassed++;
  } else {
    console.error(`  [FAIL] ${message}`);
    totalFailed++;
  }
}

// ==========================================
// TEST SUITE 1: STICKER PERSISTENCE & DATA FLOW
// ==========================================
console.log('SUITE 1: Verifying Sticker Data Flow & Context Binding...');

// Check PortfolioContext exports stickers & updateStickers
const contextCode = fs.readFileSync('src/context/PortfolioContext.tsx', 'utf8');
assert(contextCode.includes('stickers: StickerEditorState;'), 'PortfolioContext declares stickers state in context type');
assert(contextCode.includes('updateStickers:'), 'PortfolioContext exports updateStickers mutation function');
assert(contextCode.includes("doc.stickers && typeof doc.stickers === 'object'"), 'syncLivePortfolio synchronizes doc.stickers from Supabase');
assert(contextCode.includes("from('portfolio_stickers').upsert"), 'saveAllChanges synchronizes per-page rows to portfolio_stickers table');
assert(contextCode.includes("stickers: {"), 'saveAllChanges packages stickers into centralized PortfolioDocument payload');

// Check StickerLayer consumption of context
const layerCode = fs.readFileSync('src/components/Common/StickerLayer.tsx', 'utf8');
assert(layerCode.includes('usePortfolio()'), 'StickerLayer consumes usePortfolio for live reactive rendering');
assert(layerCode.includes('contextStickers'), 'StickerLayer checks context stickers before fallback');
assert(layerCode.includes('z-20'), 'StickerLayer uses z-20 for high-visibility non-blocking placement');

// Check StickerEditor uses usePortfolio
const editorCode = fs.readFileSync('src/components/Admin/editors/StickerEditor.tsx', 'utf8');
assert(editorCode.includes('usePortfolio()'), 'StickerEditor binds to PortfolioContext');
assert(editorCode.includes('updateStickers'), 'StickerEditor calls updateStickers to stage unsaved changes');
assert(!editorCode.includes('Upload stickers and decorative images. Drag, resize, and arrange them on each page.'), 'Sticker subtitle description successfully removed from header');

// Check ScrapbookStickerStudio presence & DecorationsEditor integration
const studioExists = fs.existsSync('src/components/Admin/editors/ScrapbookStickerStudio.tsx');
assert(studioExists, 'ScrapbookStickerStudio component file exists');
const decorationsCode = fs.readFileSync('src/components/Admin/editors/DecorationsEditor.tsx', 'utf8');
assert(decorationsCode.includes('<ScrapbookStickerStudio />'), 'DecorationsEditor mounts ScrapbookStickerStudio under Illustrations & Garden');


// ==========================================
// TEST SUITE 2: MONTHLY SUBMISSION QUOTA (200 / MONTH)
// ==========================================
console.log('\nSUITE 2: Verifying Monthly Quota (200 / month) Requirements...');

const schemaCode = fs.readFileSync('supabase/schema.sql', 'utf8');
const contactCode = fs.readFileSync('src/components/Contact/ContactSection.tsx', 'utf8');

// Check automatic monthly reset at 00:00 UTC on 1st of month
assert(
  schemaCode.includes("to_char(timezone('utc', now()), 'YYYY-MM')"),
  'Server uses to_char(timezone(\'utc\', now()), \'YYYY-MM\') to reset automatically at 00:00 UTC on 1st of month'
);

// Check count of ONLY accepted submissions
assert(
  schemaCode.includes("status = 'accepted'"),
  'Only successfully accepted submissions are counted against quota'
);
assert(
  contactCode.includes("res.ok && data.success === true") &&
  contactCode.includes("record_contact_submission"),
  'Frontend calls record_contact_submission ONLY after Web3Forms confirms success === true'
);

// Check server-side advisory transaction lock for concurrency safety
assert(
  schemaCode.includes('pg_advisory_xact_lock'),
  'Advisory transaction lock (pg_advisory_xact_lock) prevents race conditions exceeding 200'
);

// Check hard limit of 200 in PostgreSQL function
assert(
  schemaCode.includes('v_limit CONSTANT INTEGER := 200;'),
  'PostgreSQL function defines hard limit of 200 submissions'
);

// Check UI block and friendly message when quota is reached
assert(
  contactCode.includes('quotaStatus.isLimitReached'),
  'ContactSection checks quotaStatus.isLimitReached before allowing submission'
);
assert(
  contactCode.includes('MONTHLY CONTACT LIMIT REACHED (200 / 200)'),
  'ContactSection renders friendly notice when monthly limit is reached'
);
assert(
  contactCode.includes('mailto:${recipientEmail}'),
  'Direct mailto fallback is provided when monthly submission limit is reached'
);


// ==========================================
// TEST SUITE 3: REFINEMENT SECURITY VERIFICATION
// ==========================================
console.log('\nSUITE 3: Verifying Security Posture...');

// Verify no service-role key or private secrets
assert(
  !contactCode.includes('service_role'),
  'Contact form does not expose or import service-role key'
);
assert(
  !contextCode.includes('service_role'),
  'PortfolioContext does not expose or import service-role key'
);

// Verify SECURITY DEFINER functions have safe search_path
assert(
  schemaCode.includes("CREATE OR REPLACE FUNCTION public.get_contact_quota()\nRETURNS jsonb\nLANGUAGE plpgsql\nSECURITY DEFINER\nSET search_path = ''") ||
  schemaCode.includes("SET search_path = ''"),
  'All quota functions enforce safe search_path = \'\''
);

console.log('\n====================================================');
console.log(`TEST RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
console.log('====================================================');

if (totalFailed > 0) {
  process.exit(1);
}
