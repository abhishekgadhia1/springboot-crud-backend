import React from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';
import { Breadcrumbs } from '../common/Breadcrumbs';
import {
  FolderGit2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  IndianRupee,
  TrendingUp,
  AlertOctagon,
  FileText,
  Briefcase,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

export const ExecutiveDashboard: React.FC = () => {
  const {
    projects,
    approvals,
    issuesRisks,
    notifications,
    setCurrentNav,
    setSelectedProjectId
  } = useApp();

  // Metrics calculations
  const totalProjects = projects.length;
  const inPlanning = projects.filter(p => p.currentStatus === 'Planning').length;
  const underRfp = projects.filter(p => p.currentStatus === 'Under RFP').length;
  const awarded = projects.filter(p => p.currentStatus === 'Awarded').length;
  const inExecution = projects.filter(p => p.currentStatus === 'In Execution').length;
  const completed = projects.filter(p => p.currentStatus === 'Completed').length;
  const delayed = projects.filter(p => p.currentStatus === 'Delayed' || p.delayDays > 0).length;

  const totalApprovedCost = projects.reduce((acc, p) => acc + p.approvedCost, 0);
  const totalExpenditure = projects.reduce((acc, p) => acc + p.expenditure, 0);
  const totalCommitted = projects.reduce((acc, p) => acc + p.committedCost, 0);
  const budgetUtilisation = totalApprovedCost > 0 ? (totalExpenditure / totalApprovedCost) * 100 : 0;

  const criticalAndHighRisks = projects.filter(
    p => p.riskLevel === 'Critical' || p.riskLevel === 'High'
  );

  const delayedProjects = projects.filter(p => p.delayDays > 0);

  // Status chart distribution data
  const statusDistribution = [
    { label: 'In Execution', count: inExecution, color: '#10B981' },
    { label: 'Delayed', count: delayed, color: '#F59E0B' },
    { label: 'Under RFP', count: underRfp, color: '#8B5CF6' },
    { label: 'Awarded', count: awarded, color: '#6366F1' },
    { label: 'Planning', count: inPlanning, color: '#3B82F6' },
    { label: 'Completed', count: completed, color: '#14B8A6' }
  ];

  // Category-wise budget breakdown
  const categorySummary: { [cat: string]: { approved: number; spent: number } } = {};
  projects.forEach(p => {
    if (!categorySummary[p.category]) {
      categorySummary[p.category] = { approved: 0, spent: 0 };
    }
    categorySummary[p.category].approved += p.approvedCost;
    categorySummary[p.category].spent += p.expenditure;
  });

  const categories = Object.keys(categorySummary).slice(0, 5);

  const pendingApprovals = approvals.filter(a => a.status === 'Pending');

  return (
    <div className="space-y-6">
      {/* Top Banner & Breadcrumbs */}
      <div>
        <Breadcrumbs currentModule="Executive Dashboard" />
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-slate-200 gap-2">
          <div>
            <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">
              State Urban Infrastructure Command Center
            </h2>
            <p className="text-xs text-slate-600">
              Real-time portfolio analytics across 33 Districts and 17 Municipal Corporations / ULBs
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentNav('Projects')}
              className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#092644] transition-colors"
            >
              <FolderGit2 className="w-3.5 h-3.5 mr-1.5" />
              Open Project Master
            </button>
            <button
              onClick={() => setCurrentNav('Reports')}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Generate State Report
            </button>
          </div>
        </div>
      </div>

      {/* Row 1: Primary KPI Stat Cards (Structured Government Enterprise Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Schemes */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Schemes</span>
            <FolderGit2 className="w-4 h-4 text-blue-800" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{totalProjects}</div>
          <div className="text-[10px] text-slate-500 mt-1">Across 8 Urban Sectors</div>
        </div>

        {/* Planning & Sanction */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">In Planning</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-blue-700">{inPlanning}</div>
          <div className="text-[10px] text-slate-500 mt-1">DPR / AS / TS in pipeline</div>
        </div>

        {/* Under Tendering */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Under RFP</span>
            <FileText className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-700">{underRfp}</div>
          <div className="text-[10px] text-slate-500 mt-1">Tenders invited / Evaluated</div>
        </div>

        {/* Awarded / WO */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Awarded</span>
            <Briefcase className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-700">{awarded}</div>
          <div className="text-[10px] text-slate-500 mt-1">Contracts & Work Orders</div>
        </div>

        {/* Under Execution */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">In Execution</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-700">{inExecution}</div>
          <div className="text-[10px] text-slate-500 mt-1">Active site construction</div>
        </div>

        {/* Completed */}
        <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-teal-700">{completed}</div>
          <div className="text-[10px] text-slate-500 mt-1">Handed over to ULBs</div>
        </div>
      </div>

      {/* Row 2: Financial Envelope Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase text-slate-600">Total Approved Outlay</span>
            <IndianRupee className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900">₹ {totalApprovedCost.toFixed(1)} <span className="text-sm font-normal text-slate-600">Cr</span></div>
          <div className="text-[11px] text-slate-500 mt-1">SJMMSVY, AMRUT 2.0 & WB Funds</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase text-slate-600">Total Expenditure</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-800">₹ {totalExpenditure.toFixed(1)} <span className="text-sm font-normal text-slate-600">Cr</span></div>
          <div className="text-[11px] text-slate-500 mt-1">Verified via Treasury & RA Bills</div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase text-slate-600">Budget Utilisation</span>
            <span className="text-xs font-bold text-blue-700">{budgetUtilisation.toFixed(1)}%</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">{budgetUtilisation.toFixed(1)}%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, budgetUtilisation)}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase text-rose-800 font-bold">Projects At Risk / Delayed</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700">
            {delayed} <span className="text-sm font-normal text-slate-600">Delayed</span> / {criticalAndHighRisks.length} <span className="text-sm font-normal text-slate-600">High Risk</span>
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">Requires Departmental Review</div>
        </div>
      </div>

      {/* Row 3: Visual Analytics (Custom SVG Charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Chart 1: Project Status Distribution Donut */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Project Status Distribution
            </h3>
            <span className="text-[11px] text-slate-500">{totalProjects} Projects</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around flex-1 py-2">
            {/* SVG Donut */}
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="14" fill="none" stroke="#F1F5F9" strokeWidth="4" />
                {(() => {
                  let accumulatedPercent = 0;
                  return statusDistribution.map((item, i) => {
                    const percent = totalProjects > 0 ? (item.count / totalProjects) * 100 : 0;
                    if (percent === 0) return null;
                    const strokeDasharray = `${percent} ${100 - percent}`;
                    const strokeDashoffset = -accumulatedPercent;
                    accumulatedPercent += percent;
                    return (
                      <circle
                        key={i}
                        cx="18"
                        cy="18"
                        r="14"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="4"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    );
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-500 font-medium">Active</span>
                <span className="text-lg font-bold text-slate-800">{inExecution + awarded}</span>
              </div>
            </div>

            {/* Legend List */}
            <div className="mt-3 sm:mt-0 space-y-1 text-xs w-full sm:w-auto">
              {statusDistribution.map(item => (
                <div key={item.label} className="flex items-center justify-between space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-600">{item.label}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chart 2: Sector-wise Approved Cost vs Expenditure */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs lg:col-span-2 flex flex-col">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Sector-wise Financial Allocation vs Expenditure (₹ Cr)
              </h3>
              <p className="text-[10px] text-slate-500">Top urban infrastructure development categories</p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-2.5 bg-blue-800 rounded-xs" />
                <span className="text-slate-600 text-[11px]">Approved Outlay</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-3 h-2.5 bg-emerald-600 rounded-xs" />
                <span className="text-slate-600 text-[11px]">Expenditure</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            {categories.map(cat => {
              const data = categorySummary[cat];
              const maxBudget = 300; // max scale
              const approvedPct = Math.min(100, (data.approved / maxBudget) * 100);
              const spentPct = Math.min(100, (data.spent / maxBudget) * 100);

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate max-w-xs">{cat}</span>
                    <span className="text-slate-600 text-[11px]">
                      ₹{data.spent.toFixed(1)} Cr / ₹{data.approved.toFixed(1)} Cr
                    </span>
                  </div>
                  <div className="relative h-4 bg-slate-100 rounded-xs overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-blue-800/80 rounded-xs"
                      style={{ width: `${approvedPct}%` }}
                    />
                    <div
                      className="absolute top-0 bottom-0 left-0 bg-emerald-600 rounded-xs"
                      style={{ width: `${spentPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Row 4: Operational Tables: Delayed & High Risk Projects + Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Delayed & Overdue Projects */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs lg:col-span-2 overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Delayed Schemes Requiring Corrective Action ({delayedProjects.length})
              </h3>
            </div>
            <button
              onClick={() => setCurrentNav('Progress Monitoring')}
              className="text-xs font-semibold text-blue-700 hover:underline flex items-center"
            >
              Progress Tracker <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-600 text-[11px] font-semibold uppercase border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Project ID & Title</th>
                  <th className="py-2.5 px-3">District</th>
                  <th className="py-2.5 px-3 text-center">Delay</th>
                  <th className="py-2.5 px-3">Progress</th>
                  <th className="py-2.5 px-3">Root Cause</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {delayedProjects.slice(0, 5).map(prj => (
                  <tr key={prj.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2 px-3">
                      <span className="font-mono text-[10px] text-blue-800 font-bold block">{prj.id}</span>
                      <span className="font-semibold text-slate-900 line-clamp-1">{prj.name}</span>
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-600">{prj.district}</td>
                    <td className="py-2 px-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[11px]">
                        +{prj.delayDays} Days
                      </span>
                    </td>
                    <td className="py-2 px-3">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-14 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-600 h-full rounded-full"
                            style={{ width: `${prj.physicalProgress}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-700">{prj.physicalProgress}%</span>
                      </div>
                    </td>
                    <td className="py-2 px-3 text-[11px] text-slate-600 line-clamp-1 max-w-xs">
                      {prj.delayReason || 'Clearances in progress'}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedProjectId(prj.id);
                        }}
                        className="p-1 text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded"
                        title="View Project Master Record"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Actions & Approvals Inbox Preview */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pending Approvals ({pendingApprovals.length})
            </h3>
            <button
              onClick={() => setCurrentNav('Approvals')}
              className="text-xs font-semibold text-blue-700 hover:underline"
            >
              Open Inbox
            </button>
          </div>

          <div className="p-3 divide-y divide-slate-100 flex-1 overflow-y-auto max-h-80">
            {pendingApprovals.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                No pending workflow items requiring your action.
              </div>
            ) : (
              pendingApprovals.slice(0, 4).map(app => (
                <div key={app.id} className="py-2.5 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-500">{app.id}</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-bold">
                      Due: {app.dueDate}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-900 text-xs leading-snug">{app.approvalType}</p>
                  <p className="text-[11px] text-slate-600 line-clamp-1">{app.projectName}</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-500">From: {app.submittedBy}</span>
                    {app.amount ? (
                      <span className="text-[10px] font-bold text-slate-800">₹{app.amount} Cr</span>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-center">
            <button
              onClick={() => setCurrentNav('Approvals')}
              className="w-full py-1 text-xs font-semibold text-blue-800 hover:bg-blue-100/50 rounded transition-colors"
            >
              Review All Action Items &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
