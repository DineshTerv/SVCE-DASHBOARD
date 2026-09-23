import React from 'react';
import { Plus, Check, Star, ShieldCheck } from 'lucide-react';

export default function KPICards({ 
  totalStudents, 
  totalBatches, 
  todayCompleted, 
  tillDateCompleted 
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 my-6">
      
      {/* Card 1: Total No of Students in Peacock Blue #005F69 */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 transition hover:shadow-md">
        <div className="w-12 h-12 rounded-xl bg-[#005F69] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Plus className="w-6 h-6 stroke-[3]" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">{totalStudents}</div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Total No of students</div>
        </div>
      </div>

      {/* Card 2: Total No of Batches */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 transition hover:shadow-md">
        <div className="w-12 h-12 rounded-xl bg-[#34d399] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Check className="w-6 h-6 stroke-[3]" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">{totalBatches}</div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Total No of Batches</div>
        </div>
      </div>

      {/* Card 3: Completed Today's Target */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 transition hover:shadow-md">
        <div className="w-12 h-12 rounded-xl bg-[#ff6b6b] text-white flex items-center justify-center shrink-0 shadow-xs">
          <Star className="w-6 h-6 fill-white" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
            {todayCompleted}<span className="text-lg text-slate-400 font-semibold">/{totalStudents}</span>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">No of students completed Today's Target</div>
        </div>
      </div>

      {/* Card 4: Completed Till Date Target */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 transition hover:shadow-md">
        <div className="w-12 h-12 rounded-xl bg-[#00bcd4] text-white flex items-center justify-center shrink-0 shadow-xs">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
            {tillDateCompleted}<span className="text-lg text-slate-400 font-semibold">/{totalStudents}</span>
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">No of students completed Till Date Target</div>
        </div>
      </div>

    </div>
  );
}
