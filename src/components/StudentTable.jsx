import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, RefreshCw, Award, AlertTriangle, TrendingUp } from 'lucide-react';

// Attendance status badge styling
const ATTENDANCE_STYLES = {
  P:   { label: "Present",  bg: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  PL:  { label: "Present",  bg: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  PN:  { label: "No Laptop",bg: "bg-amber-50   text-amber-700   border border-amber-200"   },
  A:   { label: "Absent",   bg: "bg-rose-50    text-rose-700    border border-rose-200"     },
  "N/A": { label: "Nil",    bg: "bg-slate-100  text-slate-500   border border-slate-200"   },
};

// Mini SVG Circular Progress Rings for the table
function MiniProgressRing({ value = 0, max = 10 }) {
  const pct = Math.min((value / max) * 100, 100);
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;
  
  const color = pct >= 100 ? "#10b981" : pct > 0 ? "#f59e0b" : "#f43f5e";
  const bgClass = pct >= 100 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : 
                  pct > 0 ? "bg-amber-50 text-amber-700 border-amber-200" : 
                  "bg-rose-50 text-rose-700 border-rose-200";

  return (
    <div className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full border ${bgClass} transition-transform hover:scale-105 cursor-default`}>
      <svg width="24" height="24" className="-rotate-90">
        <circle cx="12" cy="12" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="opacity-20" />
        <circle 
          cx="12" cy="12" r={radius} 
          fill="none" 
          stroke={color} 
          strokeWidth="3" 
          strokeDasharray={circumference} 
          strokeDashoffset={offset} 
          strokeLinecap="round" 
          className="transition-all duration-1000 ease-out" 
        />
      </svg>
      <span className="text-xs font-bold">{value}/{max}</span>
    </div>
  );
}

// Marks badge – shows score, percentage and qualified status
function MarksBadge({ marks }) {
  if (!marks) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-400 border border-slate-200 text-[11px] font-semibold">
        —
      </span>
    );
  }

  const { total, maxMarks, percentage, qualified } = marks;
  const pctNum = typeof percentage === 'number' ? percentage : parseFloat(percentage) || 0;

  const bg = qualified
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : pctNum >= 50
    ? 'bg-amber-50 text-amber-700 border-amber-200'
    : 'bg-rose-50 text-rose-700 border-rose-200';

  const icon = qualified ? '✅' : pctNum >= 50 ? '⚠️' : '❌';

  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border ${bg} text-[11px] font-bold transition-transform hover:scale-105 cursor-default`}>
        {icon} {total}/{maxMarks}
      </span>
      <span className={`text-[10px] font-semibold ${qualified ? 'text-emerald-600' : pctNum >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>
        {pctNum.toFixed(0)}%
      </span>
    </div>
  );
}

// Branch / extra info card (replaces module breakdown since new sheet has branch data)
function BranchInfo({ marks }) {
  if (!marks) return <span className="text-slate-300 text-xs">—</span>;

  const { branch, questCount, percentage } = marks;
  const pct = typeof percentage === 'number' ? percentage : parseFloat(percentage) || 0;
  const pctColor = pct >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                 : pct >= 50 ? 'text-amber-700 bg-amber-50 border-amber-200'
                 : 'text-rose-700 bg-rose-50 border-rose-200';

  return (
    <div className="flex flex-col gap-1 min-w-[100px]">
      {branch && (
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-slate-500 font-medium">Branch:</span>
          <span className="text-[10px] font-bold text-slate-700">{branch}</span>
        </div>
      )}
      <div className="flex items-center gap-1">
        <span className="text-[10px] text-slate-500 font-medium">Qs:</span>
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${pctColor}`}>{questCount} · {pct.toFixed(0)}%</span>
      </div>
    </div>
  );
}

export default function StudentTable({ students, formattedDate, loading, lastSynced, onRefresh, marksForDate, marksError }) {
  const [searchTerm, setSearchTerm]       = useState('');
  const [selectedDept, setSelectedDept]   = useState('All Depts');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [selectedTrainer, setSelectedTrainer] = useState('All Trainers');
  const [qualifiedFilter, setQualifiedFilter] = useState('All');
  const [currentPage, setCurrentPage]     = useState(1);
  const itemsPerPage = 10;

  const liveDepts = ["All Depts", ...Array.from(new Set(students.map(s => s.dept))).filter(Boolean).sort()];
  const liveTrainers = ["All Trainers", ...Array.from(new Set(students.map(s => s.trainer))).filter(t => t && t !== 'Unknown').sort()];

  // Count marks stats
  const marksCount = marksForDate ? marksForDate.size : 0;
  const qualifiedCount = marksForDate ? [...marksForDate.values()].filter(m => m.qualified).length : 0;

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.regNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept  = selectedDept === 'All Depts' || s.dept === selectedDept;
    const matchesBatch = selectedBatch === 'All Batches' || s.batch === selectedBatch;
    const matchesTrainer = selectedTrainer === 'All Trainers' || s.trainer === selectedTrainer;
    
    // Marks filter
    if (qualifiedFilter !== 'All') {
      const marks = marksForDate?.get(s.regNo);
      if (qualifiedFilter === 'Qualified' && !(marks && marks.qualified)) return false;
      if (qualifiedFilter === 'Not Qualified' && !(marks && !marks.qualified)) return false;
      if (qualifiedFilter === 'No Attempt' && marks) return false;
    }

    return matchesSearch && matchesDept && matchesBatch && matchesTrainer;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 my-6 transition-all duration-300 hover:shadow-md">
      
      {/* Header row */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Student Details – All Batches
            {marksCount > 0 && (
              <span className="flex items-center gap-1 text-xs font-semibold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">
                <Award className="w-3 h-3" />
                {qualifiedCount}/{marksCount} Qualified
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
            Live attendance &amp; assessment marks from Google Sheets
            {lastSynced && (
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full font-semibold">
                Synced: {lastSynced.toLocaleTimeString()}
              </span>
            )}
            {loading && (
              <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                Syncing…
              </span>
            )}
            {marksError && (
              <span className="text-[10px] bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Marks sync error
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Manual refresh */}
          <button
            onClick={onRefresh}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#005F69] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition cursor-pointer hover:-translate-y-0.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>

          {/* Search */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#005F69] transition hover:shadow-sm"
            />
          </div>

          {/* Dept filter */}
          <div className="relative">
            <select 
              value={selectedDept}
              onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
              className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#005F69] cursor-pointer appearance-none hover:shadow-sm transition"
            >
              {liveDepts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Trainer filter */}
          <div className="relative">
            <select 
              value={selectedTrainer}
              onChange={(e) => { setSelectedTrainer(e.target.value); setCurrentPage(1); }}
              className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#005F69] cursor-pointer appearance-none hover:shadow-sm transition"
            >
              {liveTrainers.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Qualified filter */}
          {marksCount > 0 && (
            <div className="relative">
              <select
                value={qualifiedFilter}
                onChange={(e) => { setQualifiedFilter(e.target.value); setCurrentPage(1); }}
                className="pl-3 pr-8 py-2 bg-violet-50 border border-violet-200 rounded-xl text-xs font-medium text-violet-700 focus:outline-none focus:border-violet-400 cursor-pointer appearance-none hover:shadow-sm transition"
              >
                <option value="All">All Students</option>
                <option value="Qualified">✅ Qualified</option>
                <option value="Not Qualified">❌ Not Qualified</option>
                <option value="No Attempt">— No Attempt</option>
              </select>
              <TrendingUp className="w-3.5 h-3.5 text-violet-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}
        </div>
      </div>

      {/* Marks stats banner */}
      {marksCount > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center bg-emerald-50 border border-emerald-100 rounded-xl py-2 px-4">
            <span className="text-lg font-black text-emerald-700">{qualifiedCount}</span>
            <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">Qualified</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-rose-50 border border-rose-100 rounded-xl py-2 px-4">
            <span className="text-lg font-black text-rose-700">{marksCount - qualifiedCount}</span>
            <span className="text-[10px] text-rose-600 font-semibold uppercase tracking-wide">Not Qualified</span>
          </div>
          <div className="flex flex-col items-center justify-center bg-slate-50 border border-slate-100 rounded-xl py-2 px-4">
            <span className="text-lg font-black text-slate-600">{students.length - marksCount}</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wide">No Attempt</span>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-inner">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-100 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Sl No</th>
              <th className="py-3.5 px-4">Student Name</th>
              <th className="py-3.5 px-4">Register Number</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Trainer</th>
              <th className="py-3.5 px-4">Laptop</th>
              <th className="py-3.5 px-4 text-center">Attendance FN ({formattedDate})</th>
              <th className="py-3.5 px-4 text-center">Today Progress</th>
              <th className="py-3.5 px-4 text-center">
                <span className="flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-violet-500" />
                  Marks ({formattedDate})
                </span>
              </th>
              <th className="py-3.5 px-4 text-center">Branch / Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-10 text-slate-400 text-xs font-medium">
                  {loading ? "Fetching live data from Google Sheets…" : "No students found."}
                </td>
              </tr>
            ) : (
              paginatedStudents.map((s, idx) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + idx;
                const attStatus   = s.todayAttendance || "N/A";
                const attStyle    = ATTENDANCE_STYLES[attStatus] || ATTENDANCE_STYLES["N/A"];
                const marks       = marksForDate?.get(s.regNo) || null;
                const todayVal    = marks?.total || 0;
                const maxMarks    = marks?.maxMarks || 30;

                return (
                  <tr key={s.regNo + globalIndex}
                      className={`hover:bg-slate-50 transition-colors ${marks?.qualified ? 'bg-emerald-50/30' : ''}`}>
                    <td className="py-4 px-4 font-semibold text-slate-500">{globalIndex + 1}</td>
                    <td className="py-4 px-4 font-bold text-slate-800">
                      {s.name}
                      {s.isStar && <span className="text-amber-400 ml-1">★</span>}
                      {marks?.qualified && <span className="text-emerald-500 ml-1" title="Qualified">🏆</span>}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600">{s.regNo}</td>
                    <td className="py-4 px-4 font-medium text-slate-600">{s.dept}</td>
                    <td className="py-4 px-4 font-medium text-[#005F69]">{s.trainer}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold shadow-xs ${s.laptopStatus === 'YES' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : s.laptopStatus === 'NO' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                        {s.laptopStatus || "–"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold shadow-xs ${attStyle.bg}`}>
                        {attStyle.label}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <MiniProgressRing value={todayVal} max={maxMarks} />
                    </td>
                    <td className="py-4 px-4 text-center">
                      <MarksBadge marks={marks} />
                    </td>
                    <td className="py-4 px-4">
                      <BranchInfo marks={marks} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-500 font-medium">
        <div>
          Showing {paginatedStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} –{" "}
          {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
        </div>

        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 font-bold text-slate-700 bg-slate-50 rounded-lg border border-slate-200">
            {currentPage} / {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
