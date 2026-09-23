import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import KPICards from './components/KPICards';
import AnalyticsCharts from './components/AnalyticsCharts';
import StudentPreviewModal from './components/StudentPreviewModal';
import StudentTable from './components/StudentTable';
import GoogleFormSyncModal from './components/GoogleFormSyncModal';
import FloatingWidgets from './components/FloatingWidgets';
import { COLLEGE_INFO, generateAllStudents, DATE_ANALYTICS_MAP } from './data/mockData';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(COLLEGE_INFO.defaultDate);
  const [students, setStudents] = useState(generateAllStudents());
  const [analyticsDataMap, setAnalyticsDataMap] = useState(DATE_ANALYTICS_MAP);
  
  // Drill-down Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);

  // Google Form Live Sync Modal State
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // Compute analytics data for selected date
  const currentAnalytics = useMemo(() => {
    if (analyticsDataMap[selectedDate]) {
      return analyticsDataMap[selectedDate];
    }
    return {
      todayTargetCompleted: 200,
      tillDateTargetCompleted: 230,
      todayTargetDistribution: [
        { label: "0 questions", count: 90 },
        { label: "1 Question", count: 2 },
        { label: "2 Questions", count: 1 },
        { label: "3 Questions", count: 3 },
        { label: "4 Questions", count: 5 },
        { label: "5 Questions", count: 7 },
        { label: "6 Questions", count: 5 },
        { label: "7 Questions", count: 3 },
        { label: "8 Questions", count: 15 },
        { label: "9 Questions", count: 75 },
        { label: "10 Questions", count: 215 },
        { label: "11 Questions", count: 10 },
        { label: "12 Questions", count: 5 },
        { label: "13 Questions", count: 2 },
        { label: "14 Questions", count: 1 },
        { label: "15 Questions", count: 2 },
      ],
      tillDateDistribution: [
        { label: "0 questions", count: 85 },
        { label: "1-14 Questions", count: 10 },
        { label: "15-28 Questions", count: 35 },
        { label: "29-42 Questions", count: 110 },
        { label: "43-56 Questions", count: 150 },
        { label: "57-70 Questions", count: 40 },
        { label: "71-84 Questions", count: 8 },
        { label: "85-98 Questions", count: 2 },
        { label: "99-112 Questions", count: 1 },
      ],
    };
  }, [selectedDate, analyticsDataMap]);

  // Format date display (e.g. 22 Sept 2026)
  const formattedDate = useMemo(() => {
    const d = new Date(selectedDate);
    if (isNaN(d)) return "22 Sept 2026";
    const day = d.getDate();
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }, [selectedDate]);

  // Open bar chart detail modal
  const handleBarClick = (info) => {
    setModalInfo(info);
    setIsModalOpen(true);
  };

  // Export full report CSV
  const handleExportReport = () => {
    const reportData = students.map(s => ({
      "Sl No": s.slNo,
      "Student Name": s.name,
      "Register Number": s.regNo,
      "Department": s.dept,
      "Section": s.section,
      "Batch": s.batch,
      "Date": selectedDate,
      "Attendance": "100%",
      "Target Progress": "10/10"
    }));

    const csv = Papa.unparse(reportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SVCE_Analytics_Report_${selectedDate}.csv`;
    a.click();
  };

  // Snapshot functionality using html2canvas
  const handleTakeSnapshot = () => {
    const dashboardElement = document.getElementById('dashboard-root');
    if (!dashboardElement) return;

    html2canvas(dashboardElement, { scale: 2 }).then(canvas => {
      const image = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = image;
      a.download = `SVCE_Dashboard_Snapshot_${selectedDate}.png`;
      a.click();
    });
  };

  // Live Form Submission Handler
  const handleLiveSubmission = ({ date, student, todayQuestions, tillDateQuestions }) => {
    setStudents(prev => [student, ...prev]);

    setAnalyticsDataMap(prevMap => {
      const current = prevMap[date] || currentAnalytics;
      
      const newTodayCompleted = todayQuestions >= 10 ? current.todayTargetCompleted + 1 : current.todayTargetCompleted;
      const newTillCompleted = tillDateQuestions >= 40 ? current.tillDateTargetCompleted + 1 : current.tillDateTargetCompleted;

      const updatedTodayDist = current.todayTargetDistribution.map(item => {
        if (todayQuestions === 10 && item.label === "10 Questions") return { ...item, count: item.count + 1 };
        if (todayQuestions === 0 && item.label === "0 questions") return { ...item, count: item.count + 1 };
        return item;
      });

      const updatedTillDist = current.tillDateDistribution.map(item => {
        if (tillDateQuestions >= 43 && tillDateQuestions <= 56 && item.label === "43-56 Questions") {
          return { ...item, count: item.count + 1 };
        }
        return item;
      });

      return {
        ...prevMap,
        [date]: {
          ...current,
          todayTargetCompleted: newTodayCompleted,
          tillDateTargetCompleted: newTillCompleted,
          todayTargetDistribution: updatedTodayDist,
          tillDateDistribution: updatedTillDist
        }
      };
    });

    if (date !== selectedDate) {
      setSelectedDate(date);
    }
  };

  return (
    <div id="dashboard-root" className="min-h-screen bg-[#f3f4f8] pb-12">
      
      {/* Header Navigation */}
      <Header 
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onExportReport={handleExportReport}
        onTakeSnapshot={handleTakeSnapshot}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
      />

      {/* Dashboard Body */}
      <main className="max-w-7xl mx-auto px-6 py-4">
        
        {/* KPI Stat Cards */}
        <KPICards 
          totalStudents={students.length}
          totalBatches={8}
          todayCompleted={currentAnalytics.todayTargetCompleted}
          tillDateCompleted={currentAnalytics.tillDateTargetCompleted}
        />

        {/* Dual Combination SVG Charts */}
        <AnalyticsCharts 
          formattedDate={formattedDate}
          todayData={currentAnalytics.todayTargetDistribution}
          tillDateData={currentAnalytics.tillDateDistribution}
          onBarClick={handleBarClick}
        />

        {/* Full Student Details Table */}
        <StudentTable 
          students={students}
          formattedDate={formattedDate}
        />

      </main>

      {/* Floating Need Help & Bot Buttons */}
      <FloatingWidgets onOpenHelp={() => setIsSyncModalOpen(true)} />

      {/* Student Details Preview Modal */}
      <StudentPreviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalInfo={modalInfo}
        studentList={students}
      />

      {/* Google Form Live Sync Modal */}
      <GoogleFormSyncModal 
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onAddLiveSubmission={handleLiveSubmission}
        onConnectSheetUrl={() => {
          alert("Connected Google Sheet! Live sync activated.");
        }}
      />

    </div>
  );
}
