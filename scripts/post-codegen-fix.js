const fs = require('fs');
const path = require('path');

const TARGET_FILE = path.resolve(__dirname, '../src/client/transformers.gen.ts');
const NEEDLE = 'if (data.id)';
const REPLACEMENT = 'if (data?.id)';

function replaceAll(content, search, replacement) {
  return content.split(search).join(replacement);
}

try {
  if (!fs.existsSync(TARGET_FILE)) {
    console.error(`[codegen-fix] File not found: ${TARGET_FILE}`);
    process.exit(1);
  }

  const originalContent = fs.readFileSync(TARGET_FILE, 'utf8');
  let occurrences = 0;
  let index = originalContent.indexOf(NEEDLE);
  while (index !== -1) {
    occurrences += 1;
    index = originalContent.indexOf(NEEDLE, index + NEEDLE.length);
  }

  if (occurrences === 0) {
    console.log('[codegen-fix] No matches found, skipping.');
    process.exit(0);
  }

  const updatedContent = replaceAll(originalContent, NEEDLE, REPLACEMENT);
  fs.writeFileSync(TARGET_FILE, updatedContent, 'utf8');
  console.log(`[codegen-fix] Replaced ${occurrences} occurrence(s) of "${NEEDLE}".`);
} catch (error) {
  console.error('[codegen-fix] Failed to update transformers.gen.ts:', error);
  process.exit(1);
}
