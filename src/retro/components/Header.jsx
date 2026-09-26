import React, { useState } from "react";

export default function Header({ date, onSync, syncing }) {
  const [syncText, setSyncText] = useState("[ SYNC_DATA ]");

  const handleSyncClick = () => {
    if (syncing) return;
    setSyncText("");
    const msg = "> fetching student records... done. 441 records loaded.";
    let i = 0;
    
    // Trigger parent sync
    onSync();

    const typeWriter = setInterval(() => {
      setSyncText(msg.slice(0, i + 1));
      i++;
      if (i >= msg.length) {
        clearInterval(typeWriter);
        setTimeout(() => setSyncText("[ SYNC_DATA ]"), 3000);
      }
    }, 30);
  };

  return (
    <header className="border-y-2 border-[#39FF14] py-4 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 shadow-[0_0_8px_rgba(57,255,20,0.2)]">
      
      {/* Left side */}
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-widest text-glow flex items-center">
          &gt; CodeTrack_ <span className="animate-blink inline-block w-4 h-6 bg-[#39FF14] ml-2 text-glow-none" />
        </h1>
        <p className="text-xs mt-1 text-[#39FF14] opacity-70">
          SESSION: SV_COLLEGE_ENGINEERING // OIF-TI27167
        </p>
      </div>

      {/* Right side */}
      <div className="flex flex-col items-end gap-2 text-sm font-bold">
        <div className="border border-[#39FF14] px-3 py-1">
          [ DATE: {date} ]
        </div>
        <button 
          onClick={handleSyncClick}
          disabled={syncing}
          className="border border-[#39FF14] px-3 py-1 hover:bg-[#39FF14] hover:text-[#0A0A0A] transition-colors cursor-pointer min-w-[140px] text-left"
        >
          {syncText}
        </button>
      </div>
      
    </header>
  );
}
