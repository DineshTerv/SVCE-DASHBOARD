import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, ChevronDown, ChevronUp } from "lucide-react";
import Avatar from "./Avatar";

const GLASS = {
  background: "rgba(255,255,255,0.60)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.80)",
  boxShadow: "0 8px 32px 0 rgba(56,189,248,0.10)",
};

export default function StudentTable({ students, delayIndex = 0 }) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "tillDateQ", direction: "desc" });

  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFiltered = useMemo(() => {
    let filtered = students;
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(lowerSearch) || 
        s.regNo.toLowerCase().includes(lowerSearch)
      );
    }

    return filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [students, search, sortConfig]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <ChevronDown className="w-3 h-3 opacity-20" />;
    return sortConfig.direction === "asc" ? <ChevronUp className="w-3 h-3 text-sky-500" /> : <ChevronDown className="w-3 h-3 text-sky-500" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 + delayIndex * 0.08 }}
      className="col-span-full rounded-3xl p-6 flex flex-col gap-6"
      style={GLASS}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Student Progress</h2>
          <p className="text-xs text-slate-500 mt-0.5">Live tracking for all 441 students</p>
        </div>

        {/* Floating Glass Search Bar */}
        <div 
          className="flex items-center gap-2 px-4 py-2 rounded-full w-full sm:w-72 transition-all duration-300 focus-within:shadow-md focus-within:shadow-sky-200/50"
          style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,255,255,0.9)", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)" }}
        >
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name or reg no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-xs font-medium text-slate-700 w-full placeholder:text-slate-400"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="border-b border-slate-200/60 text-slate-400">
              <th className="pb-3 px-2 font-bold cursor-pointer hover:text-slate-700 transition" onClick={() => handleSort("name")}>
                <div className="flex items-center gap-1">Student <SortIcon columnKey="name" /></div>
              </th>
              <th className="pb-3 px-2 font-bold cursor-pointer hover:text-slate-700 transition" onClick={() => handleSort("regNo")}>
                <div className="flex items-center gap-1">Reg No <SortIcon columnKey="regNo" /></div>
              </th>
              <th className="pb-3 px-2 font-bold cursor-pointer hover:text-slate-700 transition" onClick={() => handleSort("dept")}>
                <div className="flex items-center gap-1">Dept <SortIcon columnKey="dept" /></div>
              </th>
              <th className="pb-3 px-2 font-bold cursor-pointer hover:text-slate-700 transition" onClick={() => handleSort("attendance")}>
                <div className="flex items-center gap-1">Attendance <SortIcon columnKey="attendance" /></div>
              </th>
              <th className="pb-3 px-2 font-bold cursor-pointer hover:text-slate-700 transition" onClick={() => handleSort("todayQ")}>
                <div className="flex items-center gap-1">Today's Progress <SortIcon columnKey="todayQ" /></div>
              </th>
              <th className="pb-3 px-2 font-bold cursor-pointer hover:text-slate-700 transition text-right" onClick={() => handleSort("tillDateQ")}>
                <div className="flex items-center justify-end gap-1">Till Date <SortIcon columnKey="tillDateQ" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/50">
            {sortedAndFiltered.map((s) => (
              <tr key={s.id} className="hover:bg-white/40 transition group">
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <Avatar name={s.name} size={28} />
                    <span className="font-bold text-slate-700 group-hover:text-sky-600 transition">{s.name}</span>
                  </div>
                </td>
                <td className="py-3 px-2 font-medium text-slate-500">{s.regNo}</td>
                <td className="py-3 px-2 font-medium text-slate-500">{s.dept}</td>
                <td className="py-3 px-2">
                  <span className={`px-2 py-1 rounded-md font-bold text-[10px] ${
                    s.attendance >= 85 ? "bg-emerald-100/50 text-emerald-600" :
                    s.attendance >= 70 ? "bg-amber-100/50 text-amber-600" :
                    "bg-rose-100/50 text-rose-600"
                  }`}>
                    {s.attendance}%
                  </span>
                </td>
                <td className="py-3 px-2 w-48">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                      <div 
                        className="absolute top-0 left-0 h-full rounded-full transition-all duration-700 ease-out"
                        style={{ 
                          width: `${Math.min((s.todayQ / 10) * 100, 100)}%`,
                          background: "linear-gradient(90deg, #38bdf8, #818cf8)" 
                        }}
                      />
                    </div>
                    <span className="text-[10px] font-bold w-6 text-slate-600">{s.todayQ}/10</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="font-black text-slate-700 bg-slate-100/50 px-2.5 py-1 rounded-lg">
                    {s.tillDateQ}
                  </span>
                </td>
              </tr>
            ))}
            {sortedAndFiltered.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                  No students found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
