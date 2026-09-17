import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { RFPRecord, BidRecord, ProjectCategory } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Modal } from '../common/Modal';
import {
  FileText,
  Plus,
  Calendar,
  CheckCircle2,
  Users,
  Award,
  AlertCircle,
  Eye,
  IndianRupee,
  FileCheck
} from 'lucide-react';

export const RfpManagement: React.FC = () => {
  const {
    rfps,
    projects,
    createRfp,
    evaluateBid,
    awardContractFromRfp,
    canPerformAction
  } = useApp();

  const [selectedRfp, setSelectedRfp] = useState<RFPRecord | null>(rfps[0] || null);

  // Create RFP Modal State (Demo Scenario 3)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRfpProjectId, setNewRfpProjectId] = useState(projects[0]?.id || '');
  const [newRfpTitle, setNewRfpTitle] = useState('');
  const [newRfpCost, setNewRfpCost] = useState(45.0);
  const [newRfpDeadline, setNewRfpDeadline] = useState('2025-04-25');
  const [newRfpPreBid, setNewRfpPreBid] = useState('2025-04-05');

  // Bid Evaluation Modal (Demo Scenario 5)
  const [evaluatingBid, setEvaluatingBid] = useState<BidRecord | null>(null);
  const [evalStatus, setEvalStatus] = useState<'L1 (Preferred)' | 'L2' | 'Disqualified' | 'Technically Qualified'>('L1 (Preferred)');
  const [evalRemarks, setEvalRemarks] = useState('');

  // Award Contract Modal (Demo Scenario 6)
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [awardContractor, setAwardContractor] = useState('');
  const [awardValue, setAwardValue] = useState(0);

  // Workflow steps
  const rfpSteps = [
    'RFP Draft',
    'Internal Review',
    'Approved',
    'Published',
    'Bids Received',
    'Evaluation',
    'Award Recommendation',
    'Awarded'
  ];

  const handleCreateRfpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === newRfpProjectId);
    const created = createRfp({
      projectId: newRfpProjectId,
      projectName: prj ? prj.name : 'Urban Infrastructure Scheme',
      title: newRfpTitle || `Tender for ${prj ? prj.name : 'Infrastructure Works'}`,
      estimatedCost: Number(newRfpCost),
      category: prj?.category || 'Urban Roads & Bridges',
      submissionDeadline: newRfpDeadline,
      preBidMeetingDate: newRfpPreBid
    });
    setShowCreateModal(false);
    setSelectedRfp(created);
  };

  const handleSaveBidEvaluation = () => {
    if (selectedRfp && evaluatingBid) {
      evaluateBid(selectedRfp.id, evaluatingBid.id, evalStatus, evalRemarks);
      setEvaluatingBid(null);
      setEvalRemarks('');
      // update selectedRfp reference
      const updated = rfps.find(r => r.id === selectedRfp.id);
      if (updated) setSelectedRfp(updated);
    }
  };

  const handleConfirmAward = () => {
    if (selectedRfp && awardContractor && awardValue > 0) {
      awardContractFromRfp(selectedRfp.id, awardContractor, awardValue);
      setShowAwardModal(false);
      const updated = rfps.find(r => r.id === selectedRfp.id);
      if (updated) setSelectedRfp(updated);
    }
  };

  const currentRfpIndex = selectedRfp ? rfpSteps.indexOf(selectedRfp.status) : 0;

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="RFP & Tender Management" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">RFP & Tender Procurement Management</h2>
          <p className="text-xs text-slate-600">
            e-Procurement portal integration, technical evaluation, bid opening and contract award recommendation
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#092644] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1" />
          Create New RFP
        </button>
      </div>

      {/* Main Layout: Left RFP List & Right Selected RFP Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: RFP Directory */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Procurement Notices ({rfps.length})
            </h3>
            <span className="text-[11px] text-slate-500">e-Tendering Live</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[700px]">
            {rfps.map(rfp => (
              <div
                key={rfp.id}
                onClick={() => setSelectedRfp(rfp)}
                className={`p-3.5 cursor-pointer text-xs transition-colors hover:bg-slate-50 ${
                  selectedRfp?.id === rfp.id ? 'bg-blue-50/70 border-l-4 border-blue-800' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] font-bold text-blue-900">{rfp.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rfp.status === 'Awarded'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rfp.status === 'Evaluation'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {rfp.status}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 line-clamp-2 leading-snug">{rfp.title}</h4>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-bold text-slate-700">₹ {rfp.estimatedCost.toFixed(1)} Cr</span>
                  <span>{rfp.bids.length} Bids Received</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Active RFP Comprehensive Master View */}
        {selectedRfp ? (
          <div className="lg:col-span-2 space-y-4">
            {/* Header Card & Workflow Stepper */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-xs mb-1">
                  <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {selectedRfp.id}
                  </span>
                  <span className="text-slate-500">&bull;</span>
                  <span className="font-medium text-slate-700">{selectedRfp.category}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">{selectedRfp.title}</h3>
                <p className="text-xs text-slate-600 mt-0.5">Linked Scheme: {selectedRfp.projectName}</p>
              </div>

              {/* RFP Dummy Workflow Stepper (Requirement D) */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Tender Stage Progression:
                </div>
                <div className="flex items-center space-x-1 overflow-x-auto pb-1 text-[10px]">
                  {rfpSteps.map((step, idx) => {
                    const isPassed = idx < currentRfpIndex;
                    const isCurrent = idx === currentRfpIndex;
                    return (
                      <div key={step} className="flex items-center flex-shrink-0">
                        <span
                          className={`px-2 py-1 rounded font-semibold whitespace-nowrap ${
                            isCurrent
                              ? 'bg-blue-800 text-white shadow-2xs'
                              : isPassed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          {isPassed ? '✓ ' : `${idx + 1}. `}
                          {step}
                        </span>
                        {idx < rfpSteps.length - 1 && (
                          <span className="mx-1 text-slate-400">&rarr;</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tender Parameters Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-slate-100 pt-3">
                <div>
                  <span className="text-slate-500 block">Estimated Cost</span>
                  <span className="font-bold text-slate-800 text-sm">₹ {selectedRfp.estimatedCost.toFixed(2)} Cr</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tender Fee / EMD</span>
                  <span className="font-medium text-slate-800">
                    ₹ {selectedRfp.tenderFee} / ₹ {(selectedRfp.emdAmount / 100000).toFixed(1)} L
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Pre-Bid Meeting</span>
                  <span className="font-medium text-slate-800">{selectedRfp.preBidMeetingDate}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Submission Deadline</span>
                  <span className="font-semibold text-rose-800">{selectedRfp.submissionDeadline}</span>
                </div>
              </div>

              {/* Eligibility Criteria & Committee */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs border-t border-slate-100 pt-3">
                <div>
                  <span className="font-bold text-slate-800 uppercase text-[11px] block mb-1">
                    Eligibility & Prequalification Criteria:
                  </span>
                  <ul className="list-disc pl-4 text-slate-600 space-y-0.5 text-[11px]">
                    {selectedRfp.eligibilityCriteria.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-bold text-slate-800 uppercase text-[11px] block mb-1">
                    Evaluation Committee Members:
                  </span>
                  <ul className="list-disc pl-4 text-slate-600 space-y-0.5 text-[11px]">
                    {selectedRfp.evaluationCommittee.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Submitted Bids & Evaluation Board (Demo Scenarios 4, 5, 6) */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Submitted Bids & Comparative Statement ({selectedRfp.bids.length})
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Technical evaluation score + financial bid quotes
                  </p>
                </div>

                {selectedRfp.status === 'Award Recommendation' && (
                  <button
                    onClick={() => {
                      const l1 = selectedRfp.bids.find(b => b.status === 'L1 (Preferred)');
                      if (l1) {
                        setAwardContractor(l1.bidderName);
                        setAwardValue(l1.financialBidAmount);
                        setShowAwardModal(true);
                      }
                    }}
                    className="px-3 py-1 text-xs font-semibold rounded bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs flex items-center"
                  >
                    <Award className="w-3.5 h-3.5 mr-1" /> Award Contract to L1
                  </button>
                )}
              </div>

              {selectedRfp.bids.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  <Calendar className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                  Notice is actively published. Bids are under submission deadline.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">Bidder Consortium</th>
                        <th className="py-2.5 px-3 text-center">Tech Score (100)</th>
                        <th className="py-2.5 px-3 text-right">Financial Bid</th>
                        <th className="py-2.5 px-3 text-center">Eligibility</th>
                        <th className="py-2.5 px-3 text-center">Evaluation Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedRfp.bids.map(bid => (
                        <tr key={bid.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-slate-900 block">{bid.bidderName}</span>
                            <span className="font-mono text-[10px] text-slate-500">
                              Reg: {bid.bidderRegistrationNo} &bull; Submitted {bid.bidSubmissionDate}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                            {bid.technicalScore.toFixed(1)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                            ₹ {bid.financialBidAmount.toFixed(2)} Cr
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                bid.eligibilityPassed
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {bid.eligibilityPassed ? 'Passed' : 'Failed'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                bid.status === 'L1 (Preferred)'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : bid.status === 'Disqualified'
                                  ? 'bg-rose-100 text-rose-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {bid.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                setEvaluatingBid(bid);
                                setEvalStatus(bid.status as any);
                                setEvalRemarks(bid.evaluatorRemarks || '');
                              }}
                              className="px-2 py-1 text-xs rounded border border-blue-700 text-blue-800 hover:bg-blue-50 font-medium"
                            >
                              Evaluate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* MODAL 1: Create New RFP (Demo Scenario 3) */}
      {showCreateModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowCreateModal(false)}
          title="Float New Notice Inviting Tender (RFP)"
          subtitle="Formulate e-procurement tender for sanctioned project"
        >
          <form onSubmit={handleCreateRfpSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Approved Project Scheme</label>
              <select
                value={newRfpProjectId}
                onChange={e => setNewRfpProjectId(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 bg-white font-medium"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.name} (₹ {p.approvedCost} Cr)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tender Title</label>
              <input
                type="text"
                required
                value={newRfpTitle}
                onChange={e => setNewRfpTitle(e.target.value)}
                placeholder="e.g., EPC Tender for Design, Build & Commissioning..."
                className="w-full border border-slate-300 rounded p-2 bg-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Estimated Value (₹ Cr)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newRfpCost}
                  onChange={e => setNewRfpCost(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded p-2 font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Pre-Bid Meeting Date</label>
                <input
                  type="date"
                  value={newRfpPreBid}
                  onChange={e => setNewRfpPreBid(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Submission Deadline</label>
                <input
                  type="date"
                  value={newRfpDeadline}
                  onChange={e => setNewRfpDeadline(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644]"
              >
                Publish RFP
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* MODAL 2: Evaluate Bid Modal (Demo Scenario 5) */}
      {evaluatingBid && (
        <Modal
          isOpen={true}
          onClose={() => setEvaluatingBid(null)}
          title={`Evaluate Bid: ${evaluatingBid.bidderName}`}
          subtitle={`Quoted: ₹ ${evaluatingBid.financialBidAmount} Cr | Tech Score: ${evaluatingBid.technicalScore}`}
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Evaluation Outcome</label>
              <select
                value={evalStatus}
                onChange={e => setEvalStatus(e.target.value as any)}
                className="w-full border border-slate-300 rounded p-2 bg-white font-bold"
              >
                <option value="L1 (Preferred)">L1 (Lowest Responsive Bidder / Recommended)</option>
                <option value="L2">L2 (Second Lowest)</option>
                <option value="Technically Qualified">Technically Qualified</option>
                <option value="Disqualified">Disqualified (Non-Responsive)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Committee Scrutiny Remarks</label>
              <textarea
                value={evalRemarks}
                onChange={e => setEvalRemarks(e.target.value)}
                rows={3}
                placeholder="Enter evaluation notes regarding commercial responsiveness, past performance and rates..."
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setEvaluatingBid(null)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveBidEvaluation}
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644]"
              >
                Endorse Evaluation
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: Award Contract Modal (Demo Scenario 6) */}
      {showAwardModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowAwardModal(false)}
          title="Issue Work Order & Award Contract"
          subtitle={`RFP: ${selectedRfp?.id}`}
        >
          <div className="space-y-3 text-xs">
            <div className="bg-blue-50 p-3 rounded border border-blue-200 text-blue-900">
              <p className="font-semibold mb-1">Recommendation for Award Verification:</p>
              <p className="text-[11px]">
                Awarding work order generates an immutable contract record, reserves performance security bank guarantee obligations, and moves project to execution state.
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Selected Contractor (L1)</label>
              <input
                type="text"
                value={awardContractor}
                onChange={e => setAwardContractor(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 font-bold bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Final Contract Value (₹ Cr)</label>
              <input
                type="number"
                value={awardValue}
                onChange={e => setAwardValue(Number(e.target.value))}
                className="w-full border border-slate-300 rounded p-2 font-bold font-mono bg-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowAwardModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAward}
                className="px-4 py-1.5 rounded bg-emerald-700 text-white font-semibold hover:bg-emerald-800"
              >
                Execute Work Order & Sign Contract
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
