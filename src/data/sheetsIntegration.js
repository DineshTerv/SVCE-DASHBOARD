// Google Sheets integration utilities

// ─── ATTENDANCE SHEET ─────────────────────────────────────────────────────────
// Published XLSX URL for the attendance sheet (we use xlsx to fetch all tabs)
export const ATTENDANCE_SHEET_XLSX_URL =
  "https://docs.google.com/spreadsheets/d/1sOPtHWaT16sxIYZ--ktglkM_Ia05zKXFRDD0a7OYaak/export?format=xlsx";

export const QUESTIONS_SHEET_CSV_URL = "";

// ─── COLUMN MAPPING ───────────────────────────────────────────────────────────
// Row 0: headers   → S.NO, STUDENT NAME, REG.NO, DEPT, LAPTOP STATUS, DAY-1 ...
// Row 1: FN/AN labels
// Row 2: dates      → 16/09/2026, 17/09/2026, ...
// Data starts from row 3 (index 3 in raw array)

const STATIC_COLS = 5; // S.NO, NAME, REG, DEPT, LAPTOP

export function parseAttendanceSheet(rows, sheetName = "") {
  if (!rows || rows.length < 4) return { students: [], dateMap: {}, dates: [] };

  const dateRow   = rows[2];   // 16/09/2026, …

  // Build date list (unique, non-empty, skip every 2 columns)
  // Normalize all date formats (DD-MM-YYYY, DD/MM/YYYY) to DD/MM/YYYY
  const normaliseRawDate = (raw) => {
    if (!raw) return "";
    const s = raw.toString().trim();
    // DD-MM-YYYY → DD/MM/YYYY
    if (/^\d{2}-\d{2}-\d{4}$/.test(s)) return s.replace(/-/g, "/");
    // DD/MM/YYYY already good
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) return s;
    return s;
  };

  const dates = [];
  const dateColMap = {}; // normalised date string → { fnCol, anCol }
  for (let c = STATIC_COLS; c < dateRow.length; c += 2) {
    const rawDate = normaliseRawDate(dateRow[c]);
    if (rawDate && rawDate !== "DATE" && !dateColMap[rawDate]) {
      dates.push(rawDate);
      dateColMap[rawDate] = { fnCol: c, anCol: c + 1 };
    }
  }

  // Parse student rows (index 3 onwards)
  const students = [];
  for (let r = 3; r < rows.length; r++) {
    const row = rows[r] || [];
    const slNo = (row[0] || "").toString().trim();
    if (!slNo || isNaN(Number(slNo))) continue; // skip non-data rows

    const name    = (row[1] || "").toString().trim().toUpperCase();
    const regNo   = (row[2] || "").toString().trim().toUpperCase();
    const dept    = (row[3] || "").toString().trim().toUpperCase();
    const laptop  = (row[4] || "").toString().trim().toUpperCase(); // YES / NO / ""

    // Build per-date attendance
    const attendance = {};
    for (const date of dates) {
      const { fnCol, anCol } = dateColMap[date];
      const fn = (row[fnCol] || "").toString().trim().toUpperCase();
      const an = (row[anCol] || "").toString().trim().toUpperCase();
      attendance[date] = { fn, an, present: fn === "P" || fn === "PL" || fn === "PN" || fn === "P/A" };
    }

    students.push({
      id: regNo,           // unique identifier
      slNo: Number(slNo),
      name,
      regNo,
      dept,
      section: dept.includes("-") ? dept.split("-")[1] : "A",
      batch: "1",
      laptopStatus: laptop,
      attendanceMap: attendance, // keep track of raw map
      isStar: false,
      trainer: sheetName === "Sheet1" ? "Unknown" : sheetName,
    });
  }

  return { students, dateMap: dateColMap, dates };
}

export function normaliseDateKey(dateStr) {
  if (!dateStr) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return dateStr;
  const parts = dateStr.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return dateStr;
}

export function sheetDateToISO(ddmmyyyy) {
  if (!ddmmyyyy) return "";
  const p = ddmmyyyy.split("/");
  if (p.length === 3) return `${p[2]}-${p[1]}-${p[0]}`;
  return ddmmyyyy;
}

export function formatDisplayDate(isoDate) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (isNaN(d)) return isoDate;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}
