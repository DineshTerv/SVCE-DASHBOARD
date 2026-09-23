import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { DEPARTMENTS, BATCHES } from '../data/mockData';

export default function StudentTable({ students, formattedDate }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Depts');
  const [selectedBatch, setSelectedBatch] = useState('All Batches');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter students based on search and selected department/batch
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.regNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All Depts' || s.dept === selectedDept;
    const matchesBatch = selectedBatch === 'All Batches' || s.batch === selectedBatch;
    return matchesSearch && matchesDept && matchesBatch;
  });

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper for progress pill color
  const getProgressBadge = (index) => {
    // Generate deterministic progress matching screenshot patterns
    if (index % 4 === 1) return { text: "14/10", bg: "bg-amber-100 text-amber-800 font-bold border border-amber-200" };
    if (index % 4 === 3 || index % 4 === 0) return { text: "0/10", bg: "bg-rose-100 text-rose-800 font-bold border border-rose-200" };
    return { text: "10/10", bg: "bg-emerald-100 text-emerald-800 font-bold border border-emerald-200" };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 my-6">
      
      {/* Table Title and Controls Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Student Details - All Batches</h2>
          <p className="text-xs text-slate-500 mt-0.5">Live attendance and daily target progress tracking</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#6355d8] transition"
            />
          </div>

          {/* Department Filter */}
          <div className="relative">
            <select 
              value={selectedDept}
              onChange={(e) => { setSelectedDept(e.target.value); setCurrentPage(1); }}
              className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#6355d8] cursor-pointer appearance-none"
            >
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Batch Filter */}
          <div className="relative">
            <select 
              value={selectedBatch}
              onChange={(e) => { setSelectedBatch(e.target.value); setCurrentPage(1); }}
              className="pl-3 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#6355d8] cursor-pointer appearance-none"
            >
              {BATCHES.map(b => <option key={b} value={b}>{b === 'All Batches' ? 'All Batches' : `Batch ${b}`}</option>)}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/90 text-slate-700 font-bold border-b border-slate-100 uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Sl No</th>
              <th className="py-3.5 px-4">Student Name</th>
              <th className="py-3.5 px-4">Register Number</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Section</th>
              <th className="py-3.5 px-4">Batch</th>
              <th className="py-3.5 px-4 text-center">Today's Attendance ({formattedDate})</th>
              <th className="py-3.5 px-4 text-center">Average Attendance %</th>
              <th className="py-3.5 px-4 text-center">Today Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedStudents.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-8 text-slate-400 text-xs font-medium">
                  No students found matching current filters.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((s, idx) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + idx;
                const progressBadge = getProgressBadge(globalIndex);
                return (
                  <tr key={s.regNo + globalIndex} className="hover:bg-slate-50/70 transition">
                    <td className="py-4 px-4 font-semibold text-slate-500">{globalIndex + 1}</td>
                    <td className="py-4 px-4 font-bold text-slate-800 flex items-center gap-1.5">
                      {s.name}
                      {s.isStar && <span className="text-amber-400 text-sm">★</span>}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600">{s.regNo}</td>
                    <td className="py-4 px-4 font-medium text-slate-600">{s.dept}</td>
                    <td className="py-4 px-4 font-medium text-slate-600">{s.section}</td>
                    <td className="py-4 px-4 font-medium text-slate-600">{s.batch}</td>
                    <td className="py-4 px-4 text-center">
                      <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-md text-[11px] border border-emerald-100">
                        Nil
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700">100%</td>
                    <td className="py-4 px-4 text-center">
                      <span className={`px-3 py-1 rounded-md text-xs inline-block ${progressBadge.bg}`}>
                        {progressBadge.text}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between mt-4 text-xs text-slate-500 font-medium">
        <div>
          Showing {paginatedStudents.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredStudents.length)} of {filteredStudents.length} entries
        </div>

        <div className="flex items-center gap-1">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <span className="px-3 py-1 font-bold text-slate-700">
            Page {currentPage} of {totalPages}
          </span>

          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
