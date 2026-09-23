import React, { useState } from 'react';

export default function TillDateTargetChart({ data, onBarClick }) {
  const [hoveredIdx, setHoveredIdx] = useState(4); // Default hover on 43-56 Questions

  const yTicks = [192, 176, 160, 144, 128, 112, 96, 80, 64, 48, 32, 16, 0];
  const maxY = 192;

  const svgWidth = 650;
  const svgHeight = 280;
  const paddingLeft = 45;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 65;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const numItems = data.length;
  const barStep = chartWidth / numItems;
  const barWidth = Math.min(barStep * 0.5, 32);

  const points = data.map((item, index) => {
    const x = paddingLeft + index * barStep + barStep / 2;
    const yRatio = item.count / maxY;
    const y = paddingTop + chartHeight - yRatio * chartHeight;
    return { x, y, count: item.count, label: item.label };
  });

  const generateSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? i : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return path;
  };

  const curvePath = generateSmoothPath(points);

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between h-full relative">
      <div>
        <h2 className="text-base font-bold text-slate-900 tracking-tight">
          Number of students who solved the till date InClass target
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Cumulative progress analysis for the current batch
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center relative">
        <div className="text-center font-bold text-xs text-[#005F69] mb-2">Solved till date InClass target</div>

        <div className="w-full relative overflow-x-auto">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto min-w-[550px] overflow-visible">
            
            {/* Gridlines */}
            {yTicks.map((val) => {
              const yRatio = val / maxY;
              const y = paddingTop + chartHeight - yRatio * chartHeight;
              return (
                <g key={val}>
                  <line 
                    x1={paddingLeft} 
                    y1={y} 
                    x2={svgWidth - paddingRight} 
                    y2={y} 
                    stroke="#f1f5f9" 
                    strokeDasharray="3 3" 
                  />
                  <text 
                    x={paddingLeft - 8} 
                    y={y + 3.5} 
                    textAnchor="end" 
                    className="text-[9px] font-medium fill-slate-400"
                  >
                    {val}
                  </text>
                </g>
              );
            })}

            {/* Y-Axis Label */}
            <text 
              x={-(paddingTop + chartHeight / 2)} 
              y={12} 
              transform="rotate(-90)" 
              textAnchor="middle" 
              className="text-[10px] font-semibold fill-slate-500"
            >
              No of Students
            </text>

            {/* Bars */}
            {points.map((pt, idx) => {
              const barHeight = (pt.count / maxY) * chartHeight;
              const barY = paddingTop + chartHeight - barHeight;
              const isSelected = idx === hoveredIdx || pt.label === '43-56 Questions';

              return (
                <g 
                  key={idx} 
                  className="cursor-pointer group"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onClick={() => onBarClick({
                    title: `${pt.label} - Students Preview`,
                    rangeLabel: pt.label,
                    count: pt.count,
                    type: 'tillDate'
                  })}
                >
                  <rect
                    x={pt.x - barWidth / 2}
                    y={barY}
                    width={barWidth}
                    height={Math.max(barHeight, 2)}
                    rx={6}
                    ry={6}
                    fill={isSelected ? '#005F69' : '#b2d8d8'}
                    className="transition-colors duration-200 hover:fill-[#004b53]"
                  />
                  <text
                    x={pt.x}
                    y={svgHeight - paddingBottom + 16}
                    transform={`rotate(30, ${pt.x}, ${svgHeight - paddingBottom + 16})`}
                    textAnchor="start"
                    className="text-[9.5px] font-semibold fill-slate-600"
                  >
                    {pt.label}
                  </text>
                </g>
              );
            })}

            {/* Spline Red Line */}
            <path
              d={curvePath}
              fill="none"
              stroke="#ff3b30"
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Red Dots */}
            {points.map((pt, idx) => (
              <g key={`pt-${idx}`}>
                {pt.count > 0 && (
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    textAnchor="middle"
                    className="text-[11px] font-extrabold fill-slate-900"
                  >
                    {pt.count}
                  </text>
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={3.5}
                  className="fill-[#ff3b30] stroke-white stroke-2"
                />
              </g>
            ))}

            {/* Tooltip Overlay */}
            {hoveredIdx !== null && points[hoveredIdx] && (
              <g transform={`translate(${Math.min(points[hoveredIdx].x + 10, svgWidth - 140)}, ${Math.max(points[hoveredIdx].y - 30, 20)})`}>
                <rect 
                  x="0" 
                  y="0" 
                  width="120" 
                  height="45" 
                  rx="8" 
                  fill="#004b53" 
                  className="shadow-xl"
                />
                <text x="12" y="18" fill="#ffffff" className="text-[11px] font-bold">
                  {points[hoveredIdx].label}
                </text>
                <text x="12" y="34" fill="#e2f1f1" className="text-[11px] font-semibold">
                  {points[hoveredIdx].count} Students
                </text>
              </g>
            )}

            <line 
              x1={paddingLeft} 
              y1={paddingTop + chartHeight} 
              x2={svgWidth - paddingRight} 
              y2={paddingTop + chartHeight} 
              stroke="#e2e8f0" 
            />

          </svg>
        </div>

        <div className="text-center text-[11px] font-bold text-slate-600 mt-6">Target Achieved</div>
      </div>
    </div>
  );
}
