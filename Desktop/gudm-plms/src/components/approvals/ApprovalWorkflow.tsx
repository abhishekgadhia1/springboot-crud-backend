import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ApprovalRecord, WorkflowAction } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Modal } from '../common/Modal';
import {
  CheckSquare,
  CheckCircle2,
  XCircle,
  RotateCcw,
  HelpCircle,
  Forward,
  Clock,
  User,
  IndianRupee,
  FileCheck,
  Send
} from 'lucide-react';

export const ApprovalWorkflow: React.FC = () => {
  const { approvals, processApproval, setSelectedProjectId } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRecord | null>(null);
  const [actionType, setActionType] = useState<WorkflowAction>('Approve');
  const [actionRemarks, setActionRemarks] = useState('');
  const [forwardOfficer, setForwardOfficer] = useState('Er. S. M. Patel (Chief Engineer)');

  const pendingApprovals = approvals.filter(a => a.status === 'Pending');
  const pastApprovals = approvals.filter(a => a.status !== 'Pending');

  const handleOpenAction = (approval: ApprovalRecord, action: WorkflowAction) => {
    setSelectedApproval(approval);
    setActionType(action);
    setActionRemarks('');
  };

  const handleConfirmAction = () => {
    if (selectedApproval) {
      processApproval(
        selectedApproval.id,
        actionType,
        actionRemarks || `Action executed: ${actionType}`,
        actionType === 'Forward' ? forwardOfficer : undefined
      );
      setSelectedApproval(null);
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="Workflow & Approvals" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Departmental Workflow & Electronic Sign-off Inbox</h2>
          <p className="text-xs text-slate-600">
            Administrative Approvals (AS), Technical Sanctions (TS), Tender Awards and Running Account Bill clearances
          </p>
        </div>

        <div className="flex space-x-1 bg-slate-100 p-0.5 rounded border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              activeTab === 'pending'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Actions ({pendingApprovals.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1 rounded font-semibold transition-colors ${
              activeTab === 'history'
                ? 'bg-white text-blue-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Historical Approvals ({pastApprovals.length})
          </button>
        </div>
      </div>

      {/* Approvals Inbox Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            {activeTab === 'pending' ? 'Active Approval Queue' : 'Disposed Workflow Log'}
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">Digital e-File Registry</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E355C] text-white uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Workflow ID</th>
                <th className="py-2.5 px-3">Subject / Approval Type</th>
                <th className="py-2.5 px-3">Target Project Scheme</th>
                <th className="py-2.5 px-3 text-right">Sanction Amount</th>
                <th className="py-2.5 px-3">Submitted By & Date</th>
                <th className="py-2.5 px-3">Current Custody</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Official Decision</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(activeTab === 'pending' ? pendingApprovals : pastApprovals).length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-slate-500">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
                    No files found in this inbox view.
                  </td>
                </tr>
              ) : (
                (activeTab === 'pending' ? pendingApprovals : pastApprovals).map(item => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{item.id}</td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <span className="font-bold text-slate-900 block">{item.approvalType}</span>
                      <span className="text-[11px] text-slate-500">Due: {item.dueDate}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 max-w-xs line-clamp-1">
                      {item.projectName}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {item.amount ? `₹ ${item.amount.toFixed(2)} Cr` : '—'}
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-slate-600">
                      <div>{item.submittedBy}</div>
                      <div className="text-[10px] text-slate-400">{item.submittedDate}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] font-semibold text-slate-700">
                      {item.currentApproverOfficer}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : item.status === 'Pending'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      {item.status === 'Pending' ? (
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => handleOpenAction(item, 'Approve')}
                            className="px-2 py-1 bg-emerald-600 text-white rounded text-[11px] font-bold hover:bg-emerald-700"
                            title="Endorse & Approve"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleOpenAction(item, 'Reject')}
                            className="px-2 py-1 bg-rose-600 text-white rounded text-[11px] font-bold hover:bg-rose-700"
                            title="Reject Proposal"
                          >
                            Reject
                          </button>
                          <button
                            onClick={() => handleOpenAction(item, 'Forward')}
                            className="px-2 py-1 bg-slate-100 border border-slate-300 text-slate-700 rounded text-[11px] font-medium hover:bg-slate-200"
                            title="Forward File"
                          >
                            Forward
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500 italic">Disposed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Process Approval Action (Demo Scenario 11) */}
      {selectedApproval && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedApproval(null)}
          title={`Action on Workflow File: ${selectedApproval.id}`}
          subtitle={`${selectedApproval.approvalType} &bull; ${selectedApproval.projectName}`}
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <div className="flex items-center justify-between text-slate-600">
                <span>Subject: <strong>{selectedApproval.approvalType}</strong></span>
                {selectedApproval.amount && (
                  <span>Quantum: <strong>₹ {selectedApproval.amount} Cr</strong></span>
                )}
              </div>
              <p className="text-slate-500 text-[11px] mt-1">Submitted by: {selectedApproval.submittedBy}</p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Action Decision:</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {(['Approve', 'Reject', 'Send back', 'Request clarification', 'Forward'] as WorkflowAction[]).map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setActionType(a)}
                    className={`py-1.5 px-2 rounded text-center font-bold text-xs border transition-colors ${
                      actionType === a
                        ? a === 'Approve'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : a === 'Reject'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-blue-800 text-white border-blue-800'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            {actionType === 'Forward' && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Forward File to Officer:</label>
                <select
                  value={forwardOfficer}
                  onChange={e => setForwardOfficer(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 bg-white"
                >
                  <option value="Er. S. M. Patel (Chief Engineer)">Er. S. M. Patel (Chief Engineer)</option>
                  <option value="Mission Director (IAS)">Mission Director, GUDM (IAS)</option>
                  <option value="Chief Accounts Officer (Finance)">Chief Accounts Officer (Finance)</option>
                  <option value="Executive Committee / Board">Executive Committee / Board</option>
                </select>
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Departmental Endorsement Note:</label>
              <textarea
                value={actionRemarks}
                onChange={e => setActionRemarks(e.target.value)}
                rows={3}
                placeholder="Enter official concurrence, query or reservation..."
                className="w-full border border-slate-300 rounded p-2 bg-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setSelectedApproval(null)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644]"
              >
                Sign & Submit Decision
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
