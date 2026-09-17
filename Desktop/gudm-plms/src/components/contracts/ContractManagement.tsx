import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ContractRecord } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Modal } from '../common/Modal';
import {
  Briefcase,
  Calendar,
  IndianRupee,
  Shield,
  FileCheck,
  Plus,
  AlertTriangle,
  Building,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const ContractManagement: React.FC = () => {
  const { contracts, updateContractVariation } = useApp();
  const [selectedContract, setSelectedContract] = useState<ContractRecord | null>(contracts[0] || null);

  // Variation / EOT Modal
  const [showVariationModal, setShowVariationModal] = useState(false);
  const [variationCost, setVariationCost] = useState(0);
  const [variationTimeDays, setVariationTimeDays] = useState(0);
  const [variationReason, setVariationReason] = useState('');

  const handleApplyVariation = () => {
    if (selectedContract) {
      updateContractVariation(
        selectedContract.id,
        Number(variationCost),
        Number(variationTimeDays),
        variationReason || 'Departmental scope adjustment approved.'
      );
      setShowVariationModal(false);
      setVariationCost(0);
      setVariationTimeDays(0);
      setVariationReason('');
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="Contracts Management" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Contract & Work Order Governance</h2>
          <p className="text-xs text-slate-600">
            Performance security guarantees, milestone payment schedules, variation orders, and Extensions of Time (EOT)
          </p>
        </div>
      </div>

      {/* Contract Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Column: Contract Directory */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Awarded Contracts ({contracts.length})
            </h3>
            <span className="text-[11px] text-slate-500">Active Agreements</span>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[650px]">
            {contracts.map(cnt => (
              <div
                key={cnt.id}
                onClick={() => setSelectedContract(cnt)}
                className={`p-3.5 cursor-pointer text-xs transition-colors hover:bg-slate-50 ${
                  selectedContract?.id === cnt.id ? 'bg-blue-50/70 border-l-4 border-blue-800' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[11px] font-bold text-blue-900">{cnt.id}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      cnt.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {cnt.status}
                  </span>
                </div>
                <h4 className="font-semibold text-slate-900 line-clamp-1">{cnt.contractorName}</h4>
                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{cnt.projectName}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">₹ {cnt.contractValue.toFixed(2)} Cr</span>
                  <span>WO: {cnt.workOrderNo}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Selected Contract Detailed File */}
        {selectedContract ? (
          <div className="lg:col-span-2 space-y-4">
            {/* Master Summary Card */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                <div>
                  <div className="flex items-center space-x-2 text-xs mb-1">
                    <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {selectedContract.id}
                    </span>
                    <span className="text-slate-400">&bull;</span>
                    <span className="font-semibold text-slate-700">WO Date: {selectedContract.workOrderDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{selectedContract.contractorName}</h3>
                  <p className="text-xs text-slate-600">Scheme: {selectedContract.projectName}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowVariationModal(true)}
                    className="px-3 py-1.5 text-xs font-semibold rounded bg-amber-600 text-white hover:bg-amber-700 transition-colors flex items-center shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Record Variation / EOT
                  </button>
                </div>
              </div>

              {/* Financial & Statutory Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Original Contract Value</span>
                  <span className="font-bold text-slate-900 text-sm">
                    ₹ {selectedContract.originalContractValue.toFixed(2)} Cr
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Current Contract Value</span>
                  <span className="font-bold text-blue-900 text-sm">
                    ₹ {selectedContract.contractValue.toFixed(2)} Cr
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Performance Security (PBG)</span>
                  <span className="font-semibold text-slate-800">
                    ₹ {selectedContract.performanceSecurityAmount.toFixed(2)} Cr
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Bank Guarantee Validity</span>
                  <span className="font-semibold text-emerald-800">
                    {selectedContract.performanceSecurityExpiry}
                  </span>
                </div>
              </div>

              {/* Contractor Information & Contact */}
              <div className="text-xs space-y-1 pt-1">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px] block">
                  Contractor Entity Details & GSTIN:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Registered Address:</span>
                    <span>{selectedContract.contractorAddress}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">GSTIN / Registration:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedContract.contractorGst}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Authorised Contact:</span>
                    <span>{selectedContract.contractorContact}</span>
                  </div>
                </div>
              </div>

              {/* Milestones & Payment Terms */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Stipulated Milestones & Linked Disbursements
                </h4>
                <div className="space-y-1.5 text-xs">
                  {selectedContract.milestones.map((m, idx) => (
                    <div
                      key={m.id}
                      className="p-2 bg-slate-50 rounded border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-700">{idx + 1}.</span>
                        <div>
                          <span className="font-semibold text-slate-900 block">{m.title}</span>
                          <span className="text-[11px] text-slate-500">
                            Planned Target: {m.targetDate} &bull; Payment linked: {m.paymentPercentage}% of contract
                          </span>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : m.status === 'Under Way'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Variation Orders & EOT Ledger */}
              <div className="pt-2 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Approved Variation Orders & Time Extensions (EOT)
                </h4>
                {selectedContract.variationOrders.length === 0 ? (
                  <p className="text-slate-500 text-xs italic bg-slate-50 p-2.5 rounded">
                    No variation orders or time extensions granted to date. Execution within original mandate.
                  </p>
                ) : (
                  <div className="space-y-2 text-xs">
                    {selectedContract.variationOrders.map(vo => (
                      <div key={vo.id} className="p-2.5 bg-amber-50/70 rounded border border-amber-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-amber-900">{vo.id}</span>
                          <span className="text-slate-500 text-[11px]">Approved on: {vo.date}</span>
                        </div>
                        <p className="text-slate-800 font-medium">{vo.reason}</p>
                        <div className="flex items-center space-x-4 text-[11px] text-slate-600 font-semibold">
                          <span>Cost Impact: +₹{vo.additionalCost.toFixed(2)} Cr</span>
                          <span>Time Impact: +{vo.additionalDays} Days</span>
                          <span className="text-emerald-800">Status: {vo.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* MODAL: Record Variation / EOT */}
      {showVariationModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowVariationModal(false)}
          title="Sanction Variation Order / Extension of Time (EOT)"
          subtitle={`Contract ID: ${selectedContract?.id}`}
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Additional Cost Outlay (₹ Cr)</label>
              <input
                type="number"
                step="0.1"
                value={variationCost}
                onChange={e => setVariationCost(Number(e.target.value))}
                placeholder="0.0"
                className="w-full border border-slate-300 rounded p-2 font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Extension of Time (Days)</label>
              <input
                type="number"
                value={variationTimeDays}
                onChange={e => setVariationTimeDays(Number(e.target.value))}
                placeholder="0"
                className="w-full border border-slate-300 rounded p-2 font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Technical Justification / Board Resolution</label>
              <textarea
                value={variationReason}
                onChange={e => setVariationReason(e.target.value)}
                rows={3}
                placeholder="Specify reasons: statutory clearance delay, utility relocation, site topography modification..."
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowVariationModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyVariation}
                className="px-4 py-1.5 rounded bg-amber-600 text-white font-semibold hover:bg-amber-700"
              >
                Sanction Variation Order
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
