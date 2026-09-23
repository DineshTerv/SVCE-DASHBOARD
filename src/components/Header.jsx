import React, { useState } from 'react';
import { Calendar, Share2, Download, Camera, Database, Check } from 'lucide-react';

export default function Header({ 
  selectedDate, 
  setSelectedDate, 
  onExportReport, 
  onTakeSnapshot, 
  onOpenSyncModal 
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Section: Logo, Title, Badges */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Red Flag Logo Icon */}
          <div className="w-10 h-10 bg-[#ef4444] rounded-lg flex items-center justify-center text-white font-black text-xl shadow-xs">
            <span className="font-serif italic">R</span>
          </div>

          {/* Company/College Name Pill in Peacock Blue #005F69 */}
          <div className="bg-[#005F69] text-white px-4 py-1.5 rounded-2xl font-bold text-lg shadow-xs tracking-wide">
            R-Sequences
          </div>

          {/* OIF Code */}
          <div className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
            OIF: <span className="text-slate-800 font-bold">TI27167</span>
          </div>

          {/* Date Selector Pill */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-full px-3 py-1 text-xs font-semibold text-slate-700 transition">
            <Calendar className="w-3.5 h-3.5 text-[#005F69] mr-2" />
            <span className="text-slate-400 uppercase mr-1 text-[10px]">DATE</span>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-800 font-bold outline-none cursor-pointer text-xs"
            />
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          
          {/* Google Form / Live Sync Modal Toggle */}
          <button 
            onClick={onOpenSyncModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#005F69] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition shadow-2xs cursor-pointer"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Google Form Live Sync</span>
            <span className="w-2 h-2 rounded-full bg-[#005F69] animate-pulse"></span>
          </button>

          {/* Share Button */}
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition shadow-2xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#005F69]" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          {/* Export Report Button in Peacock Blue #005F69 */}
          <button 
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#005F69] hover:bg-[#004b53] rounded-lg transition shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

          {/* Snapshot Button */}
          <button 
            onClick={onTakeSnapshot}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition shadow-2xs cursor-pointer"
          >
            <Camera className="w-3.5 h-3.5 text-slate-500" />
            <span>Snapshot</span>
          </button>

        </div>

      </div>
    </header>
  );
}
