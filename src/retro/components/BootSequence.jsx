import React, { useState, useEffect } from "react";

const BOOT_LINES = [
  "INIT KERNEL...",
  "MOUNTING VFS... [OK]",
  "LOADING MODULES: RECHARTS, FRAMER-MOTION... [OK]",
  "ESTABLISHING SECURE CONNECTION TO SVCE MAINFRAME...",
  "AUTHENTICATION: SUCCESS (OIF-TI27167)",
  "FETCHING STUDENT RECORDS...",
  "DECRYPTING PAYLOAD...",
  "SYSTEM READY."
];

export default function BootSequence({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    let currentLine = 0;
    let currentChar = 0;
    let textStr = "";
    
    const typeNextChar = () => {
      if (currentLine >= BOOT_LINES.length) {
        setTimeout(() => {
          setFading(true);
          setTimeout(onComplete, 500); // Wait for fade out
        }, 800);
        return;
      }

      const fullLine = BOOT_LINES[currentLine];
      textStr += fullLine[currentChar];
      
      const linesCopy = [...BOOT_LINES.slice(0, currentLine), textStr];
      setLines(linesCopy);

      currentChar++;
      if (currentChar >= fullLine.length) {
        currentLine++;
        currentChar = 0;
        textStr = "";
        setTimeout(typeNextChar, 150); // Pause between lines
      } else {
        setTimeout(typeNextChar, 25); // Pause between chars
      }
    };

    const t = setTimeout(typeNextChar, 200);
    return () => clearTimeout(t);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 bg-[#0A0A0A] text-[#39FF14] z-[999] p-8 font-mono text-sm uppercase leading-relaxed transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}>
      {lines.map((l, i) => (
        <div key={i} className="text-glow">{l}</div>
      ))}
      <div className="animate-blink inline-block w-2.5 h-4 bg-[#39FF14] mt-1 text-glow-none" />
    </div>
  );
}
