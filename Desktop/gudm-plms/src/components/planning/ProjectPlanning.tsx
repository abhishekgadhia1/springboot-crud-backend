import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import {
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  Plus,
  FileCheck,
  Building
} from 'lucide-react';

export const ProjectPlanning: React.FC = () => {
  const { projects, moveProjectStage, setSelectedProjectId } = useApp();

  const planningProjects = projects.filter(p =>
    ['Project idea', 'Preliminary proposal', 'Technical assessment', 'Administrative approval', 'Financial approval'].includes(
      p.currentStage
    )
  );

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="Project Planning & Sanctions" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Project Planning & Sanction Formulation</h2>
          <p className="text-xs text-slate-600">
            Stages 1 to 5: Concept formulation, detailed feasibility, technical sanction (TS) and administrative approval (AS)
          </p>
        </div>
      </div>

      {/* Pipeline Stage Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
        {[
          { title: '1. Project Idea', desc: 'Concept notes & citizen needs', count: projects.filter(p => p.currentStage === 'Project idea').length },
          { title: '2. Preliminary Proposal', desc: 'Pre-feasibility & scoping', count: projects.filter(p => p.currentStage === 'Preliminary proposal').length },
          { title: '3. Technical Assessment', desc: 'DPR & soil/hydraulic study', count: projects.filter(p => p.currentStage === 'Technical assessment').length },
          { title: '4. Administrative Approval', desc: 'AS by Competent Authority', count: projects.filter(p => p.currentStage === 'Administrative approval').length },
          { title: '5. Financial Concurrence', desc: 'Budget & TS sanction', count: projects.filter(p => p.currentStage === 'Financial approval').length },
        ].map((col, idx) => (
          <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-xs">
            <div className="font-bold text-[#0E355C]">{col.title}</div>
            <p className="text-[10px] text-slate-500">{col.desc}</p>
            <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">In Pipeline:</span>
              <span className="text-sm font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {col.count}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Planning Master Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Schemes Under Formulation & Sanctions ({planningProjects.length})
          </h3>
          <span className="text-xs text-slate-500">Click row to open master file or sanction stage</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E355C] text-white uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Project ID</th>
                <th className="py-2.5 px-3">Scheme Name</th>
                <th className="py-2.5 px-3">Sector</th>
                <th className="py-2.5 px-3">District & ULB</th>
                <th className="py-2.5 px-3 text-right">Est. Outlay</th>
                <th className="py-2.5 px-3">Current Sanction Stage</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {planningProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    All schemes have successfully cleared the planning phase into procurement or execution.
                  </td>
                </tr>
              ) : (
                planningProjects.map(p => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-blue-900 whitespace-nowrap">{p.id}</td>
                    <td className="py-3 px-3 max-w-sm">
                      <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                      <div className="text-[11px] text-slate-500">Fund: {p.fundingSource}</div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">{p.category}</td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800 block">{p.district}</span>
                      <span className="text-[11px] text-slate-500">{p.ulb}</span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                      ₹ {p.estimatedCost.toFixed(1)} Cr
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-semibold text-[11px] border border-blue-200">
                        {p.currentStage}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          moveProjectStage(p.id, 'RFP preparation', 'Moved from Planning to Procurement');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-purple-700 text-white hover:bg-purple-800 transition-colors shadow-2xs"
                        title="Endorse and move to Tendering / RFP Preparation"
                      >
                        Push to RFP &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
