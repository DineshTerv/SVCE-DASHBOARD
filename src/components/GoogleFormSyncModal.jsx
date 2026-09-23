import React, { useState } from 'react';
import { X, Check, Copy, Link, RefreshCw, Send, HelpCircle, FileSpreadsheet } from 'lucide-react';
import Papa from 'papaparse';

export default function GoogleFormSyncModal({ 
  isOpen, 
  onClose, 
  onAddLiveSubmission, 
  onConnectSheetUrl 
}) {
  const [activeTab, setActiveTab] = useState('simulate'); // 'simulate' | 'sheetUrl' | 'appsScript'
  const [sheetUrl, setSheetUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Form simulation state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    studentName: 'ANNADANAM VASUNDHARA',
    regNo: '24BFA37003',
    dept: 'CSC-A',
    batch: '5',
    todayQuestions: 10,
    tillDateQuestions: 50
  });

  if (!isOpen) return null;

  const handleSimulateSubmit = (e) => {
    e.preventDefault();
    onAddLiveSubmission({
      date: formData.date,
      student: {
        name: formData.studentName,
        regNo: formData.regNo,
        dept: formData.dept,
        batch: formData.batch,
        isStar: true
      },
      todayQuestions: parseInt(formData.todayQuestions, 10),
      tillDateQuestions: parseInt(formData.tillDateQuestions, 10)
    });
    alert(`Success! Google Form Response received for ${formData.studentName}. Dashboard updated live!`);
    onClose();
  };

  const handleFetchSheet = () => {
    if (!sheetUrl) return;
    setIsFetching(true);

    Papa.parse(sheetUrl, {
      download: true,
      header: true,
      complete: (results) => {
        setIsFetching(false);
        if (results.data && results.data.length > 0) {
          onConnectSheetUrl(results.data);
          alert(`Successfully synced ${results.data.length} responses from Google Sheets!`);
          onClose();
        } else {
          alert('No data rows found in Google Sheet CSV!');
        }
      },
      error: (err) => {
        setIsFetching(false);
        alert('Error fetching Google Sheet: Please make sure the sheet is published to the web as CSV.');
      }
    });
  };

  const appsScriptSnippet = `
// --- GOOGLE APPS SCRIPT FOR AUTOMATIC GOOGLE FORMS TO DASHBOARD SYNC ---
// 1. In your Google Form / Google Sheet, click Extensions > Apps Script
// 2. Paste this code below and set your Dashboard Webhook URL
// 3. Set a trigger for "On Form Submit"

function onFormSubmit(e) {
  var responses = e.values; // Array of form column answers
  var payload = {
    timestamp: responses[0],
    studentName: responses[1],
    regNo: responses[2],
    dept: responses[3],
    batch: responses[4],
    todayQuestions: parseInt(responses[5] || 0),
    tillDateQuestions: parseInt(responses[6] || 0)
  };

  // Replace with your Dashboard API endpoint URL
  var dashboardWebhookUrl = "https://your-dashboard-domain.com/api/webhook";

  UrlFetchApp.fetch(dashboardWebhookUrl, {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload)
  });
}
`;

  const copyAppsScript = () => {
    navigator.clipboard.writeText(appsScriptSnippet);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">Google Form Live Data Integration</h3>
              <p className="text-xs text-slate-500">Auto-update dashboard upon Google Form submissions</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 bg-slate-50/50 px-8 pt-3 gap-4 text-xs font-bold text-slate-600">
          <button 
            onClick={() => setActiveTab('simulate')}
            className={`pb-3 px-1 border-b-2 transition ${activeTab === 'simulate' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Instant Form Tester
          </button>
          <button 
            onClick={() => setActiveTab('sheetUrl')}
            className={`pb-3 px-1 border-b-2 transition ${activeTab === 'sheetUrl' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Connect Google Sheet CSV
          </button>
          <button 
            onClick={() => setActiveTab('appsScript')}
            className={`pb-3 px-1 border-b-2 transition ${activeTab === 'appsScript' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Google Apps Script Setup
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-8 overflow-y-auto flex-1">
          
          {/* TAB 1: Instant Form Tester */}
          {activeTab === 'simulate' && (
            <form onSubmit={handleSimulateSubmit} className="space-y-4">
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-800 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Submit a sample response below to simulate a real student submitting your Google Form. Watch the dashboard metrics & charts update in real-time!
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Name</label>
                  <input 
                    type="text" 
                    value={formData.studentName}
                    onChange={(e) => setFormData({...formData, studentName: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Register Number</label>
                  <input 
                    type="text" 
                    value={formData.regNo}
                    onChange={(e) => setFormData({...formData, regNo: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input 
                    type="text" 
                    value={formData.dept}
                    onChange={(e) => setFormData({...formData, dept: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Today Questions Solved (0-15)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="15"
                    value={formData.todayQuestions}
                    onChange={(e) => setFormData({...formData, todayQuestions: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Till Date InClass Solved</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.tillDateQuestions}
                    onChange={(e) => setFormData({...formData, tillDateQuestions: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white text-slate-800 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Live Form Response</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Connect Google Sheet CSV */}
          {activeTab === 'sheetUrl' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                To sync responses live from a Google Sheet:
                <br />1. Open your Google Form responses sheet.
                <br />2. Click <strong>File &gt; Share &gt; Publish to web</strong>.
                <br />3. Choose <strong>CSV format</strong> and copy the published link.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Published Google Sheet CSV Link</label>
                <div className="flex gap-2">
                  <input 
                    type="url"
                    placeholder="https://docs.google.com/spreadsheets/d/e/.../pub?output=csv"
                    value={sheetUrl}
                    onChange={(e) => setSheetUrl(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-slate-800"
                  />
                  <button 
                    onClick={handleFetchSheet}
                    disabled={isFetching || !sheetUrl}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                    <span>Sync</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Apps Script Setup */}
          {activeTab === 'appsScript' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">Google Apps Script Snippet</span>
                <button 
                  onClick={copyAppsScript}
                  className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied Code!' : 'Copy Snippet'}</span>
                </button>
              </div>

              <pre className="bg-slate-900 text-emerald-400 p-4 rounded-xl text-[11px] overflow-x-auto font-mono max-h-60 leading-relaxed">
                {appsScriptSnippet}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
