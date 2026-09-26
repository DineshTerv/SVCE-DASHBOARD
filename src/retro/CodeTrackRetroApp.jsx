import React, { useState, useEffect, useMemo } from "react";
import BootSequence from "./components/BootSequence";
import Header from "./components/Header";
import StatBox from "./components/StatBox";
import TerminalChart from "./components/TerminalChart";
import Leaderboard from "./components/Leaderboard";
import AttentionPanel from "./components/AttentionPanel";
import StudentTable from "./components/StudentTable";
import { loadData, generateAsciiBar } from "./data";

export default function CodeTrackRetroApp() {
  const [booting, setBooting] = useState(true);
  const [studentData, setStudentData] = useState([]);
  const [syncing, setSyncing] = useState(false);

  // Initial load
  useEffect(() => {
    loadData().then(data => setStudentData(data));
  }, []);

  const handleSync = () => {
    setSyncing(true);
    // Simulate network delay for the sync animation
    setTimeout(() => {
      loadData().then(data => {
        setStudentData(data);
        setSyncing(false);
      });
    }, 1500);
  };

  // Derived Stats
  const totalStudents = studentData.length;
  const activeBatches = new Set(studentData.map(s => s.batch)).size;
  const todayCompleted = studentData.filter(s => s.todayCount >= 10).length;
  const tillDateCompleted = studentData.filter(s => s.cumulativeProgress >= 43).length;

  const todayAscii = totalStudents > 0 ? generateAsciiBar(todayCompleted, totalStudents, 10) : generateAsciiBar(0, 10, 10);
  const tillDateAscii = totalStudents > 0 ? generateAsciiBar(tillDateCompleted, totalStudents, 10) : generateAsciiBar(0, 10, 10);
  
  const todayPct = totalStudents > 0 ? Math.round((todayCompleted / totalStudents) * 100) : 0;
  const tillDatePct = totalStudents > 0 ? Math.round((tillDateCompleted / totalStudents) * 100) : 0;

  // Chart Data
  const todayDist = useMemo(() => {
    const buckets = Array.from({ length: 16 }, (_, i) => ({ label: `${i}`, count: 0 }));
    for (const s of studentData) {
      const idx = Math.min(s.todayCount || 0, 15);
      buckets[idx].count++;
    }
    return buckets;
  }, [studentData]);

  const tillDateDist = useMemo(() => {
    const ranges = [
      { label: "0", min: 0, max: 0 }, { label: "1-14", min: 1, max: 14 },
      { label: "15-28", min: 15, max: 28 }, { label: "29-42", min: 29, max: 42 },
      { label: "43-56", min: 43, max: 56 }, { label: "57-70", min: 57, max: 70 },
      { label: "71-84", min: 71, max: 84 }, { label: "85+", min: 85, max: 999 }
    ];
    return ranges.map(r => ({
      label: r.label,
      count: studentData.filter(s => s.cumulativeProgress >= r.min && s.cumulativeProgress <= r.max).length,
    }));
  }, [studentData]);

  const topStudents = useMemo(() => 
    [...studentData].sort((a, b) => b.cumulativeProgress - a.cumulativeProgress || b.todayCount - a.todayCount).slice(0, 10)
  , [studentData]);

  const attentionStudents = useMemo(() => 
    [...studentData].filter(s => s.todayCount === 0 || s.avgAttendance < 75)
  , [studentData]);

  return (
    <>
      <div className="crt-overlay" />
      
      {booting ? (
        <BootSequence onComplete={() => setBooting(false)} />
      ) : (
        <div className="min-h-screen p-4 sm:p-8 uppercase">
          <div className="max-w-7xl mx-auto flex flex-col gap-6">
            
            <Header 
              date="22-SEP-2026" 
              onSync={handleSync} 
              syncing={syncing} 
            />

            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatBox label="TOTAL_STUDENTS" value={totalStudents} />
              <StatBox label="ACTIVE_BATCHES" value={activeBatches} />
              <StatBox 
                label="TODAY_TARGET" 
                value={`${todayCompleted}/${totalStudents}`} 
                progressAscii={`${todayAscii} ${todayPct}%`} 
              />
              <StatBox 
                label="TILL_DATE_TARGET" 
                value={`${tillDateCompleted}/${totalStudents}`} 
                progressAscii={`${tillDateAscii} ${tillDatePct}%`} 
                isAmber={true}
              />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TerminalChart header="$ query --today-submissions" data={todayDist} />
              <TerminalChart header="$ query --cumulative-progress" data={tillDateDist} isAmber={true} />
            </div>

            {/* Leaderboard & Attention */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Leaderboard topStudents={topStudents} />
              <AttentionPanel students={attentionStudents} />
            </div>

            {/* Student Table */}
            <StudentTable data={studentData} />

          </div>
        </div>
      )}
    </>
  );
}
