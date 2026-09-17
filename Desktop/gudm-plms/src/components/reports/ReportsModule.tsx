import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  FileText,
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const { projects, contracts, rfps, approvals, issuesRisks, inspections } = useApp();

  const [selectedReportId, setSelectedReportId] = useState('RPT-01');

  const reportCatalog = [
    { id: 'RPT-01', title: '1. Department-wise Project Summary Report', category: 'Executive Oversight', desc: 'Consolidated overview of projects grouped by department and sector' },
    { id: 'RPT-02', title: '2. Scheme-wise Physical & Financial Progress', category: 'Monitoring', desc: 'Detailed tracking of physical vs financial progress across all active schemes' },
    { id: 'RPT-03', title: '3. Delayed Schemes & Slippage Exception Report', category: 'Executive Oversight', desc: 'Critical report of projects facing delays, days lost and root causes' },
    { id: 'RPT-04', title: '4. Contractor Performance & Work Order Ledger', category: 'Procurement', desc: 'Performance ratings, active contracts, and delay metrics by contractor' },
    { id: 'RPT-05', title: '5. Financial Utilisation & Disbursal Report', category: 'Finance', desc: 'Budget allocations, releases, commitments, expenditure, and unspent balances' },
    { id: 'RPT-06', title: '6. Milestone Achievement & WBS Schedule', category: 'Monitoring', desc: 'Milestone targets, planned vs actual achievement dates and deliverable status' },
    { id: 'RPT-07', title: '7. Comprehensive Project Risk & Issue Register', category: 'Governance', desc: 'Active risks, severity levels, mitigation actions and escalation statuses' },
    { id: 'RPT-08', title: '8. Site Inspection & Quality Compliance Audit', category: 'Quality Assurance', desc: 'Site visit observations, defect notices, and contractor rectifications' },
    { id: 'RPT-09', title: '9. Tender / RFP Procurement Pipeline Status', category: 'Procurement', desc: 'RFP notices, bids received, evaluation timelines and award recommendations' },
    { id: 'RPT-10', title: '10. Departmental Workflow Pending Approvals', category: 'Governance', desc: 'Ageing analysis of files awaiting sanction, AS/TS and bill approvals' },
    { id: 'RPT-11', title: '11. Contract Variation Orders & Time Extensions (EOT)', category: 'Procurement', desc: 'Cumulative cost variances and extension of time granted to contractors' },
    { id: 'RPT-12', title: '12. Executive Cabinet Note & Mission Summary', category: 'Executive Oversight', desc: 'High-level policy summary for Hon. Urban Development Minister & CS' },
  ];

  const activeReport = reportCatalog.find(r => r.id === selectedReportId) || reportCatalog[0];

  const handleExportPDF = () => {
    alert(`Generating high-resolution official PDF for: ${activeReport.title}\nPrepared for GUDM Senior Administration.`);
  };

  const handleExportExcel = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,Report,GUDM PLMS Official Export\nGenerated Date,' +
      new Date().toISOString() +
      '\nReport Title,' +
      activeReport.title;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeReport.id}_GUDM_Export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="Reports & Analytics" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Standard Departmental Reports & MIS Analytics</h2>
          <p className="text-xs text-slate-600">
            Government MIS reporting suites for Mission Directorate, Administrative Department, State Cabinet and CAG Audit
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-700" />
            Export Excel / CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#092644] transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print / PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: 12 Distinct Reports Directory */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              12 Mandated MIS Reports
            </h3>
            <span className="text-[11px] text-slate-500 font-medium">Standard Formats</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[650px]">
            {reportCatalog.map(rpt => (
              <div
                key={rpt.id}
                onClick={() => setSelectedReportId(rpt.id)}
                className={`p-3 cursor-pointer text-xs transition-colors hover:bg-slate-50 ${
                  selectedReportId === rpt.id ? 'bg-blue-50/70 border-l-4 border-blue-800' : ''
                }`}
              >
                <div className="flex items-center justify-between text-[10px] mb-0.5">
                  <span className="font-mono font-bold text-blue-900">{rpt.id}</span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                    {rpt.category}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 leading-snug">{rpt.title}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{rpt.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Live Report Preview Container */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-2xs space-y-4">
            {/* Report Official Letterhead */}
            <div className="border-b-2 border-slate-800 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                    Government of Gujarat &bull; Urban Development and Urban Housing Department
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">
                    Gujarat Urban Development Mission (GUDM)
                  </h3>
                </div>
                <div className="text-right text-[11px] text-slate-500 font-mono">
                  <div>Date: {new Date().toISOString().substring(0, 10)}</div>
                  <div>Report Ref: GUDM/MIS/{selectedReportId}</div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200">
                <h4 className="font-bold text-slate-900 text-sm">{activeReport.title}</h4>
                <p className="text-xs text-slate-600">{activeReport.desc}</p>
              </div>
            </div>

            {/* Dynamic Report Content based on selection */}
            {selectedReportId === 'RPT-03' ? (
              /* Delayed projects specific report */
              <div className="space-y-3">
                <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-xs text-amber-900">
                  <strong>Executive Summary:</strong> Showing all projects where delay days exceeds zero, requiring immediate contractor review and utility shifting coordination.
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="py-2 px-2.5">Project ID</th>
                        <th className="py-2 px-2.5">Scheme Name</th>
                        <th className="py-2 px-2.5">District</th>
                        <th className="py-2 px-2.5 text-center">Delay</th>
                        <th className="py-2 px-2.5">Primary Delay Reason</th>
                        <th className="py-2 px-2.5 text-right">Approved Outlay</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {projects
                        .filter(p => p.delayDays > 0)
                        .map(p => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="py-2 px-2.5 font-mono font-bold text-blue-900">{p.id}</td>
                            <td className="py-2 px-2.5 font-semibold text-slate-800">{p.name}</td>
                            <td className="py-2 px-2.5">{p.district}</td>
                            <td className="py-2 px-2.5 text-center font-bold text-amber-800">+{p.delayDays}d</td>
                            <td className="py-2 px-2.5 text-slate-600 text-[11px]">{p.delayReason || 'Clearances pending'}</td>
                            <td className="py-2 px-2.5 text-right font-mono font-bold text-slate-900">₹{p.approvedCost} Cr</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : selectedReportId === 'RPT-05' ? (
              /* Financial Utilisation report */
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Approved</span>
                    <span className="text-base font-bold text-slate-900">
                      ₹ {projects.reduce((a, b) => a + b.approvedCost, 0).toFixed(2)} Cr
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Total Disbursed</span>
                    <span className="text-base font-bold text-emerald-800">
                      ₹ {projects.reduce((a, b) => a + b.expenditure, 0).toFixed(2)} Cr
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Utilisation Rate</span>
                    <span className="text-base font-bold text-blue-900">
                      {((projects.reduce((a, b) => a + b.expenditure, 0) / projects.reduce((a, b) => a + b.approvedCost, 0)) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px]">
                      <tr>
                        <th className="py-2 px-2.5">Scheme ID</th>
                        <th className="py-2 px-2.5">Title</th>
                        <th className="py-2 px-2.5 text-right">Approved Outlay</th>
                        <th className="py-2 px-2.5 text-right">Expenditure</th>
                        <th className="py-2 px-2.5 text-center">Utilisation %</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {projects.map(p => (
                        <tr key={p.id}>
                          <td className="py-2 px-2.5 font-mono font-bold text-blue-900">{p.id}</td>
                          <td className="py-2 px-2.5 font-semibold text-slate-800 line-clamp-1">{p.name}</td>
                          <td className="py-2 px-2.5 text-right font-mono">₹{p.approvedCost.toFixed(2)} Cr</td>
                          <td className="py-2 px-2.5 text-right font-mono font-bold text-emerald-800">₹{p.expenditure.toFixed(2)} Cr</td>
                          <td className="py-2 px-2.5 text-center font-bold text-blue-900">{p.financialProgress}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* General Department-wise / Scheme-wise summary view */
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="py-2 px-2.5">Project ID</th>
                      <th className="py-2 px-2.5">Scheme Title</th>
                      <th className="py-2 px-2.5">Sector</th>
                      <th className="py-2 px-2.5">District</th>
                      <th className="py-2 px-2.5 text-right">Outlay</th>
                      <th className="py-2 px-2.5 text-center">Physical %</th>
                      <th className="py-2 px-2.5 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {projects.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="py-2 px-2.5 font-mono font-bold text-blue-900">{p.id}</td>
                        <td className="py-2 px-2.5 font-semibold text-slate-800 line-clamp-1">{p.name}</td>
                        <td className="py-2 px-2.5 text-slate-600">{p.category}</td>
                        <td className="py-2 px-2.5">{p.district}</td>
                        <td className="py-2 px-2.5 text-right font-mono font-bold">₹{p.approvedCost} Cr</td>
                        <td className="py-2 px-2.5 text-center font-bold">{p.physicalProgress}%</td>
                        <td className="py-2 px-2.5 text-center">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                            {p.currentStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Official Certification Footer */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
              <div>
                <span>Generated by PLMS Core Reporting Engine</span>
                <span className="block">Authenticated GUDM Government Digital Record</span>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800">For Mission Director, GUDM</div>
                <span>Government of Gujarat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
