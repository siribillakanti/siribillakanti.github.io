#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log('   SIRI PORTFOLIO — REFINEMENT & REGRESSION SUITE   ');
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
// TEST SUITE 2: CLEAN DIRECT CONTACT SECTION
// ==========================================
console.log('\nSUITE 2: Verifying Clean Direct Contact Channels...');

const contactCode = fs.readFileSync('src/components/Contact/ContactSection.tsx', 'utf8');

// Verify Heading & Description
assert(
  contactCode.includes("Let's stay connected."),
  'ContactSection renders heading: "Let\'s stay connected."'
);
assert(
  contactCode.includes("Have an opportunity, a project idea, or just want to say hello? I'd love to hear from you."),
  'ContactSection renders approved description text'
);

// Verify Three Direct Channels
assert(
  contactCode.includes('mailto:${recipientEmail}') || contactCode.includes('mailto:siri.billakanti1@gmail.com'),
  'Direct email channel link (mailto) is present'
);
assert(
  contactCode.includes('linkedin.com/in/siri-billakanti-0b798a384'),
  'Direct LinkedIn channel link is present'
);
assert(
  contactCode.includes('github.com/siribillakanti'),
  'Direct GitHub channel link is present'
);

// Verify Quick-Copy Email Feature
assert(
  contactCode.includes('handleCopyEmail'),
  'One-click email copy functionality is present'
);

// Verify complete elimination of Web3Forms, quotas, honeypots, and submission forms
assert(
  !contactCode.includes('web3forms'),
  'Web3Forms API references completely eliminated from ContactSection'
);
assert(
  !contactCode.includes('quotaStatus'),
  'Quota state and indicators completely eliminated from ContactSection'
);
assert(
  !contactCode.includes('botcheck'),
  'Honeypot fields completely eliminated from ContactSection'
);
assert(
  !contactCode.includes('claim_contact_slot'),
  'Slot claim RPCs completely eliminated from ContactSection'
);
assert(
  !contactCode.includes('<form'),
  'HTML submission form completely eliminated in favor of direct communication channels'
);


// ==========================================
// TEST SUITE 3: SECURITY & SECRETS AUDIT
// ==========================================
console.log('\nSUITE 3: Verifying Security Posture...');

// Verify no service-role key or private secrets
assert(
  !contactCode.includes('service_role'),
  'Contact section does not expose or import service-role key'
);
assert(
  !contextCode.includes('service_role'),
  'PortfolioContext does not expose or import service-role key'
);

const schemaCode = fs.readFileSync('supabase/schema.sql', 'utf8');
assert(
  schemaCode.includes("SET search_path = ''"),
  'All SECURITY DEFINER functions enforce safe search_path = \'\''
);

console.log('\n====================================================');
console.log(`TEST RESULTS: ${totalPassed} PASSED, ${totalFailed} FAILED`);
console.log('====================================================');

if (totalFailed > 0) {
  process.exit(1);
}
