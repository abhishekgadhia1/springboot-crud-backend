import React, { useState } from 'react';
import { useApp, ALL_LIFECYCLE_STAGES } from '../../context/AppContext';
import { ProjectMaster, ProjectStage } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import {
  Calendar,
  IndianRupee,
  MapPin,
  Building,
  User,
  Shield,
  FileText,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Upload,
  Plus,
  History,
  Briefcase,
  AlertOctagon,
  FileCheck
} from 'lucide-react';

interface ProjectDetailModalProps {
  project: ProjectMaster;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const {
    currentRole,
    moveProjectStage,
    updateProjectProgress,
    addSiteInspection,
    addIssueRisk,
    submitApproval,
    uploadDocument,
    completeProject,
    inspections,
    issuesRisks,
    documents,
    approvals,
    canPerformAction
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'delivery' | 'inspections' | 'financials' | 'issues' | 'documents' | 'audit'
  >('overview');

  // Sub-modal states for the 15 demo scenarios
  const [showStageModal, setShowStageModal] = useState(false);
  const [selectedNextStage, setSelectedNextStage] = useState<ProjectStage>(project.currentStage);
  const [stageRemarks, setStageRemarks] = useState('');

  const [showProgressModal, setShowProgressModal] = useState(false);
  const [newPhysical, setNewPhysical] = useState(project.physicalProgress);
  const [newFinancial, setNewFinancial] = useState(project.financialProgress);
  const [newExpenditure, setNewExpenditure] = useState(project.expenditure);
  const [newDelayDays, setNewDelayDays] = useState(project.delayDays);
  const [newDelayReason, setNewDelayReason] = useState(project.delayReason || '');
  const [progressRemarks, setProgressRemarks] = useState('');

  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspOfficer, setInspOfficer] = useState('');
  const [inspLocation, setInspLocation] = useState(project.location);
  const [inspStatus, setInspStatus] = useState<'Satisfactory' | 'Needs Improvement' | 'Critical Issues Found'>('Satisfactory');
  const [inspQuality, setInspQuality] = useState('');
  const [inspSafety, setInspSafety] = useState('');
  const [inspDefects, setInspDefects] = useState('');
  const [inspInstructions, setInspInstructions] = useState('');

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueType, setIssueType] = useState<'Issue' | 'Risk'>('Issue');
  const [issueDesc, setIssueDesc] = useState('');
  const [issueCat, setIssueCat] = useState<'Technical' | 'Land Acquisition' | 'Statutory Clearances' | 'Contractual' | 'Financial' | 'Environmental'>('Technical');
  const [issueSev, setIssueSev] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High');
  const [issueAction, setIssueAction] = useState('');

  const [showDocModal, setShowDocModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [docCategory, setDocCategory] = useState<any>('Administrative approval');
  const [docFile, setDocFile] = useState('Sanction_Letter.pdf');

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [appType, setAppType] = useState<any>('Administrative Approval (AS)');
  const [appAmount, setAppAmount] = useState(project.approvedCost);
  const [appRemarks, setAppRemarks] = useState('');

  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeRemarks, setCompleteRemarks] = useState('');

  // Associated project records
  const projectInspections = inspections.filter(i => i.projectId === project.id);
  const projectIssues = issuesRisks.filter(i => i.projectId === project.id);
  const projectDocuments = documents.filter(d => d.projectId === project.id);
  const projectApprovals = approvals.filter(a => a.projectId === project.id);

  // Stage index calculation
  const currentStageIndex = ALL_LIFECYCLE_STAGES.indexOf(project.currentStage);

  // Handle stage transition
  const handleStageTransition = () => {
    moveProjectStage(project.id, selectedNextStage, stageRemarks);
    setShowStageModal(false);
    setStageRemarks('');
  };

  // Handle progress update
  const handleProgressUpdate = () => {
    updateProjectProgress(
      project.id,
      Number(newPhysical),
      Number(newFinancial),
      Number(newExpenditure),
      Number(newDelayDays),
      newDelayReason,
      progressRemarks
    );
    setShowProgressModal(false);
  };

  // Handle new inspection
  const handleAddInspection = () => {
    addSiteInspection({
      projectId: project.id,
      projectName: project.name,
      inspectionOfficer: inspOfficer || `Inspection Officer (${currentRole})`,
      siteLocation: inspLocation,
      workStatus: inspStatus,
      qualityObservations: inspQuality || 'Material density and concrete slump tested and passed.',
      safetyObservations: inspSafety || 'Safety signage and personal protection active.',
      defectsIdentified: inspDefects ? [inspDefects] : [],
      instructionsToContractor: inspInstructions || 'Rectify defect within 7 days.'
    });
    setShowInspectionModal(false);
    setActiveTab('inspections');
  };

  // Handle new issue
  const handleAddIssue = () => {
    addIssueRisk({
      projectId: project.id,
      projectName: project.name,
      type: issueType,
      category: issueCat,
      severity: issueSev,
      description: issueDesc || 'Coordination pending with local ULB authority.',
      correctiveAction: issueAction || 'Meeting requested with District Collector.'
    });
    setShowIssueModal(false);
    setActiveTab('issues');
  };

  // Handle document upload
  const handleUploadDoc = () => {
    uploadDocument({
      projectId: project.id,
      projectName: project.name,
      title: docTitle || 'Department Sanction Note',
      category: docCategory,
      fileName: docFile || 'Memo.pdf'
    });
    setShowDocModal(false);
    setActiveTab('documents');
  };

  // Handle submit approval
  const handleSubmitApproval = () => {
    submitApproval({
      projectId: project.id,
      projectName: project.name,
      approvalType: appType,
      amount: Number(appAmount),
      remarks: appRemarks || 'Submitted for departmental approval.'
    });
    setShowApprovalModal(false);
  };

  // Handle project completion
  const handleCompleteProject = () => {
    completeProject(project.id, completeRemarks || 'Joint completion certificate signed.');
    setShowCompleteModal(false);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Project Master: ${project.id}`}
      subtitle={`${project.name} | ${project.district}, Gujarat`}
      maxWidth="5xl"
    >
      <div className="space-y-6">
        {/* Top Summary Banner */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {project.id}
              </span>
              <StatusBadge status={project.currentStatus} />
              <StatusBadge risk={project.riskLevel} />
              <StatusBadge priority={project.priority} />
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">{project.name}</h2>
            <p className="text-xs text-slate-600 mt-0.5">{project.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedNextStage(
                  ALL_LIFECYCLE_STAGES[Math.min(currentStageIndex + 1, ALL_LIFECYCLE_STAGES.length - 1)]
                );
                setShowStageModal(true);
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#082440] transition-colors flex items-center shadow-xs"
            >
              Advance Stage <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>

            <button
              onClick={() => setShowProgressModal(true)}
              className="px-3 py-1.5 text-xs font-medium rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center"
            >
              <Activity className="w-3.5 h-3.5 mr-1 text-blue-700" />
              Update Progress
            </button>

            <button
              onClick={() => setShowApprovalModal(true)}
              className="px-3 py-1.5 text-xs font-medium rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center"
            >
              <FileCheck className="w-3.5 h-3.5 mr-1 text-amber-700" />
              Initiate Approval
            </button>

            {project.currentStatus !== 'Completed' && (
              <button
                onClick={() => setShowCompleteModal(true)}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-teal-700 text-white hover:bg-teal-800 transition-colors flex items-center shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                Mark Completed
              </button>
            )}
          </div>
        </div>

        {/* 18-STAGE LIFECYCLE STEPPER (Crucial Requirement C) */}
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center">
              <Shield className="w-3.5 h-3.5 mr-1.5 text-blue-800" />
              18-Stage Project Lifecycle Governance
            </h3>
            <span className="text-xs font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Current: Step {currentStageIndex + 1} of 18 &bull; {project.currentStage}
            </span>
          </div>

          <div className="overflow-x-auto pb-2">
            <div className="flex items-center min-w-[900px] space-x-1">
              {ALL_LIFECYCLE_STAGES.map((stg, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <div
                    key={stg}
                    className="flex-1 flex flex-col items-center text-center group cursor-pointer"
                    onClick={() => {
                      setSelectedNextStage(stg);
                      setShowStageModal(true);
                    }}
                    title={`Click to switch stage to: ${stg}`}
                  >
                    <div className="flex items-center w-full">
                      <div
                        className={`h-1 flex-1 ${
                          idx === 0 ? 'invisible' : isPassed || isCurrent ? 'bg-blue-700' : 'bg-slate-200'
                        }`}
                      />
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                          isCurrent
                            ? 'bg-blue-800 text-white ring-4 ring-blue-100 scale-110'
                            : isPassed
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 text-slate-500 border border-slate-300'
                        }`}
                      >
                        {isPassed ? '✓' : idx + 1}
                      </div>
                      <div
                        className={`h-1 flex-1 ${
                          idx === ALL_LIFECYCLE_STAGES.length - 1 ? 'invisible' : isPassed ? 'bg-blue-700' : 'bg-slate-200'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[9px] mt-1 leading-tight line-clamp-2 px-0.5 font-medium ${
                        isCurrent ? 'text-blue-900 font-bold' : isPassed ? 'text-slate-700' : 'text-slate-400'
                      }`}
                    >
                      {stg}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 flex space-x-4 text-xs font-semibold text-slate-600 overflow-x-auto">
          {[
            { id: 'overview', label: 'Master Details & WBS' },
            { id: 'delivery', label: 'Delivery & Gantt Timeline' },
            { id: 'inspections', label: `Site Inspections (${projectInspections.length})` },
            { id: 'financials', label: 'Finance & RA Bills' },
            { id: 'issues', label: `Issues & Risks (${projectIssues.length})` },
            { id: 'documents', label: `Documents (${projectDocuments.length})` },
            { id: 'audit', label: `Audit Trail (${project.auditTrail.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-2.5 px-1 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-800 text-blue-900 font-bold'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview & WBS Milestones */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white p-4 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-500 font-medium block">Category & Type</span>
                <span className="font-bold text-slate-800">{project.category}</span>
                <span className="text-slate-500 block text-[11px]">{project.type}</span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Jurisdiction (District & ULB)</span>
                <span className="font-bold text-slate-800">{project.district}</span>
                <span className="text-slate-500 block text-[11px]">{project.ulb}</span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Implementing Agency & Dept</span>
                <span className="font-bold text-slate-800">{project.implementingAgency}</span>
                <span className="text-slate-500 block text-[11px]">{project.department}</span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Project Manager</span>
                <span className="font-semibold text-slate-800 flex items-center">
                  <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {project.projectManager}
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Coordinates (GIS)</span>
                <span className="font-mono text-slate-700">
                  {project.coordinates.lat.toFixed(4)}° N, {project.coordinates.lng.toFixed(4)}° E
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Funding Source</span>
                <span className="font-semibold text-blue-900">{project.fundingSource}</span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Appointed Contractor</span>
                <span className="font-semibold text-slate-800 flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {project.contractor || 'Not Yet Awarded (In Tendering)'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Contract Reference</span>
                <span className="font-mono text-slate-700">
                  {project.contractId || 'Pending Contract Award'}
                </span>
              </div>

              <div>
                <span className="text-slate-500 font-medium block">Delay Tracking</span>
                {project.delayDays > 0 ? (
                  <span className="font-bold text-amber-800">
                    +{project.delayDays} Days ({project.delayReason || 'Reason documented'})
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold">On Schedule (0 Days Delay)</span>
                )}
              </div>
            </div>

            {/* Work Breakdown Structure Milestones Table */}
            <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Work Breakdown Structure (WBS) & Key Milestones
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">Weighted Delivery Schedule</span>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200 font-semibold">
                  <tr>
                    <th className="py-2 px-3">Milestone</th>
                    <th className="py-2 px-3 text-center">Weightage</th>
                    <th className="py-2 px-3">Planned Date</th>
                    <th className="py-2 px-3">Actual Date</th>
                    <th className="py-2 px-3">Deliverable Artifact</th>
                    <th className="py-2 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {project.milestones.map(m => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-800">
                        <span className="font-mono text-[10px] text-slate-500 mr-2">{m.id}</span>
                        {m.name}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-slate-700">{m.weightage}%</td>
                      <td className="py-2 px-3 text-slate-600">{m.plannedDate}</td>
                      <td className="py-2 px-3 text-slate-600">{m.actualDate || '—'}</td>
                      <td className="py-2 px-3 text-slate-600 text-[11px]">{m.deliverable}</td>
                      <td className="py-2 px-3 text-right">
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
        )}

        {/* Tab 2: Delivery & Gantt Timeline */}
        {activeTab === 'delivery' && (
          <div className="space-y-4 bg-white p-4 rounded-lg border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Gantt-Style Execution Schedule</h4>
                <p className="text-slate-500 text-[11px]">
                  Planned vs Actual milestone execution bars
                </p>
              </div>
              <div className="flex items-center space-x-3 text-[11px]">
                <span className="flex items-center">
                  <span className="w-3 h-2 bg-blue-800 rounded-xs mr-1" /> Achieved / Completed
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-2 bg-amber-500 rounded-xs mr-1" /> In Progress / Delay
                </span>
                <span className="flex items-center">
                  <span className="w-3 h-2 bg-slate-200 rounded-xs mr-1" /> Future Pending
                </span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {project.milestones.map((m, idx) => {
                const widthPct = m.weightage * 2.5;
                const offsetPct = idx * 18;
                return (
                  <div key={m.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-800 font-semibold">{m.name}</span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        {m.plannedDate} &bull; {m.weightage}% weight
                      </span>
                    </div>

                    <div className="relative h-6 bg-slate-100 rounded-md overflow-hidden flex items-center px-2">
                      <div
                        className={`h-4 rounded-sm transition-all duration-500 flex items-center px-2 text-[10px] text-white font-bold ${
                          m.status === 'Achieved'
                            ? 'bg-blue-800'
                            : m.status === 'In Progress'
                            ? 'bg-amber-500'
                            : 'bg-slate-300 text-slate-600'
                        }`}
                        style={{
                          marginLeft: `${offsetPct}%`,
                          width: `${Math.max(20, widthPct)}%`
                        }}
                      >
                        {m.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Site Inspections */}
        {activeTab === 'inspections' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Field Site Inspection Logs
              </h4>
              <button
                onClick={() => setShowInspectionModal(true)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#082440] transition-colors flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Log Site Inspection
              </button>
            </div>

            {projectInspections.length === 0 ? (
              <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
                No site inspections recorded for this project yet.
              </div>
            ) : (
              projectInspections.map(insp => (
                <div key={insp.id} className="bg-white p-4 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        {insp.id}
                      </span>
                      <span className="font-semibold text-slate-800">Date: {insp.inspectionDate}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          insp.workStatus === 'Satisfactory'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {insp.workStatus}
                      </span>
                    </div>
                    <span className="text-slate-500">Officer: {insp.inspectionOfficer}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100">
                    <div>
                      <span className="font-semibold text-slate-700 block">Quality Observations:</span>
                      <p className="text-slate-600">{insp.qualityObservations}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 block">Safety Observations:</span>
                      <p className="text-slate-600">{insp.safetyObservations}</p>
                    </div>
                  </div>

                  {insp.instructionsToContractor && (
                    <div className="bg-amber-50 p-2 rounded border border-amber-200 text-[11px] text-amber-900">
                      <span className="font-bold">Instructions to Contractor: </span>
                      {insp.instructionsToContractor}
                    </div>
                  )}

                  {insp.photographs && insp.photographs.length > 0 && (
                    <div className="pt-2">
                      <span className="font-semibold text-slate-700 text-[11px] block mb-1.5">
                        Site Photographs & Evidences:
                      </span>
                      <div className="flex gap-2 overflow-x-auto">
                        {insp.photographs.map((photo, i) => (
                          <div key={i} className="relative rounded overflow-hidden border border-slate-200 w-44 flex-shrink-0">
                            <img
                              src={photo.url}
                              alt={photo.caption}
                              className="w-full h-24 object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="p-1 bg-white text-[9px] text-slate-600 truncate" title={photo.caption}>
                              {photo.caption}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 4: Financials & RA Bills */}
        {activeTab === 'financials' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-lg border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 font-medium block">Approved Outlay</span>
                <span className="text-xl font-bold text-slate-900">₹ {project.approvedCost.toFixed(2)} Cr</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Total Expenditure Released</span>
                <span className="text-xl font-bold text-emerald-800">₹ {project.expenditure.toFixed(2)} Cr</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium block">Financial Progress</span>
                <span className="text-xl font-bold text-blue-900">{project.financialProgress}%</span>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200 p-4 text-xs">
              <h4 className="font-bold text-slate-800 mb-2 uppercase tracking-wider text-[11px]">
                Running Account (RA) Bills & Payment Track
              </h4>
              <p className="text-slate-500 text-[11px] mb-3">
                All bills processed through IFMS Gujarat integration with statutory 5% security retention.
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900">RA Bill #04 (Measurement Book Certified)</span>
                    <span className="text-slate-500 block text-[11px]">Passed on 2025-02-15 by Chief Accounts Officer</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-800">₹ 8.40 Cr</span>
                    <span className="block text-[10px] text-emerald-700 font-semibold">Cleared & Disbursed</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 bg-blue-50/50 rounded border border-blue-200">
                  <div>
                    <span className="font-bold text-blue-900">RA Bill #05 (Under Audit Verification)</span>
                    <span className="text-slate-500 block text-[11px]">Submitted on 2025-03-02 by Executive Engineer</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-800">₹ 12.40 Cr</span>
                    <span className="block text-[10px] text-amber-700 font-bold">Pending Approval</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Issues & Risks */}
        {activeTab === 'issues' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Project Risk & Issue Matrix
              </h4>
              <button
                onClick={() => setShowIssueModal(true)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#082440] transition-colors flex items-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Log Risk / Issue
              </button>
            </div>

            {projectIssues.length === 0 ? (
              <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
                No active issues or risks flagged for this scheme.
              </div>
            ) : (
              projectIssues.map(iss => (
                <div key={iss.id} className="bg-white p-3.5 rounded-lg border border-slate-200 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                        {iss.id}
                      </span>
                      <span className="font-bold text-slate-800">{iss.type}</span>
                      <span className="text-slate-500">&bull; {iss.category}</span>
                      <StatusBadge risk={iss.severity} size="sm" />
                    </div>
                    <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                      Status: {iss.status}
                    </span>
                  </div>

                  <p className="text-slate-800 font-medium">{iss.description}</p>
                  <div className="bg-slate-50 p-2 rounded text-[11px] text-slate-700">
                    <span className="font-semibold">Corrective Action / Mitigation: </span>
                    {iss.correctiveAction}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 6: Documents */}
        {activeTab === 'documents' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Official Sanctions & Project Repository
              </h4>
              <button
                onClick={() => setShowDocModal(true)}
                className="px-2.5 py-1 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#082440] transition-colors flex items-center"
              >
                <Upload className="w-3.5 h-3.5 mr-1" /> Upload Document
              </button>
            </div>

            {projectDocuments.length === 0 ? (
              <div className="bg-white p-8 rounded-lg border border-slate-200 text-center text-xs text-slate-500">
                No documents uploaded yet.
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 divide-y divide-slate-100 text-xs">
                {projectDocuments.map(doc => (
                  <div key={doc.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-slate-900 block">{doc.title}</span>
                        <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">{doc.category}</span>
                          <span>{doc.version}</span>
                          <span>&bull;</span>
                          <span>{doc.fileSize}</span>
                          <span>&bull;</span>
                          <span>By: {doc.uploadedBy} on {doc.uploadDate}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Simulated Download of: ${doc.fileName}`)}
                      className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 7: Read-Only Audit Trail (Requirement P) */}
        {activeTab === 'audit' && (
          <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h4 className="font-bold text-slate-800 text-sm flex items-center">
                  <History className="w-4 h-4 mr-1.5 text-blue-800" />
                  Read-Only Compliance Audit Trail
                </h4>
                <p className="text-slate-500 text-[11px]">
                  Immutable ledger tracking all lifecycle stage transitions, sanctions and approvals
                </p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                System Hash Verified
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {project.auditTrail.map(entry => (
                <div key={entry.id} className="py-2.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">{entry.action}</span>
                    <span className="font-mono text-[10px] text-slate-400">{entry.timestamp}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-600">
                    <span className="font-semibold text-blue-900">{entry.performedBy}</span>
                    <span>({entry.role})</span>
                    <span>&bull;</span>
                    <span className="font-mono text-slate-500">{entry.previousStatus} &rarr; {entry.newStatus}</span>
                  </div>
                  {entry.remarks && (
                    <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded italic">
                      "{entry.remarks}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SUB-MODAL 1: Advance Stage Modal */}
      {showStageModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowStageModal(false)}
          title="Advance Project Lifecycle Stage"
          subtitle={`Current Stage: ${project.currentStage}`}
        >
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select Next Lifecycle Stage:</label>
              <select
                value={selectedNextStage}
                onChange={e => setSelectedNextStage(e.target.value as ProjectStage)}
                className="w-full border border-slate-300 rounded p-2 bg-white text-slate-800 font-medium"
              >
                {ALL_LIFECYCLE_STAGES.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Approval / Transition Remarks:</label>
              <textarea
                value={stageRemarks}
                onChange={e => setStageRemarks(e.target.value)}
                rows={3}
                placeholder="Enter official departmental concurrence note..."
                className="w-full border border-slate-300 rounded p-2 text-slate-800"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowStageModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleStageTransition}
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644]"
              >
                Endorse & Transition
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* SUB-MODAL 2: Update Progress Modal */}
      {showProgressModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowProgressModal(false)}
          title="Update Physical & Financial Progress"
          subtitle={`Project ID: ${project.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Physical Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newPhysical}
                  onChange={e => setNewPhysical(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Financial Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newFinancial}
                  onChange={e => setNewFinancial(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Total Expenditure (₹ Cr)</label>
                <input
                  type="number"
                  step="0.1"
                  value={newExpenditure}
                  onChange={e => setNewExpenditure(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-bold"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Delay Days (if any)</label>
                <input
                  type="number"
                  min="0"
                  value={newDelayDays}
                  onChange={e => setNewDelayDays(Number(e.target.value))}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-bold"
                />
              </div>
            </div>

            {newDelayDays > 0 && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Reason for Delay:</label>
                <input
                  type="text"
                  value={newDelayReason}
                  onChange={e => setNewDelayReason(e.target.value)}
                  placeholder="e.g., Delay in utility shifting or monsoonal halt"
                  className="w-full border border-slate-300 rounded p-2 bg-white"
                />
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Inspection & Progress Remarks:</label>
              <textarea
                value={progressRemarks}
                onChange={e => setProgressRemarks(e.target.value)}
                rows={2}
                placeholder="Details of physical components completed this period..."
                className="w-full border border-slate-300 rounded p-2 bg-white"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowProgressModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleProgressUpdate}
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644]"
              >
                Save Progress
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* SUB-MODAL 3: Site Inspection Modal */}
      {showInspectionModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowInspectionModal(false)}
          title="New Site Inspection Record"
          subtitle={`Scheme: ${project.name}`}
        >
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Inspection Officer Name</label>
                <input
                  type="text"
                  value={inspOfficer}
                  onChange={e => setInspOfficer(e.target.value)}
                  placeholder="Er. S. K. Joshi (Technical Auditor)"
                  className="w-full border border-slate-300 rounded p-2"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Site Work Status</label>
                <select
                  value={inspStatus}
                  onChange={e => setInspStatus(e.target.value as any)}
                  className="w-full border border-slate-300 rounded p-2 bg-white"
                >
                  <option value="Satisfactory">Satisfactory</option>
                  <option value="Needs Improvement">Needs Improvement</option>
                  <option value="Critical Issues Found">Critical Issues Found</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Site Location / Chainage</label>
              <input
                type="text"
                value={inspLocation}
                onChange={e => setInspLocation(e.target.value)}
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quality Observations</label>
              <textarea
                value={inspQuality}
                onChange={e => setInspQuality(e.target.value)}
                rows={2}
                placeholder="Compaction, concrete strength, reinforcement check..."
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Safety Observations & Defects</label>
              <textarea
                value={inspSafety}
                onChange={e => setInspSafety(e.target.value)}
                rows={2}
                placeholder="Hard hat compliance, excavation shoring, barricading..."
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Instructions to Contractor</label>
              <input
                type="text"
                value={inspInstructions}
                onChange={e => setInspInstructions(e.target.value)}
                placeholder="Remedial action mandatory before next casting..."
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowInspectionModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddInspection}
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644]"
              >
                Save Inspection Record
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* SUB-MODAL 4: Add Issue / Risk Modal */}
      {showIssueModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowIssueModal(false)}
          title="Log Project Issue or Risk"
          subtitle={`Project ID: ${project.id}`}
        >
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Type</label>
                <select
                  value={issueType}
                  onChange={e => setIssueType(e.target.value as any)}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-bold"
                >
                  <option value="Issue">Issue (Current Problem)</option>
                  <option value="Risk">Risk (Potential Hazard)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={issueCat}
                  onChange={e => setIssueCat(e.target.value as any)}
                  className="w-full border border-slate-300 rounded p-2 bg-white"
                >
                  <option value="Technical">Technical</option>
                  <option value="Land Acquisition">Land Acquisition</option>
                  <option value="Statutory Clearances">Statutory Clearances</option>
                  <option value="Contractual">Contractual</option>
                  <option value="Financial">Financial</option>
                  <option value="Environmental">Environmental</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Severity</label>
                <select
                  value={issueSev}
                  onChange={e => setIssueSev(e.target.value as any)}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-bold text-rose-800"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Description</label>
              <textarea
                value={issueDesc}
                onChange={e => setIssueDesc(e.target.value)}
                rows={2}
                placeholder="Specify precise cause, affected works and impact on timelines..."
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mitigation / Corrective Action</label>
              <textarea
                value={issueAction}
                onChange={e => setIssueAction(e.target.value)}
                rows={2}
                placeholder="Departmental escalation or contractor instruction..."
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowIssueModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddIssue}
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644]"
              >
                Save To Register
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* SUB-MODAL 5: Upload Document */}
      {showDocModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowDocModal(false)}
          title="Upload Document Artifact"
          subtitle={`Attach to ${project.id}`}
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Document Title</label>
              <input
                type="text"
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                placeholder="e.g., Technical Sanction Memo - Revision 2"
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Category</label>
              <select
                value={docCategory}
                onChange={e => setDocCategory(e.target.value as any)}
                className="w-full border border-slate-300 rounded p-2 bg-white"
              >
                <option value="Administrative approval">Administrative approval</option>
                <option value="Technical sanction">Technical sanction</option>
                <option value="Project proposal">Project proposal</option>
                <option value="Contract">Contract</option>
                <option value="Drawings">Drawings</option>
                <option value="Site inspection reports">Site inspection reports</option>
                <option value="Bills">Bills</option>
                <option value="Completion certificate">Completion certificate</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Select File (PDF / CAD / DOC)</label>
              <input
                type="text"
                value={docFile}
                onChange={e => setDocFile(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 font-mono"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowDocModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadDoc}
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644]"
              >
                Attach & Upload
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* SUB-MODAL 6: Submit Approval */}
      {showApprovalModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowApprovalModal(false)}
          title="Submit Departmental Approval Workflow"
          subtitle={`Project ID: ${project.id}`}
        >
          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Approval Type</label>
              <select
                value={appType}
                onChange={e => setAppType(e.target.value as any)}
                className="w-full border border-slate-300 rounded p-2 bg-white font-medium"
              >
                <option value="Administrative Approval (AS)">Administrative Approval (AS)</option>
                <option value="Technical Sanction (TS)">Technical Sanction (TS)</option>
                <option value="RFP Approval">RFP Approval</option>
                <option value="Tender Award Recommendation">Tender Award Recommendation</option>
                <option value="Contract Variation / EOT">Contract Variation / EOT</option>
                <option value="Running Account (RA) Bill">Running Account (RA) Bill</option>
                <option value="Final Handover Acceptance">Final Handover Acceptance</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Financial Quantum (₹ Cr)</label>
              <input
                type="number"
                value={appAmount}
                onChange={e => setAppAmount(Number(e.target.value))}
                className="w-full border border-slate-300 rounded p-2 font-bold"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Submission Note / Justification</label>
              <textarea
                value={appRemarks}
                onChange={e => setAppRemarks(e.target.value)}
                rows={3}
                placeholder="Enter justification for committee / Mission Director review..."
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApproval}
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644]"
              >
                Submit Into Approval Queue
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* SUB-MODAL 7: Complete Project Modal */}
      {showCompleteModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowCompleteModal(false)}
          title="Endorse Handover & Project Completion"
          subtitle={`Project ID: ${project.id}`}
        >
          <div className="space-y-3 text-xs">
            <div className="bg-teal-50 p-3 rounded border border-teal-200 text-teal-900">
              <p className="font-bold mb-1">Completion & Handover Protocol Checklist:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                <li>Final joint measurement book (MB) verified with zero pending queries.</li>
                <li>Defects liability period (DLP) protocol documented for 5 years.</li>
                <li>As-built CAD engineering drawings archived in document repository.</li>
                <li>Asset handover resolution passed with respective Urban Local Body (ULB).</li>
              </ul>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Handover Notes & Resolution No.</label>
              <textarea
                value={completeRemarks}
                onChange={e => setCompleteRemarks(e.target.value)}
                rows={3}
                placeholder="e.g., Handed over to AMC Municipal Commissioner vide Resolution #AMC/2025/112."
                className="w-full border border-slate-300 rounded p-2"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleCompleteProject}
                className="px-4 py-1.5 rounded bg-teal-700 text-white font-semibold hover:bg-teal-800"
              >
                Endorse Completion
              </button>
            </div>
          </div>
        </Modal>
      )}
    </Modal>
  );
};
