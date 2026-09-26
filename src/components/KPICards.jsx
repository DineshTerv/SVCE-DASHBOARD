import React from 'react';
import { Users, CheckCircle, Star, ShieldCheck, Wifi, WifiOff, Award } from 'lucide-react';

export default function KPICards({ 
  totalStudents, 
  totalBatches, 
  todayCompleted, 
  tillDateCompleted,
  presentToday,
  attendancePercent,
  liveDataLoaded,
  marksQualifiedCount,
  marksTotal,
}) {
  const hasMarks = marksTotal > 0;

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 ${hasMarks ? 'lg:grid-cols-5' : 'lg:grid-cols-4'} gap-5 my-6`}>
      
      {/* Card 1: Total No of Students */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#005F69] to-[#008A99] text-white flex items-center justify-center shrink-0 shadow-inner">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">{totalStudents}</div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Total No of students</div>
          {/* Live data indicator */}
          <div className={`flex items-center gap-1 mt-1 text-[10px] font-bold ${liveDataLoaded ? 'text-emerald-600' : 'text-slate-400'}`}>
            {liveDataLoaded ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {liveDataLoaded ? 'LIVE FROM SHEETS' : 'USING SAMPLE DATA'}
          </div>
        </div>
      </div>

      {/* Card 2: Today's Attendance (live from sheet) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#34d399] to-[#10b981] text-white flex items-center justify-center shrink-0 shadow-inner">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
            {presentToday ?? totalBatches}
            <span className="text-lg text-slate-400 font-semibold">/{totalStudents}</span>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">
            {presentToday !== undefined ? "Today's Attendance (Live)" : "Total No of Batches"}
          </div>
          {presentToday !== undefined && (
            <div className="text-[10px] font-bold text-emerald-600 mt-1 uppercase tracking-wide">{attendancePercent}% present</div>
          )}
        </div>
      </div>

      {/* Card 3: Completed Today's Target */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#f43f5e] text-white flex items-center justify-center shrink-0 shadow-inner">
          <Star className="w-6 h-6 fill-white" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
            {todayCompleted}<span className="text-lg text-slate-400 font-semibold">/{totalStudents}</span>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Students completed Today's Target</div>
        </div>
      </div>

      {/* Card 4: Completed Till Date Target */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00bcd4] to-[#06b6d4] text-white flex items-center justify-center shrink-0 shadow-inner">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
            {tillDateCompleted}<span className="text-lg text-slate-400 font-semibold">/{totalStudents}</span>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Students completed Till Date Target</div>
        </div>
      </div>

      {/* Card 5: Assessment Marks – Qualified (only shown when marks data exists) */}
      {hasMarks && (
        <div className="bg-white rounded-2xl p-5 border border-violet-100 shadow-sm flex items-center gap-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#a855f7] text-white flex items-center justify-center shrink-0 shadow-inner">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {marksQualifiedCount}
              <span className="text-lg text-slate-400 font-semibold">/{marksTotal}</span>
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Assessment Qualified</div>
            <div className="text-[10px] font-bold text-violet-600 mt-1 uppercase tracking-wide">
              {marksTotal > 0 ? Math.round((marksQualifiedCount / marksTotal) * 100) : 0}% pass rate
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
