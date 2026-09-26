import React, { useState } from 'react';
import { Calendar, Share2, Download, Camera, Database, Check } from 'lucide-react';
import SVCollegesLogo from './SVCollegesLogo';
import RSequenceLogo from './RSequenceLogo';

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
    <header className="bg-white/85 backdrop-blur-xl border-b border-slate-200/70 px-6 py-3.5 sticky top-0 z-50 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Section: SV Colleges Logo, Title & Badges */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          
          {/* SV Colleges Official Emblem */}
          <div className="flex items-center gap-2.5">
            <SVCollegesLogo className="h-12 w-12 hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-extrabold text-slate-900 tracking-tight text-base leading-tight">
                SV COLLEGES
              </span>
              <span className="text-[11px] font-semibold text-[#005F69] tracking-wider uppercase">
                Live Analytics Dashboard
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block h-7 w-px bg-slate-200 mx-0.5"></div>

          {/* Partner / Powered by R-Sequence Logo */}
          <div className="hidden lg:flex items-center hover:opacity-90 transition-opacity">
            <RSequenceLogo className="h-7 w-auto" />
          </div>

          {/* OIF Code */}
          <div className="text-xs font-semibold text-slate-500 bg-slate-100/90 backdrop-blur-sm px-2.5 py-1 rounded-md border border-slate-200/80">
            OIF: <span className="text-slate-800 font-bold">TI27167</span>
          </div>

          {/* Live Glowing Dot */}
          <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded border border-emerald-100 uppercase tracking-wider cursor-default shadow-xs" title="Live Google Sheets Connected">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Data
          </div>

          {/* Date Selector Pill */}
          <div className="relative flex items-center bg-slate-50/90 backdrop-blur-sm border border-slate-200 hover:border-slate-300 hover:shadow-xs rounded-full px-3 py-1 text-xs font-semibold text-slate-700 transition-all ml-1">
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
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#005F69] bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition hover:shadow-xs cursor-pointer hover:-translate-y-0.5"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Manage Sync</span>
          </button>

          {/* Share Button */}
          <button 
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition hover:shadow-xs cursor-pointer hover:-translate-y-0.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#005F69]" /> : <Share2 className="w-3.5 h-3.5 text-slate-500" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>

          {/* Export Report Button */}
          <button 
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#005F69] to-[#007A88] hover:from-[#004b53] hover:to-[#00606b] rounded-lg transition shadow-xs hover:shadow-md cursor-pointer hover:-translate-y-0.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>

          {/* Snapshot Button */}
          <button 
            onClick={onTakeSnapshot}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition hover:shadow-xs cursor-pointer hover:-translate-y-0.5"
          >
            <Camera className="w-3.5 h-3.5 text-slate-500" />
            <span>Snapshot</span>
          </button>

        </div>

      </div>
    </header>
  );
}
