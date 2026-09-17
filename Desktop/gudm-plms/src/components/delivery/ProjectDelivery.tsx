import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import {
  Layers,
  Calendar,
  Activity,
  User,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight
} from 'lucide-react';

export const ProjectDelivery: React.FC = () => {
  const { projects, setSelectedProjectId } = useApp();

  const activeProjects = projects.filter(
    p => p.currentStatus === 'In Execution' || p.currentStatus === 'Delayed' || p.currentStatus === 'Awarded'
  );

  const [selectedPrj, setSelectedPrj] = useState(activeProjects[0] || projects[0]);

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="Project Delivery & WBS" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Project Delivery & Work Breakdown Structure</h2>
          <p className="text-xs text-slate-600">
            Field delivery oversight, engineering milestones, baseline schedule tracking and contractor performance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Active Schemes Selector */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Active Construction Sites ({activeProjects.length})
            </h3>
            <span className="text-[11px] text-slate-500">Live Sites</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[650px]">
            {activeProjects.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedPrj(p)}
                className={`p-3.5 cursor-pointer text-xs transition-colors hover:bg-slate-50 ${
                  selectedPrj?.id === p.id ? 'bg-blue-50/70 border-l-4 border-blue-800' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] font-bold text-blue-900">{p.id}</span>
                  <StatusBadge status={p.currentStatus} size="sm" />
                </div>
                <h4 className="font-semibold text-slate-900 line-clamp-1">{p.name}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">{p.district} &bull; {p.contractor || 'Contractor Appointed'}</p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700">Progress: {p.physicalProgress}%</span>
                  {p.delayDays > 0 ? (
                    <span className="text-rose-700 font-bold">+{p.delayDays}d Delay</span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">On Time</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Project Delivery Deep-Dive */}
        {selectedPrj ? (
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 mr-2">
                    {selectedPrj.id}
                  </span>
                  <span className="text-xs text-slate-500">{selectedPrj.category}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-1">{selectedPrj.name}</h3>
                  <p className="text-xs text-slate-600">Location: {selectedPrj.location}, {selectedPrj.district}</p>
                </div>

                <button
                  onClick={() => setSelectedProjectId(selectedPrj.id)}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#082440] transition-colors flex items-center shadow-xs self-start"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 mr-1" />
                  Full Master Record
                </button>
              </div>

              {/* Progress Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Physical Progress</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-bold text-blue-900">{selectedPrj.physicalProgress}%</span>
                    <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-700 h-full rounded-full" style={{ width: `${selectedPrj.physicalProgress}%` }} />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block">Financial Progress</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-lg font-bold text-emerald-800">{selectedPrj.financialProgress}%</span>
                    <div className="w-16 bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${selectedPrj.financialProgress}%` }} />
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block">Lead Contractor</span>
                  <span className="font-semibold text-slate-800 line-clamp-1 mt-1">{selectedPrj.contractor || 'N/A'}</span>
                </div>

                <div>
                  <span className="text-slate-500 block">Project Manager</span>
                  <span className="font-semibold text-slate-800 line-clamp-1 mt-1">{selectedPrj.projectManager}</span>
                </div>
              </div>

              {/* WBS Milestones Breakdown */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Work Breakdown Structure (WBS) & Deliverables
                  </h4>
                  <span className="text-[11px] text-slate-500">Planned vs Actual Milestones</span>
                </div>

                <div className="bg-white rounded border border-slate-200 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2 px-3">Milestone Deliverable</th>
                        <th className="py-2 px-3 text-center">Weight</th>
                        <th className="py-2 px-3">Planned Target</th>
                        <th className="py-2 px-3">Actual Achieved</th>
                        <th className="py-2 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedPrj.milestones.map(m => (
                        <tr key={m.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3">
                            <span className="font-semibold text-slate-900 block">{m.name}</span>
                            <span className="text-[11px] text-slate-500">{m.deliverable}</span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-700">{m.weightage}%</td>
                          <td className="py-2.5 px-3 text-slate-600">{m.plannedDate}</td>
                          <td className="py-2.5 px-3 text-slate-600">{m.actualDate || '—'}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                m.status === 'Achieved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : m.status === 'In Progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {m.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Site Photos Feed Placeholder */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Geo-Tagged Site Construction Evidences
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="rounded border border-slate-200 overflow-hidden bg-slate-50">
                    <img
                      src="https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?w=500&auto=format&fit=crop&q=60"
                      alt="Foundation Excavation"
                      className="w-full h-28 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-2 text-[10px] text-slate-600">
                      <span className="font-bold block text-slate-800">Sub-base & Foundation</span>
                      <span>Verified: 2025-02-14 &bull; GPS: 23.02 N, 72.57 E</span>
                    </div>
                  </div>

                  <div className="rounded border border-slate-200 overflow-hidden bg-slate-50">
                    <img
                      src="https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=500&auto=format&fit=crop&q=60"
                      alt="Structural Casting"
                      className="w-full h-28 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-2 text-[10px] text-slate-600">
                      <span className="font-bold block text-slate-800">Pumping Station Superstructure</span>
                      <span>Verified: 2025-03-01 &bull; Slump: Passed</span>
                    </div>
                  </div>

                  <div className="rounded border border-slate-200 overflow-hidden bg-slate-50">
                    <img
                      src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=60"
                      alt="Safety Audit"
                      className="w-full h-28 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="p-2 text-[10px] text-slate-600">
                      <span className="font-bold block text-slate-800">Site Safety & Barricading</span>
                      <span>Zero incidents logged &bull; Compliant</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
