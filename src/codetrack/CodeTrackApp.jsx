import React, { useState, useMemo } from "react";
import Navbar from "./components/Navbar";
import HeroStat from "./components/HeroStat";
import ProgressRing from "./components/ProgressRing";
import BarChartCard from "./components/BarChartCard";
import Leaderboard from "./components/Leaderboard";
import AttentionList from "./components/AttentionList";
import StudentTable from "./components/StudentTable";

import useGoogleSheets from "../hooks/useGoogleSheets";

export default function CodeTrackApp() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Fetch LIVE data from ALL tabs in the Google Sheet
  const {
    sheetStudents,
    sheetDates,
    loading,
    lastSynced,
    error,
    refetch
  } = useGoogleSheets(selectedDate);

  // Compute live stats based on the fetched students
  const totalStudents = sheetStudents.length;
  const totalBatches = 6; // VINOTHA, SARVESH, SUBHIKSHA, PAVITHRA, NIKITHA, ARVIN
  
  const todayCompleted = sheetStudents.filter(s => s.todayQ >= 10).length;
  const tillDateCompleted = sheetStudents.filter(s => s.tillDateQ >= 43).length;
  
  const avgAttendance = totalStudents > 0 
    ? Math.round(sheetStudents.reduce((a, s) => a + s.attendance, 0) / totalStudents)
    : 0;

  const todayPct = totalStudents > 0 ? Math.round((todayCompleted / totalStudents) * 100) : 0;
  const tillDatePct = totalStudents > 0 ? Math.round((tillDateCompleted / totalStudents) * 100) : 0;

  // Distributions
  const todayDist = useMemo(() => {
    const buckets = Array.from({ length: 16 }, (_, i) => ({ label: `${i}`, count: 0 }));
    for (const s of sheetStudents) {
      const idx = Math.min(s.todayQ || 0, 15);
      buckets[idx].count++;
    }
    return buckets;
  }, [sheetStudents]);

  const tillDateDist = useMemo(() => {
    const ranges = [
      { label: "0", min: 0, max: 0 }, { label: "1-14", min: 1, max: 14 },
      { label: "15-28", min: 15, max: 28 }, { label: "29-42", min: 29, max: 42 },
      { label: "43-56", min: 43, max: 56 }, { label: "57-70", min: 57, max: 70 },
      { label: "71-84", min: 71, max: 84 }, { label: "85+", min: 85, max: 999 }
    ];
    return ranges.map(r => ({
      label: r.label,
      count: sheetStudents.filter(s => s.tillDateQ >= r.min && s.tillDateQ <= r.max).length,
    }));
  }, [sheetStudents]);

  const topPerformers = useMemo(() => 
    [...sheetStudents].sort((a, b) => b.tillDateQ - a.tillDateQ || b.todayQ - a.todayQ).slice(0, 5)
  , [sheetStudents]);

  const needsAttention = useMemo(() => 
    [...sheetStudents]
      .filter(s => s.todayQ === 0 || s.attendance < 70)
      .sort((a, b) => a.todayQ - b.todayQ || a.attendance - b.attendance)
      .slice(0, 5)
  , [sheetStudents]);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#E0F2FE] via-[#FFFFFF] to-[#F0E9FF] overflow-hidden text-slate-800 font-sans selection:bg-sky-200 selection:text-sky-900">
      
      {/* ── Background Animated Blobs ── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-300/30 rounded-full blur-3xl mix-blend-multiply opacity-40 animate-blob" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] bg-purple-300/30 rounded-full blur-3xl mix-blend-multiply opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-15%] left-[20%] w-[600px] h-[600px] bg-cyan-200/30 rounded-full blur-3xl mix-blend-multiply opacity-40 animate-blob animation-delay-4000" />
      </div>

      {/* ── Glass Navbar ── */}
      <Navbar 
        selectedDate={selectedDate} 
        setSelectedDate={setSelectedDate} 
        onSync={refetch}
        syncing={loading}
      />

      {/* ── Main Content Bento Grid ── */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 py-10 flex flex-col gap-6">
        
        {error && (
          <div className="bg-rose-50/80 backdrop-blur border border-rose-200 text-rose-600 px-6 py-3 rounded-2xl text-sm font-bold shadow-sm">
            Failed to sync: {error}
          </div>
        )}

        {/* Row 1: Hero Stat */}
        <HeroStat 
          totalStudents={totalStudents}
          totalBatches={totalBatches}
          todayCompleted={todayCompleted}
          formattedDate={new Date(selectedDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        />

        {/* Row 2: Progress Rings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="row-span-2 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:-translate-y-1 transition-transform duration-300"
               style={{ background: "rgba(255,255,255,0.60)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.80)", boxShadow: "0 8px 32px 0 rgba(56,189,248,0.10)" }}>
            <h2 className="text-xl font-bold mb-8">Today's Target</h2>
            <ProgressRing pct={todayPct} label={`${todayCompleted} / ${totalStudents} students completed`} size={240} thick={20} gradFrom="#38bdf8" gradTo="#818cf8" />
          </div>
          <div className="rounded-3xl p-6 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300"
               style={{ background: "rgba(255,255,255,0.60)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.80)", boxShadow: "0 8px 32px 0 rgba(167,139,250,0.10)" }}>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Till Date Target</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[120px]">Students hitting cumulative targets</p>
            </div>
            <ProgressRing pct={tillDatePct} size={100} thick={10} gradFrom="#a78bfa" gradTo="#ec4899" />
          </div>
          <div className="rounded-3xl p-6 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300"
               style={{ background: "rgba(255,255,255,0.60)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.80)", boxShadow: "0 8px 32px 0 rgba(52,211,153,0.10)" }}>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Avg Attendance</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-[120px]">Overall class attendance rate</p>
            </div>
            <ProgressRing pct={avgAttendance} size={100} thick={10} gradFrom="#34d399" gradTo="#06b6d4" />
          </div>
        </div>

        {/* Row 3: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChartCard title="Today's Submission Spread" subtitle="Distribution of questions solved today" data={todayDist} gradFrom="#38bdf8" gradTo="#818cf8" delayIndex={0} />
          <BarChartCard title="Cumulative Progress" subtitle="Questions solved till date" data={tillDateDist} gradFrom="#a78bfa" gradTo="#ec4899" delayIndex={1} />
        </div>

        {/* Row 4: Leaderboard & Attention */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Leaderboard performers={topPerformers} delayIndex={2} />
          <AttentionList students={needsAttention} delayIndex={3} />
        </div>

        {/* Row 5: Table */}
        <StudentTable students={sheetStudents} delayIndex={4} />
      </main>
    </div>
  );
}
