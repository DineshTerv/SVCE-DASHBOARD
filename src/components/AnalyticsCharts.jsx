import React from 'react';
import TodayTargetChart from './TodayTargetChart';
import TillDateTargetChart from './TillDateTargetChart';

export default function AnalyticsCharts({ 
  formattedDate, 
  todayData, 
  tillDateData, 
  onBarClick 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-6">
      {/* Today Target Chart */}
      <TodayTargetChart 
        data={todayData} 
        formattedDate={formattedDate} 
        onBarClick={onBarClick} 
      />

      {/* Till Date InClass Target Chart */}
      <TillDateTargetChart 
        data={tillDateData} 
        onBarClick={onBarClick} 
      />
    </div>
  );
}
