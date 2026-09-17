import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Edit3,
  TrendingUp,
  Search,
  Filter
} from 'lucide-react';

export const ProgressMonitoring: React.FC = () => {
  const { projects, updateProjectProgress, setSelectedProjectId } = useApp();

  const [selectedPrjId, setSelectedPrjId] = useState(projects[0]?.id || '');
  const [showEditModal, setShowEditModal] = useState(false);

  // Edit states (Demo Scenario 7 & 8)
  const currentPrj = projects.find(p => p.id === selectedPrjId) || projects[0];

  const [editPhysical, setEditPhysical] = useState(currentPrj?.physicalProgress || 0);
  const [editFinancial, setEditFinancial] = useState(currentPrj?.financialProgress || 0);
  const [editExpenditure, setEditExpenditure] = useState(currentPrj?.expenditure || 0);
  const [editDelayDays, setEditDelayDays] = useState(currentPrj?.delayDays || 0);
  const [editDelayReason, setEditDelayReason] = useState(currentPrj?.delayReason || '');
  const [editRemarks, setEditRemarks] = useState('');

  const handleOpenEdit = (prj: any) => {
    setSelectedPrjId(prj.id);
    setEditPhysical(prj.physicalProgress);
    setEditFinancial(prj.financialProgress);
    setEditExpenditure(prj.expenditure);
    setEditDelayDays(prj.delayDays);
    setEditDelayReason(prj.delayReason || '');
    setEditRemarks('');
    setShowEditModal(true);
  };

  const handleSaveProgress = () => {
    if (currentPrj) {
      updateProjectProgress(
        currentPrj.id,
        Number(editPhysical),
        Number(editFinancial),
        Number(editExpenditure),
        Number(editDelayDays),
        editDelayReason,
        editRemarks || 'Updated via Progress Monitoring Module'
      );
      setShowEditModal(false);
    }
  };

  const delayedList = projects.filter(p => p.delayDays > 0);

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="Progress Monitoring" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Field Progress & Delay Monitoring</h2>
          <p className="text-xs text-slate-600">
            Bi-weekly physical vs financial progress tracking, S-curve variance and critical path slippage
          </p>
        </div>
      </div>

      {/* High-level delay alert banner if any delayed */}
      {delayedList.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs flex items-start space-x-3 text-amber-900">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">
              Attention: {delayedList.length} Urban Infrastructure Schemes are reporting schedule slippage:
            </span>
            <p className="text-[11px] text-amber-800 mt-0.5">
              Root causes include utility relocations (UGVCL power lines / gas pipelines), railway crossings, and unseasonal monsoons. Immediate review with Chief Engineers scheduled.
            </p>
          </div>
        </div>
      )}

      {/* Progress Master Table with Direct Update Triggers */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            All Monitored Schemes ({projects.length})
          </h3>
          <span className="text-[11px] text-slate-500">Click 'Update Progress' to log current measurement</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E355C] text-white uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Project ID</th>
                <th className="py-2.5 px-3">Scheme Title</th>
                <th className="py-2.5 px-3">District & ULB</th>
                <th className="py-2.5 px-3 text-center">Physical Progress</th>
                <th className="py-2.5 px-3 text-center">Financial Progress</th>
                <th className="py-2.5 px-3 text-center">Variance / Delay</th>
                <th className="py-2.5 px-3">Primary Delay Cause</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {projects.map(p => {
                const variance = p.physicalProgress - p.financialProgress;
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {p.id}
                    </td>
                    <td className="py-3 px-3 max-w-xs">
                      <div className="font-semibold text-slate-900 line-clamp-1">{p.name}</div>
                      <div className="text-[11px] text-slate-500">{p.category}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800 block">{p.district}</span>
                      <span className="text-[11px] text-slate-500">{p.ulb}</span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center space-x-1">
                        <div className="w-14 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              p.delayDays > 0 ? 'bg-amber-500' : 'bg-blue-700'
                            }`}
                            style={{ width: `${p.physicalProgress}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">{p.physicalProgress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center space-x-1">
                        <div className="w-14 bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${p.financialProgress}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-800 text-[11px]">{p.financialProgress}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      {p.delayDays > 0 ? (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                          +{p.delayDays} Days
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium text-[10px]">
                          On Schedule
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-600 text-[11px] max-w-xs">
                      {p.delayReason || '—'}
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition-colors"
                      >
                        <Edit3 className="w-3 h-3 inline mr-1" />
                        Update
                      </button>
                      <button
                        onClick={() => setSelectedProjectId(p.id)}
                        className="px-2.5 py-1 text-xs font-medium rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Update Modal */}
      {showEditModal && currentPrj && (
        <Modal
          isOpen={true}
          onClose={() => setShowEditModal(false)}
          title={`Update Progress: ${currentPrj.id}`}
          subtitle={currentPrj.name}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Physical Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editPhysical}
                  onChange={e => setEditPhysical(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded p-2 font-bold bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Financial Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={editFinancial}
                  onChange={e => setEditFinancial(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded p-2 font-bold bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Total Verified Expenditure (₹ Cr)</label>
                <input
                  type="number"
                  step="0.1"
                  value={editExpenditure}
                  onChange={e => setEditExpenditure(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded p-2 font-bold bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Delay in Schedule (Days)</label>
                <input
                  type="number"
                  min="0"
                  value={editDelayDays}
                  onChange={e => setEditDelayDays(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded p-2 font-bold bg-white text-rose-800"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Root Cause for Delay (if any)</label>
              <input
                type="text"
                value={editDelayReason}
                onChange={e => setEditDelayReason(e.target.value)}
                placeholder="e.g., Road cutting permission from R&B Dept pending"
                className="w-full border border-slate-300 rounded p-2 bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Field Observation / Progress Remarks</label>
              <textarea
                value={editRemarks}
                onChange={e => setEditRemarks(e.target.value)}
                rows={3}
                placeholder="Details of works certified in Measurement Book (MB)..."
                className="w-full border border-slate-300 rounded p-2 bg-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644]"
              >
                Save Official Progress Record
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
