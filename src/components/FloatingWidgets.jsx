import React from 'react';
import { Bot } from 'lucide-react';

export default function FloatingWidgets({ onOpenHelp }) {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Need Help? Pill Button */}
      <button 
        onClick={onOpenHelp}
        className="flex items-center gap-2 bg-white text-[#005F69] border border-teal-200 hover:border-[#005F69] font-bold text-xs px-4 py-2.5 rounded-full shadow-lg transition hover:scale-105 cursor-pointer"
      >
        <span>Need Help?</span>
      </button>

      {/* Bot Icon Button in Peacock Blue #005F69 */}
      <button 
        onClick={onOpenHelp}
        className="w-12 h-12 rounded-full bg-[#005F69] hover:bg-[#004b53] text-white flex items-center justify-center shadow-lg transition hover:scale-105 cursor-pointer"
      >
        <Bot className="w-6 h-6" />
      </button>
    </div>
  );
}
