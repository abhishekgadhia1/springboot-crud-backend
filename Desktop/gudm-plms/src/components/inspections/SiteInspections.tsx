import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SiteInspectionRecord } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Modal } from '../common/Modal';
import {
  ClipboardCheck,
  Plus,
  Calendar,
  User,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Search
} from 'lucide-react';

export const SiteInspections: React.FC = () => {
  const { inspections, projects, addSiteInspection, setSelectedProjectId } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProjectId, setFormProjectId] = useState(projects[0]?.id || '');
  const [officer, setOfficer] = useState('Er. H. P. Trivedi (Chief Technical Examiner)');
  const [location, setLocation] = useState('Site Chainage Km 04+200');
  const [status, setStatus] = useState<'Satisfactory' | 'Needs Improvement' | 'Critical Issues Found'>('Satisfactory');
  const [qualityObs, setQualityObs] = useState('Concrete cube test reports examined; 28-day characteristic strength complies with M25 specification.');
  const [safetyObs, setSafetyObs] = useState('Deep trench excavation barricaded with retro-reflective cautionary signboards.');
  const [defects, setDefects] = useState('');
  const [instructions, setInstructions] = useState('Ensure continuous curing for minimum 14 days.');

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === selectedProjectId);
    addSiteInspection({
      projectId: selectedProjectId,
      projectName: prj ? prj.name : 'Urban Scheme',
      inspectionOfficer: officer,
      siteLocation: location,
      workStatus: status,
      qualityObservations: qualityObs,
      safetyObservations: safetyObs,
      defectsIdentified: defects ? [defects] : [],
      instructionsToContractor: instructions
    });
    setShowAddModal(false);
    setDefects('');
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="Site Inspections" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Quality Assurance & Site Inspection Logs</h2>
          <p className="text-xs text-slate-600">
            Technical audits, quality control test verifications, safety compliance checks and contractor rectification orders
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#092644] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1" />
          Log New Site Inspection
        </button>
      </div>

      {/* Inspections Feed */}
      <div className="space-y-3">
        {inspections.map(insp => (
          <div key={insp.id} className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 text-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
              <div>
                <div className="flex items-center space-x-2 mb-0.5">
                  <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {insp.id}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      insp.workStatus === 'Satisfactory'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {insp.workStatus}
                  </span>
                  <span className="text-slate-400">&bull;</span>
                  <span className="text-slate-500 font-medium">Date: {insp.inspectionDate}</span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{insp.projectName}</h4>
                <div className="flex items-center space-x-3 text-[11px] text-slate-500 mt-0.5">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1 text-slate-400" />
                    Officer: {insp.inspectionOfficer}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                    {insp.siteLocation}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedProjectId(insp.projectId)}
                className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold self-start"
              >
                Project File &rarr;
              </button>
            </div>

            {/* Observations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-50/70 p-3 rounded border border-slate-200">
              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">
                  Quality Observations:
                </span>
                <p className="text-slate-700">{insp.qualityObservations}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">
                  Safety & Environment:
                </span>
                <p className="text-slate-700">{insp.safetyObservations}</p>
              </div>
            </div>

            {/* Defects & Contractor Instructions */}
            {(insp.defectsIdentified.length > 0 || insp.instructionsToContractor) && (
              <div className="bg-amber-50 p-2.5 rounded border border-amber-200 text-amber-950 space-y-1">
                {insp.defectsIdentified.length > 0 && (
                  <div className="flex items-start space-x-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-[11px]">Defects Identified: </span>
                      <span className="text-[11px]">{insp.defectsIdentified.join('; ')}</span>
                    </div>
                  </div>
                )}
                {insp.instructionsToContractor && (
                  <div className="text-[11px]">
                    <span className="font-bold">Instructions to Contractor: </span>
                    {insp.instructionsToContractor}
                  </div>
                )}
              </div>
            )}

            {/* Photo Evidences */}
            {insp.photographs && insp.photographs.length > 0 && (
              <div>
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block mb-1.5">
                  Inspection Photographic Evidences:
                </span>
                <div className="flex gap-2 overflow-x-auto">
                  {insp.photographs.map((p, i) => (
                    <div key={i} className="rounded border border-slate-200 overflow-hidden w-44 flex-shrink-0 bg-slate-50">
                      <img
                        src={p.url}
                        alt={p.caption}
                        className="w-full h-24 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="p-1.5 text-[10px] text-slate-600 line-clamp-2" title={p.caption}>
                        {p.caption}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* MODAL: Log New Inspection */}
      {showAddModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowAddModal(false)}
          title="Record Official Site Inspection"
          subtitle="Submit technical observation report into official quality ledger"
          maxWidth="2xl"
        >
          <form onSubmit={handleCreateInspection} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Target Scheme</label>
                <select
                  value={selectedProjectId}
                  onChange={e => setFormProjectId(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 bg-white"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.id} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Work Quality Status</label>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value as any)}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-bold"
                >
                  <option value="Satisfactory">Satisfactory</option>
                  <option value="Needs Improvement">Needs Improvement</option>
                  <option value="Critical Issues Found">Critical Issues Found</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Inspection Officer</label>
                <input
                  type="text"
                  value={officer}
                  onChange={e => setOfficer(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 bg-white"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Location / Chainage</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quality Observations</label>
              <textarea
                value={qualityObs}
                onChange={e => setQualityObs(e.target.value)}
                rows={2}
                className="w-full border border-slate-300 rounded p-2 bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Safety & Labor Protocol Observations</label>
              <textarea
                value={safetyObs}
                onChange={e => setSafetyObs(e.target.value)}
                rows={2}
                className="w-full border border-slate-300 rounded p-2 bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Specific Defects Identified (if any)</label>
              <input
                type="text"
                value={defects}
                onChange={e => setDefects(e.target.value)}
                placeholder="e.g., Minor honeycomb observed on pier column 3"
                className="w-full border border-slate-300 rounded p-2 bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mandatory Instructions to Contractor</label>
              <input
                type="text"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                placeholder="Rectification deadline and testing instructions..."
                className="w-full border border-slate-300 rounded p-2 bg-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644]"
              >
                Endorse & File Inspection
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
