import React, { useState, useMemo } from "react";
import { generateAsciiBar } from "../data";

export default function StudentTable({ data }) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "cumulativeProgress", direction: "desc" });

  const handleSort = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFiltered = useMemo(() => {
    let filtered = data;
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(q) || 
        s.registerNumber.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, search, sortConfig]);

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return null;
    return <span className="ml-1">{sortConfig.direction === "asc" ? "^" : "v"}</span>;
  };

  return (
    <div className="border border-[#39FF14] bg-[#0A0A0A] flex flex-col">
      {/* Search Header */}
      <div className="border-b border-[#39FF14] p-4 flex items-center gap-2 text-sm">
        <span className="opacity-80">&gt; search:</span>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent border-none outline-none text-[#39FF14] flex-1 font-mono uppercase"
          autoComplete="off"
          spellCheck="false"
        />
        {search.length === 0 && <span className="animate-blink inline-block w-2.5 h-4 bg-[#39FF14] -ml-2 text-glow-none" />}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead className="bg-[#39FF14] text-[#0A0A0A] uppercase font-bold">
            <tr>
              <th className="py-2 px-4 cursor-pointer hover:bg-[#20b209] transition-colors" onClick={() => handleSort("name")}>
                Name <SortIcon columnKey="name" />
              </th>
              <th className="py-2 px-4 cursor-pointer hover:bg-[#20b209] transition-colors" onClick={() => handleSort("registerNumber")}>
                Reg No <SortIcon columnKey="registerNumber" />
              </th>
              <th className="py-2 px-4 cursor-pointer hover:bg-[#20b209] transition-colors" onClick={() => handleSort("department")}>
                Dept <SortIcon columnKey="department" />
              </th>
              <th className="py-2 px-4 cursor-pointer hover:bg-[#20b209] transition-colors" onClick={() => handleSort("avgAttendance")}>
                Avg % <SortIcon columnKey="avgAttendance" />
              </th>
              <th className="py-2 px-4 cursor-pointer hover:bg-[#20b209] transition-colors" onClick={() => handleSort("todayCount")}>
                Today <SortIcon columnKey="todayCount" />
              </th>
              <th className="py-2 px-4 cursor-pointer hover:bg-[#20b209] transition-colors text-right" onClick={() => handleSort("cumulativeProgress")}>
                Till Date <SortIcon columnKey="cumulativeProgress" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#152e15]">
            {sortedAndFiltered.map((s, i) => (
              <tr key={s.registerNumber} className={i % 2 === 0 ? "bg-[#0A0A0A]" : "bg-[#0F1A0F]"}>
                <td className="py-3 px-4 uppercase font-bold text-glow">{s.name}</td>
                <td className="py-3 px-4 opacity-80">{s.registerNumber}</td>
                <td className="py-3 px-4 opacity-80">{s.department}-{s.section}</td>
                <td className="py-3 px-4">
                  <span className={s.avgAttendance < 75 ? "text-[#FFB000]" : ""}>
                    {s.avgAttendance}%
                  </span>
                </td>
                <td className="py-3 px-4 tracking-widest">
                  [{generateAsciiBar(s.todayCount, 10)}] {s.todayCount}/10
                </td>
                <td className="py-3 px-4 text-right tracking-wider font-bold">
                  {s.cumulativeProgress}
                </td>
              </tr>
            ))}
            {sortedAndFiltered.length === 0 && (
              <tr>
                <td colSpan="6" className="py-8 text-center opacity-70 uppercase">
                  &gt; ERR_NO_RECORDS_FOUND
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
