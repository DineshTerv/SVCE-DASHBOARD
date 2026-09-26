import { useState, useEffect, useCallback } from 'react';
import { MARKS_SHEET_URL, parseMarksCSV, getMarksSummary, getBranchBreakdown, getScoreDistribution } from '../data/marksIntegration';

const REFRESH_INTERVAL_MS = 3 * 60 * 1000; // auto-refresh every 3 minutes

/**
 * Hook that fetches the live SVCE Assessment marks from the public Google Sheet.
 *
 * Returns:
 *   marksMap        – Map<regNo, { regNo, email, branch, total, maxMarks, percentage, qualified }>
 *   marksSummary    – { total, qualified, notQualified, avgScore, avgPercentage }
 *   branchBreakdown – { branchName → { qualified, notQualified, total, avgScore } }
 *   scoreDistribution – [{ label, count, qualified, notQualified }, ...]
 *   loading         – boolean
 *   lastSynced      – Date | null
 *   error           – string | null
 *   refetch         – () => void
 */
export default function useMarksSheet() {
  const [marksMap,         setMarksMap]         = useState(new Map());
  const [marksSummary,     setMarksSummary]     = useState({ total: 0, qualified: 0, notQualified: 0, avgScore: 0, avgPercentage: 0 });
  const [branchBreakdown,  setBranchBreakdown]  = useState({});
  const [scoreDistribution,setScoreDistribution]= useState([]);
  const [loading,          setLoading]          = useState(false);
  const [lastSynced,       setLastSynced]       = useState(null);
  const [error,            setError]            = useState(null);

  const fetchMarks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cacheBuster = new Date().getTime();
      const url = `${MARKS_SHEET_URL}&_cb=${cacheBuster}`;
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const csvText = await response.text();
      const parsed  = parseMarksCSV(csvText);

      setMarksMap(parsed);
      setMarksSummary(getMarksSummary(parsed));
      setBranchBreakdown(getBranchBreakdown(parsed));
      setScoreDistribution(getScoreDistribution(parsed));
      setLastSynced(new Date());
    } catch (err) {
      setError('Failed to load marks: ' + err.message);
      console.error('[useMarksSheet]', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMarks();
    const timer = setInterval(fetchMarks, REFRESH_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [fetchMarks]);

  return {
    marksMap,
    marksSummary,
    branchBreakdown,
    scoreDistribution,
    loading,
    lastSynced,
    error,
    refetch: fetchMarks,
  };
}
