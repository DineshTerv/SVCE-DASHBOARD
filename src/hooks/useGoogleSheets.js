import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import {
  ATTENDANCE_SHEET_XLSX_URL,
  parseAttendanceSheet,
  normaliseDateKey,
} from "../data/sheetsIntegration";

const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // auto-refresh every 5 min

export default function useGoogleSheets(selectedDate) {
  const [sheetStudents, setSheetStudents] = useState([]);   // live parsed students from ALL tabs
  const [sheetDates, setSheetDates]       = useState([]);   // available dates from sheet
  const [loading, setLoading]             = useState(false);
  const [lastSynced, setLastSynced]       = useState(null);
  const [error, setError]                 = useState(null);

  // ── Fetch & Parse All Tabs from XLSX ─────────────────────────────────────────
  const fetchAttendance = useCallback(async () => {
    if (!ATTENDANCE_SHEET_XLSX_URL) return;
    setLoading(true);
    setError(null);

    try {
      const cacheBuster = new Date().getTime();
      const url = `${ATTENDANCE_SHEET_XLSX_URL}&_cb=${cacheBuster}`;
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch sheet. Status: " + response.status);
      
      const arrayBuffer = await response.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      
      let allStudents = [];
      let allDates = new Set();
      
      // Iterate over every tab in the workbook
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        // raw: false ensures Excel dates (e.g. 46281) are formatted as strings like "16/09/2026"
        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: "" });
        
        const { students, dates } = parseAttendanceSheet(rows, sheetName);
        allStudents = allStudents.concat(students);
        dates.forEach(d => allDates.add(d));
      });

      // Update state with combined data
      setSheetStudents(allStudents);
      
      // Sort dates assuming DD/MM/YYYY
      const sortedDates = Array.from(allDates).sort((a, b) => {
        const [d1, m1, y1] = a.split("/");
        const [d2, m2, y2] = b.split("/");
        return new Date(`${y1}-${m1}-${d1}`) - new Date(`${y2}-${m2}-${d2}`);
      });
      
      setSheetDates(sortedDates);
      setLastSynced(new Date());
    } catch (err) {
      setError("Failed to sync attendance: " + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Initial load + periodic refresh ─────────────────────────────────────────
  useEffect(() => {
    fetchAttendance();
    const timer = setInterval(fetchAttendance, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchAttendance]);

  // ── Derive KPIs & Progress for the selected date ────────────────────────────
  const dateKey = normaliseDateKey(selectedDate);

  // We map the live attendance onto our students array
  // We'll also merge in mock question data until the question sheet is provided
  const enrichedStudents = sheetStudents.map(s => {
    const todayRecord = s.attendanceMap[dateKey];
    const todayAtt = todayRecord ? (todayRecord.fn || "N/A") : "N/A";
    
    // Calculate overall attendance % across all dates
    let presentCount = 0;
    let totalDays = sheetDates.length;
    sheetDates.forEach(d => {
       if (s.attendanceMap[d] && s.attendanceMap[d].present) presentCount++;
    });
    const attendancePct = totalDays > 0 ? Math.round((presentCount / totalDays) * 100) : 0;

    return {
      ...s,
      todayAttendance: todayAtt,
      attendance: attendancePct, // Overall attendance %
    };
  });

  // Calculate today's attendance stats needed by App.jsx
  const attendanceStats = (() => {
    if (!sheetStudents.length) return { presentCount: 0, absentCount: 0, totalStudents: 0, percent: 0 };
    let present = 0, absent = 0;
    for (const s of sheetStudents) {
      const rec = s.attendanceMap[dateKey];
      if (rec && rec.present) present++;
      else absent++;
    }
    return {
      presentCount: present,
      absentCount: absent,
      totalStudents: sheetStudents.length,
      percent: sheetStudents.length ? Math.round((present / sheetStudents.length) * 100) : 0,
    };
  })();

  return {
    sheetStudents: enrichedStudents,
    sheetDates,
    attendanceStats, // Restored for App.jsx compatibility
    loading,
    lastSynced,
    error,
    refetch: fetchAttendance,
  };
}
