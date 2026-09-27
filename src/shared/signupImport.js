// CSV/XLS/XLSX import for the Sign-ups page. XLSX parsing is loaded from
// SheetJS's own CDN at runtime rather than bundled from npm — the npm
// "xlsx" package has unpatched prototype-pollution/ReDoS advisories;
// SheetJS only ships security fixes through their own CDN now.
const SHEETJS_CDN = 'https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js';

let xlsxLoad = null;
function loadXLSX() {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  if (!xlsxLoad) {
    xlsxLoad = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = SHEETJS_CDN;
      script.onload = () => resolve(window.XLSX);
      script.onerror = () => reject(new Error('Could not load the spreadsheet reader. Check your connection and try again.'));
      document.head.appendChild(script);
    });
  }
  return xlsxLoad;
}

// Map a loosely-labeled header (e.g. "E-mail", "Full Name") to a known field.
const HEADER_ALIASES = {
  name: ['name', 'full name', 'fullname'],
  email: ['email', 'e-mail', 'email address'],
  phone: ['phone', 'phone number', 'cell', 'mobile'],
  experience: ['experience', 'officiating experience', 'level'],
  availability: ['availability', 'available', 'days available'],
  role: ['role', 'interest', 'volunteer role', 'position'],
  note: ['note', 'notes', 'comment', 'comments', 'message'],
};

function normalizeHeader(h) {
  return String(h || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function fieldForHeader(h) {
  const norm = normalizeHeader(h);
  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    if (aliases.includes(norm)) return field;
  }
  return null;
}

/**
 * Parse a File (csv/xls/xlsx) into rows of { name, email, phone, experience,
 * availability, role, note }, using flexible header matching. Rows missing
 * a name or email are dropped and counted as skipped.
 */
export async function parseSignupFile(file) {
  const XLSX = await loadXLSX();
  const buf = await file.arrayBuffer();
  const workbook = XLSX.read(buf, { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const raw = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });

  const rows = [];
  let skipped = 0;
  for (const record of raw) {
    const mapped = {};
    for (const [header, value] of Object.entries(record)) {
      const field = fieldForHeader(header);
      if (field && String(value).trim()) mapped[field] = String(value).trim();
    }
    if (mapped.name && mapped.email) {
      rows.push(mapped);
    } else {
      skipped++;
    }
  }
  return { rows, skipped, total: raw.length };
}
