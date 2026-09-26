import React from "react";
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const CustomTooltip = ({ active, payload, label, color }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`border p-2 bg-[#0A0A0A]`} style={{ borderColor: color, color: color }}>
      <p className="text-xs">{label}: {payload[0].value} students</p>
    </div>
  );
};

export default function TerminalChart({ header, data, isAmber = false }) {
  const color = isAmber ? "#FFB000" : "#39FF14";

  return (
    <div className="border border-[#39FF14] flex flex-col h-64 bg-[#0A0A0A]">
      {/* Panel Header */}
      <div className="bg-[#39FF14] text-[#0A0A0A] font-bold text-xs px-3 py-1 uppercase">
        {header}
      </div>

      <div className="flex-1 p-4 pb-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid stroke={color} strokeDasharray="2 2" opacity={0.3} vertical={false} />
            <XAxis 
              dataKey="label" 
              stroke={color} 
              tick={{ fill: color, fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}
              axisLine={{ stroke: color }}
              tickLine={{ stroke: color }}
            />
            <Tooltip content={<CustomTooltip color={color} />} cursor={{ fill: 'rgba(57,255,20,0.1)' }} />
            <Bar dataKey="count" fill={color} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
