// ─── MARKS / ASSESSMENT SHEET INTEGRATION ────────────────────────────────────
// Live fetch from the SVCE Assessment Results Google Sheet.
// The sheet is PUBLIC and served via the gviz/tq CSV endpoint so no auth needed.
//
// Actual sheet columns (0-based):
//   0  = S.No
//   1  = Email
//   2  = Regd No        ← KEY for joining with attendance sheet
//   3  = Passout Year
//   4  = Batch / Branch
//   5  = Ques Count
//   6  = Total          ← marks scored (out of 30)
//   7  = Qualified      ← "QUALIFIED" / "NOT QUALIFIED"

export const MARKS_SHEET_ID = '1TZUFXJM0IiBoQU-MjvYXVCvRP--Wu2Vxhs1BgRZXKlc';

// gviz/tq endpoint works for publicly-shared sheets without login
export const MARKS_SHEET_URL = `https://docs.google.com/spreadsheets/d/${MARKS_SHEET_ID}/gviz/tq?tqx=out:csv`;

/**
 * Parse a single CSV row, handling quoted fields that may contain commas.
 */
export function parseCSVRow(line) {
  const cols = [];
  let current = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuote = !inQuote;
    } else if (ch === ',' && !inQuote) {
      cols.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  cols.push(current.trim());
  return cols;
}

/**
 * Parses the full CSV body into a Map of:
 *   regNo.toUpperCase() → { regNo, email, passoutYear, branch, questCount, total, maxMarks, percentage, qualified }
 *
 * Since this sheet is a flat list (one row per student, latest assessment),
 * each regNo maps to a single result object.
 */
export function parseMarksCSV(csvBody) {
  const lines = csvBody.split('\n').filter(l => l.trim());
  if (lines.length < 2) return new Map();

  /** @type {Map<string, Object>} */
  const marksMap = new Map();

  // Detect header row to confirm column positions
  const headerCols = parseCSVRow(lines[0]);
  const regNoColIdx   = headerCols.findIndex(h => /regd?\s*no/i.test(h));
  const emailColIdx   = headerCols.findIndex(h => /email/i.test(h));
  const totalColIdx   = headerCols.findIndex(h => /^total$/i.test(h));
  const qualColIdx    = headerCols.findIndex(h => /qualified/i.test(h));
  const quesColIdx    = headerCols.findIndex(h => /ques\s*count/i.test(h));
  const branchColIdx  = headerCols.findIndex(h => /batch|branch/i.test(h));
  const passoutColIdx = headerCols.findIndex(h => /passout/i.test(h));

  // Fallback to known fixed positions if header detection fails
  const REG_COL    = regNoColIdx   !== -1 ? regNoColIdx   : 2;
  const EMAIL_COL  = emailColIdx   !== -1 ? emailColIdx   : 1;
  const TOTAL_COL  = totalColIdx   !== -1 ? totalColIdx   : 6;
  const QUAL_COL   = qualColIdx    !== -1 ? qualColIdx    : 7;
  const QUES_COL   = quesColIdx    !== -1 ? quesColIdx    : 5;
  const BRANCH_COL = branchColIdx  !== -1 ? branchColIdx  : 4;
  const PASS_COL   = passoutColIdx !== -1 ? passoutColIdx : 3;

  const MAX_MARKS = 30; // each assessment is out of 30

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVRow(lines[i]);
    if (cols.length < 6) continue;

    const regNo = (cols[REG_COL] || '').trim().toUpperCase();
    if (!regNo) continue;

    const email      = (cols[EMAIL_COL]  || '').trim();
    const passoutYr  = (cols[PASS_COL]   || '').trim();
    const branch     = (cols[BRANCH_COL] || '').trim();
    const questCount = parseInt(cols[QUES_COL])  || 0;
    const total      = parseInt(cols[TOTAL_COL]) || 0;
    const qualified  = (cols[QUAL_COL] || '').trim().toUpperCase() === 'QUALIFIED';
    const percentage = MAX_MARKS > 0 ? Math.round((total / MAX_MARKS) * 100) : 0;

    marksMap.set(regNo, {
      regNo,
      email,
      passoutYear: passoutYr,
      branch,
      questCount,
      total,
      maxMarks: MAX_MARKS,
      percentage,
      qualified,
    });
  }

  return marksMap;
}

/**
 * Given a marksMap (regNo → result), returns the entry for a given regNo.
 * Returns null if no entry found.
 */
export function getMarksByRegNo(marksMap, regNo) {
  if (!marksMap || !regNo) return null;
  return marksMap.get(regNo.toUpperCase()) || null;
}

/**
 * Legacy helper kept for backward-compatibility:
 * Previously returned a date-filtered sub-map; now just returns the full marksMap
 * since the new sheet is not date-partitioned.
 *
 * @param {Map} marksMap
 * @param {string} _ddmmyyyy  (ignored – kept for API compatibility)
 * @returns {Map}
 */
export function getMarksByDate(marksMap, _ddmmyyyy) {
  // The new sheet has one entry per student (latest assessment) — return full map.
  return marksMap;
}

/**
 * Returns summary statistics from the marksMap.
 */
export function getMarksSummary(marksMap) {
  if (!marksMap || marksMap.size === 0) {
    return { total: 0, qualified: 0, notQualified: 0, avgScore: 0, avgPercentage: 0 };
  }
  let qualified = 0;
  let totalScore = 0;
  for (const entry of marksMap.values()) {
    if (entry.qualified) qualified++;
    totalScore += entry.total;
  }
  const total = marksMap.size;
  return {
    total,
    qualified,
    notQualified: total - qualified,
    avgScore: Math.round(totalScore / total),
    avgPercentage: Math.round((totalScore / (total * 30)) * 100),
  };
}

/**
 * Returns a branch-wise breakdown: { branchName → { qualified, notQualified, total, avgScore } }
 */
export function getBranchBreakdown(marksMap) {
  const branches = {};
  for (const entry of marksMap.values()) {
    const b = entry.branch || 'Unknown';
    if (!branches[b]) branches[b] = { qualified: 0, notQualified: 0, total: 0, totalScore: 0 };
    branches[b].total++;
    branches[b].totalScore += entry.total;
    if (entry.qualified) branches[b].qualified++;
    else branches[b].notQualified++;
  }
  // Compute average
  for (const b of Object.keys(branches)) {
    branches[b].avgScore = Math.round(branches[b].totalScore / branches[b].total);
    delete branches[b].totalScore;
  }
  return branches;
}

/**
 * Returns a score-range distribution array for charting:
 * [{ label, count, qualified, notQualified }, ...]
 */
export function getScoreDistribution(marksMap, ranges) {
  const defaultRanges = [
    { label: '0 Marks',    min: 0,  max: 0  },
    { label: '1-5 Marks',  min: 1,  max: 5  },
    { label: '6-10 Marks', min: 6,  max: 10 },
    { label: '11-15 Marks',min: 11, max: 15 },
    { label: '16-20 Marks',min: 16, max: 20 },
    { label: '21-25 Marks',min: 21, max: 25 },
    { label: '26-30 Marks',min: 26, max: 30 },
    { label: '> 30 Marks', min: 31, max: 999},
  ];
  const r = ranges || defaultRanges;
  const dist = r.map(range => ({ ...range, count: 0, qualified: 0, notQualified: 0 }));

  for (const entry of marksMap.values()) {
    const idx = dist.findIndex(d => entry.total >= d.min && entry.total <= d.max);
    if (idx !== -1) {
      dist[idx].count++;
      if (entry.qualified) dist[idx].qualified++;
      else dist[idx].notQualified++;
    }
  }
  return dist;
}
