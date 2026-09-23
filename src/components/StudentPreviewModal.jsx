import React from 'react';
import { X, Download } from 'lucide-react';
import Papa from 'papaparse';

export default function StudentPreviewModal({ 
  isOpen, 
  onClose, 
  modalInfo, 
  studentList 
}) {
  if (!isOpen || !modalInfo) return null;

  const defaultModalStudents = [
    { slNo: 1, name: "ANNADANAM VASUNDHARA", regNo: "24BFA37003", dept: "CSC-A", batch: "5" },
    { slNo: 2, name: "AVULA GREESHMA", regNo: "24BFA37004", dept: "CSC-A", batch: "5" },
    { slNo: 3, name: "CHUKKA BALA VENKATESH", regNo: "24BFA37012", dept: "CSC-A", batch: "5" },
    { slNo: 4, name: "GADDAM JAYA PRAVEEN", regNo: "24BFA37016", dept: "CSC-A", batch: "5" },
    { slNo: 5, name: "KURAM SRAVANI", regNo: "24BFA37032", dept: "CSC-A", batch: "5" },
    { slNo: 6, name: "MALLAVARAM VAISHNAVI", regNo: "24BFA37035", dept: "CSC-A", batch: "5" },
  ];

  const filteredStudents = modalInfo.rangeLabel === '43-56 Questions' 
    ? defaultModalStudents 
    : studentList.slice(0, Math.min(modalInfo.count || 6, 20)).map((s, i) => ({
        slNo: i + 1,
        name: s.name,
        regNo: s.regNo,
        dept: s.dept,
        batch: s.batch
      }));

  const handleDownloadCSV = () => {
    const csvData = filteredStudents.map((s, idx) => ({
      "Sl No": idx + 1,
      "Student Name": s.name,
      "Register Number": s.regNo,
      "Department": s.dept,
      "Batch": s.batch
    }));

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${modalInfo.rangeLabel.replace(/\s+/g, '_')}_Students.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            {modalInfo.rangeLabel || "43-56 Questions"} - Students Preview
          </h3>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Table */}
        <div className="overflow-y-auto px-8 py-4 flex-1">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-slate-600 font-bold border-b border-slate-100 uppercase tracking-wider sticky top-0">
              <tr>
                <th className="py-3.5 px-4 rounded-l-lg">Sl No</th>
                <th className="py-3.5 px-4">Student Name</th>
                <th className="py-3.5 px-4">Register Number</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4 rounded-r-lg">Batch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((s, idx) => (
                <tr key={s.regNo + idx} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4 font-semibold text-slate-500">{idx + 1}</td>
                  <td className="py-4 px-4 font-bold text-slate-800">{s.name}</td>
                  <td className="py-4 px-4 font-medium text-slate-600">{s.regNo}</td>
                  <td className="py-4 px-4 font-medium text-slate-600">{s.dept}</td>
                  <td className="py-4 px-4">
                    <span className="bg-teal-50 text-[#005F69] font-bold px-2.5 py-1 rounded-md text-[11px] border border-teal-100">
                      {s.batch}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-8 py-4 bg-slate-50/50 border-t border-slate-100">
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#005F69] hover:bg-[#004b53] text-white font-bold text-xs rounded-xl transition shadow-xs cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download CSV</span>
          </button>
        </div>

      </div>
    </div>
  );
}
