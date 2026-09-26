import React from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

const GLASS = {
  background: "rgba(255,255,255,0.60)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.80)",
  boxShadow: "0 8px 32px 0 rgba(56,189,248,0.10)",
};

function CustomTooltip({ active, payload, label, gradFrom }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-2xl px-4 py-2.5 text-xs font-bold shadow-xl"
      style={{ background: "rgba(15,23,42,0.85)", backdropFilter: "blur(12px)", color: "#f1f5f9", border: "1px solid rgba(255,255,255,0.1)" }}>
      <p className="text-slate-400 mb-0.5">{label} questions</p>
      <p style={{ color: gradFrom }}>{payload[0].value} students</p>
    </div>
  );
}

export default function BarChartCard({
  data,
  title,
  subtitle,
  gradFrom,
  gradTo,
  delayIndex = 0,
}) {
  const gradId = `bar-${gradFrom.replace("#","")}-${gradTo.replace("#","")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 + delayIndex * 0.08 }}
      className="rounded-3xl p-6 flex flex-col gap-4 hover:-translate-y-1 transition-all duration-300 group"
      style={{
        ...GLASS,
        "--glow-color": gradFrom,
      }}
    >
      <div>
        <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="25%" margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradFrom} stopOpacity={0.95} />
                <stop offset="100%" stopColor={gradTo} stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="rgba(148,163,184,0.1)" vertical={false} />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 600 }}
              axisLine={false} tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 9, fill: "#94a3b8", fontWeight: 600 }}
              axisLine={false} tickLine={false}
            />

            <Tooltip content={<CustomTooltip gradFrom={gradFrom} />} cursor={false} />

            <Bar dataKey="count" fill={`url(#${gradId})`} radius={[8, 8, 0, 0]}>
              {data.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={`url(#${gradId})`}
                  style={{ filter: `drop-shadow(0 0 4px ${gradFrom}60)`, cursor: "pointer" }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
