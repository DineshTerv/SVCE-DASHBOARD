import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import KPICards from './components/KPICards';
import AnalyticsCharts from './components/AnalyticsCharts';
import StudentPreviewModal from './components/StudentPreviewModal';
import StudentTable from './components/StudentTable';
import GoogleFormSyncModal from './components/GoogleFormSyncModal';
import FloatingWidgets from './components/FloatingWidgets';
import useGoogleSheets from './hooks/useGoogleSheets';
import useMarksSheet from './hooks/useMarksSheet';
import { COLLEGE_INFO } from './data/mockData';
import { formatDisplayDate, normaliseDateKey } from './data/sheetsIntegration';
import { getMarksByDate } from './data/marksIntegration';
import html2canvas from 'html2canvas';
import Papa from 'papaparse';

export default function App() {
  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDate());

  // ── Drill-down Modal ─────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInfo, setModalInfo]     = useState(null);

  // ── Google Form Sync Modal ───────────────────────────────────────────────────
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  // ── Live Google Sheets – Attendance Data ────────────────────────────────────
  const {
    sheetStudents,
    sheetDates,
    attendanceStats,
    loading: sheetsLoading,
    lastSynced,
    error: sheetsError,
    refetch,
  } = useGoogleSheets(selectedDate);

  // ── Live Marks / Assessment Data from Google Sheet ───────────────────────────
  const {
    marksMap,
    marksSummary,
    branchBreakdown,
    scoreDistribution,
    loading: marksLoading,
    error: marksError,
    refetch: refetchMarks,
  } = useMarksSheet();

  // marksForDate: regNo → markEntry  (for the selected date / full map for new sheet)
  const dateKey = useMemo(() => normaliseDateKey(selectedDate), [selectedDate]);
  const marksForDate = useMemo(() => getMarksByDate(marksMap, dateKey), [marksMap, dateKey]);

  // Qualified count shown in KPI
  const marksQualifiedCount = marksSummary.qualified;

  // Use live students if available, else empty
  const students = sheetStudents.length > 0 ? sheetStudents : [];
  const liveDataLoaded = sheetStudents.length > 0;

  // ── Analytics dynamically derived from live students + live marks ─────────────
  const currentAnalytics = useMemo(() => {
    const todayRanges = [
      { label: '0 Marks',    min: 0,  max: 0   },
      { label: '1-5 Marks',  min: 1,  max: 5   },
      { label: '6-10 Marks', min: 6,  max: 10  },
      { label: '11-15 Marks',min: 11, max: 15  },
      { label: '16-20 Marks',min: 16, max: 20  },
      { label: '21-25 Marks',min: 21, max: 25  },
      { label: '26-30 Marks',min: 26, max: 30  },
      { label: '> 30 Marks', min: 31, max: 999 },
    ];
    const todayDist = todayRanges.map(r => ({ label: r.label, count: 0 }));

    const tillDateRanges = [
      { label: '0 Marks',     min: 0,   max: 0   },
      { label: '1-20 Marks',  min: 1,   max: 20  },
      { label: '21-40 Marks', min: 21,  max: 40  },
      { label: '41-60 Marks', min: 41,  max: 60  },
      { label: '61-80 Marks', min: 61,  max: 80  },
      { label: '81-100 Marks',min: 81,  max: 100 },
      { label: '101-120 Marks',min: 101,max: 120 },
      { label: '> 120 Marks', min: 121, max: 999 },
    ];
    const tillDateDist = tillDateRanges.map(r => ({ label: r.label, count: 0 }));

    if (!marksMap || marksMap.size === 0) {
      // If no attendance data but marks are available, use marks data directly
      if (scoreDistribution && scoreDistribution.length > 0) {
        return {
          todayTargetCompleted: marksSummary.qualified,
          tillDateTargetCompleted: marksSummary.qualified,
          todayTargetDistribution: scoreDistribution.map(d => ({ label: d.label, count: d.count })),
          tillDateDistribution: tillDateDist,
        };
      }
      return {
        todayTargetCompleted: 0,
        tillDateTargetCompleted: 0,
        todayTargetDistribution: todayDist,
        tillDateDistribution: tillDateDist,
      };
    }

    let todayCompleted = 0;
    let tillDateCompleted = 0;

    // If attendance students are loaded, cross-reference; otherwise iterate marks directly
    const iterList = students.length > 0 ? students : [];

    if (iterList.length > 0) {
      iterList.forEach(s => {
        const marks = marksForDate?.get(s.regNo);
        const tq = marks?.total || 0;
        if (marks?.qualified) todayCompleted++;

        // till-date: use all marks entries (for new sheet it's the same as today)
        const allMark = marksMap?.get(s.regNo);
        const tdq = allMark ? (allMark.total || 0) : 0;
        if (allMark?.qualified) tillDateCompleted++;

        const tqIdx = todayRanges.findIndex(r => tq >= r.min && tq <= r.max);
        if (tqIdx !== -1) todayDist[tqIdx].count++;

        const tdIdx = tillDateRanges.findIndex(r => tdq >= r.min && tdq <= r.max);
        if (tdIdx !== -1) tillDateDist[tdIdx].count++;
      });
    } else {
      // No attendance sheet — use marks data directly for charts
      todayCompleted = marksSummary.qualified;
      tillDateCompleted = marksSummary.qualified;
      for (const entry of marksMap.values()) {
        const tqIdx = todayRanges.findIndex(r => entry.total >= r.min && entry.total <= r.max);
        if (tqIdx !== -1) todayDist[tqIdx].count++;

        const tdIdx = tillDateRanges.findIndex(r => entry.total >= r.min && entry.total <= r.max);
        if (tdIdx !== -1) tillDateDist[tdIdx].count++;
      }
    }

    return {
      todayTargetCompleted: todayCompleted,
      tillDateTargetCompleted: tillDateCompleted,
      todayTargetDistribution: todayDist,
      tillDateDistribution: tillDateDist,
    };
  }, [students, marksForDate, marksMap, marksSummary, scoreDistribution]);

  // ── Formatted date label ─────────────────────────────────────────────────────
  const formattedDate = useMemo(() => formatDisplayDate(selectedDate), [selectedDate]);

  // ── Chart bar click ──────────────────────────────────────────────────────────
  const handleBarClick = (info) => { setModalInfo(info); setIsModalOpen(true); };

  // ── Export Report ────────────────────────────────────────────────────────────
  const handleExportReport = () => {
    const reportData = students.length > 0
      ? students.map(s => {
          const marks = marksForDate?.get(s.regNo);
          return {
            'Sl No':           s.slNo,
            'Student Name':    s.name,
            'Register Number': s.regNo,
            'Department':      s.dept,
            'Laptop Status':   s.laptopStatus || '–',
            'Date':            selectedDate,
            'FN Attendance':   s.todayAttendance || 'N/A',
            'Marks':           marks ? marks.total : 'N/A',
            'Max Marks':       marks ? marks.maxMarks : 30,
            'Qualified':       marks ? (marks.qualified ? 'YES' : 'NO') : 'N/A',
          };
        })
      : [...marksMap.values()].map(m => ({
          'Register Number': m.regNo,
          'Email':           m.email,
          'Branch':          m.branch,
          'Ques Count':      m.questCount,
          'Marks':           m.total,
          'Max Marks':       m.maxMarks,
          'Percentage':      m.percentage + '%',
          'Qualified':       m.qualified ? 'YES' : 'NO',
        }));

    const csv  = Papa.unparse(reportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `SVCE_Assessment_Report_${selectedDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Snapshot ─────────────────────────────────────────────────────────────────
  const handleTakeSnapshot = () => {
    const el = document.getElementById('dashboard-root');
    if (!el) return;
    html2canvas(el, { scale: 2 }).then(canvas => {
      const a = document.createElement('a');
      a.href     = canvas.toDataURL('image/png');
      a.download = `SVCE_Dashboard_Snapshot_${selectedDate}.png`;
      a.click();
    });
  };

  // ── Live form submission (from sync modal) ───────────────────────────────────
  const handleLiveSubmission = ({ date, student }) => {
    if (date !== selectedDate) setSelectedDate(date);
  };

  // ── Available dates from sheet (for date navigation) ─────────────────────────
  // Convert DD/MM/YYYY → YYYY-MM-DD for the date input
  const availableDates = useMemo(() =>
    sheetDates.map(d => {
      const p = d.split('/');
      return p.length === 3 ? `${p[2]}-${p[1]}-${p[0]}` : d;
    }),
    [sheetDates]
  );

  // ── Total students: prefer attendance count, else marks count ────────────────
  const totalStudentsCount = students.length > 0
    ? students.length
    : (marksMap.size > 0 ? marksMap.size : COLLEGE_INFO.totalStudentsDefault);

  return (
    <div id="dashboard-root" className="min-h-screen bg-[#f3f4f8] pb-16">

      {/* ── Error banners ── */}
      {sheetsError && (
        <div className="bg-rose-50 border-b border-rose-200 px-6 py-2.5 text-xs text-rose-700 font-semibold text-center">
          ⚠ Attendance sheet: {sheetsError}
        </div>
      )}
      {marksError && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 text-xs text-amber-700 font-semibold text-center">
          ⚠ Marks sheet: {marksError}
        </div>
      )}

      {/* ── Loading banner ── */}
      {(sheetsLoading || marksLoading) && !liveDataLoaded && marksMap.size === 0 && (
        <div className="bg-teal-50 border-b border-teal-200 px-6 py-2.5 text-xs text-[#005F69] font-semibold text-center animate-pulse">
          🔄 Fetching live data from Google Sheets…
        </div>
      )}

      {/* ── Live data status bar ── */}
      {(liveDataLoaded || marksMap.size > 0) && !sheetsLoading && !marksLoading && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs text-emerald-700 font-semibold text-center">
          ✅ Live data loaded — {marksSummary.total} student scores · {marksSummary.qualified} qualified ({marksSummary.avgPercentage}% avg)
          {lastSynced && ` · Last synced: ${lastSynced.toLocaleTimeString('en-IN')}`}
        </div>
      )}

      {/* ── Header ── */}
      <Header
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onExportReport={handleExportReport}
        onTakeSnapshot={handleTakeSnapshot}
        onOpenSyncModal={() => setIsSyncModalOpen(true)}
        availableDates={availableDates}
      />

      {/* ── Dashboard Body ── */}
      <main className="max-w-7xl mx-auto px-6 py-4">

        {/* KPI Cards */}
        <KPICards
          totalStudents={totalStudentsCount}
          totalBatches={COLLEGE_INFO.totalBatchesDefault}
          todayCompleted={currentAnalytics.todayTargetCompleted}
          tillDateCompleted={currentAnalytics.tillDateTargetCompleted}
          presentToday={liveDataLoaded ? attendanceStats.presentCount : undefined}
          attendancePercent={attendanceStats.percent}
          liveDataLoaded={liveDataLoaded}
          marksQualifiedCount={marksQualifiedCount}
          marksTotal={marksSummary.total}
        />

        {/* Dual SVG Charts */}
        <AnalyticsCharts
          formattedDate={formattedDate}
          todayData={currentAnalytics.todayTargetDistribution}
          tillDateData={currentAnalytics.tillDateDistribution}
          onBarClick={handleBarClick}
        />

        {/* Student Table – live data with marks */}
        <StudentTable
          students={students}
          formattedDate={formattedDate}
          loading={sheetsLoading || marksLoading}
          lastSynced={lastSynced}
          onRefresh={() => { refetch(); refetchMarks(); }}
          marksForDate={marksForDate}
          marksError={marksError}
        />

      </main>

      {/* Floating widgets */}
      <FloatingWidgets onOpenHelp={() => setIsSyncModalOpen(true)} />

      {/* Modals */}
      <StudentPreviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modalInfo={modalInfo}
        studentList={students}
      />

      <GoogleFormSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        onAddLiveSubmission={handleLiveSubmission}
        onConnectSheetUrl={() => alert('Sync activated!')}
      />

    </div>
  );
}
