import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import {
  IndianRupee,
  TrendingUp,
  CreditCard,
  Building,
  CheckCircle2,
  Clock,
  Download,
  AlertCircle
} from 'lucide-react';

export const FinanceModule: React.FC = () => {
  const { projects, setSelectedProjectId } = useApp();

  const totalSanctioned = projects.reduce((acc, p) => acc + p.approvedCost, 0);
  const totalExpenditure = projects.reduce((acc, p) => acc + p.expenditure, 0);
  const totalCommitted = projects.reduce((acc, p) => acc + p.committedCost, 0);
  const unspentBalance = totalSanctioned - totalExpenditure;
  const overallUtilisation = (totalExpenditure / totalSanctioned) * 100;

  // Mock Bills Table (Requirement L)
  const mockBills = [
    { id: 'BILL/2025/081', project: 'Ahmedabad Stormwater Drainage', contractor: 'L&T Infrastructure', amount: 8.40, status: 'Paid', date: '2025-02-18', voucher: 'VCH-98124' },
    { id: 'BILL/2025/082', project: 'Surat Smart Water Metering', contractor: 'Tata Projects Ltd', amount: 5.10, status: 'Paid', date: '2025-02-24', voucher: 'VCH-98150' },
    { id: 'BILL/2025/083', project: 'Rajkot Ring Road Flyovers', contractor: 'Afcons Infrastructure', amount: 14.50, status: 'Approved', date: '2025-03-02', voucher: 'VCH-PENDING' },
    { id: 'BILL/2025/084', project: 'Bhavnagar STP Augmentation', contractor: 'NCC Urban', amount: 4.80, status: 'Submitted', date: '2025-03-08', voucher: 'Under Audit' },
    { id: 'BILL/2025/085', project: 'Gandhinagar Smart Command Center', contractor: 'Honeywell India', amount: 6.20, status: 'Submitted', date: '2025-03-10', voucher: 'Under Audit' },
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="Finance & Payments" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Financial Governance & Treasury Disbursements</h2>
          <p className="text-xs text-slate-600">
            State budget grants, Central AMRUT 2.0 allocations, Running Account (RA) bills and IFMS integration
          </p>
        </div>

        <button
          onClick={() => alert('Exporting Treasury Financial Ledger Report (PDF)...')}
          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors"
        >
          <Download className="w-3.5 h-3.5 mr-1.5" />
          Financial Ledger Export
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium uppercase">Total Sanctioned Outlay</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">₹ {totalSanctioned.toFixed(1)} <span className="text-sm font-normal text-slate-500">Cr</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Across {projects.length} urban schemes</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium uppercase">Committed Contract Outlay</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">₹ {totalCommitted.toFixed(1)} <span className="text-sm font-normal text-slate-500">Cr</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Under signed work orders</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium uppercase">Disbursed Expenditure</div>
          <div className="text-2xl font-bold text-emerald-800 mt-1">₹ {totalExpenditure.toFixed(1)} <span className="text-sm font-normal text-slate-500">Cr</span></div>
          <div className="text-[10px] text-slate-500 mt-1">Verified via Treasury Vouchers</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-slate-500 text-xs font-medium uppercase">Budget Utilisation %</div>
          <div className="text-2xl font-bold text-indigo-900 mt-1">{overallUtilisation.toFixed(1)}%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-700 h-full rounded-full" style={{ width: `${Math.min(100, overallUtilisation)}%` }} />
          </div>
        </div>
      </div>

      {/* RA Bills Processing Table (Requirement L) */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Running Account (RA) Bills & Payment Vouchers
          </h3>
          <span className="text-[11px] text-slate-500">Statutory 5% Security Retention Enforced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E355C] text-white uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Bill Number</th>
                <th className="py-2.5 px-3">Linked Scheme</th>
                <th className="py-2.5 px-3">Executing Contractor</th>
                <th className="py-2.5 px-3 text-right">Gross Claimed</th>
                <th className="py-2.5 px-3">Submission Date</th>
                <th className="py-2.5 px-3 text-center">Audit Status</th>
                <th className="py-2.5 px-3">Treasury Voucher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockBills.map(b => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{b.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">{b.project}</td>
                  <td className="py-2.5 px-3 text-slate-700">{b.contractor}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">₹ {b.amount.toFixed(2)} Cr</td>
                  <td className="py-2.5 px-3 text-slate-600">{b.date}</td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'Approved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{b.voucher}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheme-wise Financial Statement */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Scheme-wise Allocation vs Expenditure Ledger
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Scheme ID</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Funding Head</th>
                <th className="py-2.5 px-3 text-right">Sanctioned</th>
                <th className="py-2.5 px-3 text-right">Committed</th>
                <th className="py-2.5 px-3 text-right">Disbursed</th>
                <th className="py-2.5 px-3 text-center">Financial Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {projects.map(p => (
                <tr key={p.id} onClick={() => setSelectedProjectId(p.id)} className="hover:bg-slate-50 cursor-pointer">
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{p.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 line-clamp-1">{p.name}</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px]">{p.fundingSource}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-800">₹ {p.approvedCost.toFixed(2)} Cr</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-700">₹ {p.committedCost.toFixed(2)} Cr</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-800">₹ {p.expenditure.toFixed(2)} Cr</td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="inline-flex items-center space-x-1">
                      <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${p.financialProgress}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-slate-700">{p.financialProgress}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
