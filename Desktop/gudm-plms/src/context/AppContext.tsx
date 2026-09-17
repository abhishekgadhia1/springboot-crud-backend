/**
 * GUDM PLMS State Management Context
 * Supports all 15 Interactive Demo Scenarios with persistent mock state and role switching
 */

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  UserRole,
  ProjectStage,
  ProjectStatus,
  ProjectMaster,
  RFPRecord,
  ContractRecord,
  SiteInspection,
  IssueRisk,
  DocumentRecord,
  ApprovalItem,
  NotificationItem,
  AuditEntry,
  Milestone
} from '../types';
import {
  INITIAL_PROJECTS,
  INITIAL_RFPS,
  INITIAL_CONTRACTS,
  INITIAL_INSPECTIONS,
  INITIAL_ISSUES_RISKS,
  INITIAL_DOCUMENTS,
  INITIAL_APPROVALS,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

export const ALL_LIFECYCLE_STAGES: ProjectStage[] = [
  'Project idea',
  'Preliminary proposal',
  'Technical assessment',
  'Administrative approval',
  'Financial approval',
  'RFP preparation',
  'RFP publication',
  'Bid submission',
  'Bid evaluation',
  'Contract award',
  'Work order',
  'Project execution',
  'Site inspection',
  'Progress monitoring',
  'Bill and payment processing',
  'Completion',
  'Handover',
  'Closure'
];

interface AppContextType {
  // Navigation & Role
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentNav: string;
  setCurrentNav: (nav: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
  fiscalYear: string;
  setFiscalYear: (fy: string) => void;

  // Data
  projects: ProjectMaster[];
  rfps: RFPRecord[];
  contracts: ContractRecord[];
  inspections: SiteInspection[];
  issuesRisks: IssueRisk[];
  documents: DocumentRecord[];
  approvals: ApprovalItem[];
  notifications: NotificationItem[];

  // 15 Interactive Demo Action Methods
  createProject: (newProject: Partial<ProjectMaster>) => ProjectMaster;
  moveProjectStage: (projectId: string, newStage: ProjectStage, remarks: string) => void;
  createRfp: (rfpData: Partial<RFPRecord>) => RFPRecord;
  evaluateBid: (rfpId: string, bidId: string, status: 'L1 (Preferred)' | 'L2' | 'Disqualified' | 'Technically Qualified', remarks: string) => void;
  awardContractFromRfp: (rfpId: string, contractorName: string, contractValue: number) => ContractRecord;
  updateProjectProgress: (
    projectId: string,
    physicalProgress: number,
    financialProgress: number,
    expenditureAmount: number,
    delayDays: number,
    delayReason: string,
    remarks: string
  ) => void;
  addSiteInspection: (inspectionData: Partial<SiteInspection>) => SiteInspection;
  addIssueRisk: (issueData: Partial<IssueRisk>) => IssueRisk;
  submitApproval: (approvalData: Partial<ApprovalItem>) => ApprovalItem;
  handleApprovalAction: (
    approvalId: string,
    action: 'Approve' | 'Reject' | 'Send Back' | 'Clarification Requested',
    remarks: string
  ) => void;
  uploadDocument: (docData: Partial<DocumentRecord>) => DocumentRecord;
  completeProject: (projectId: string, handoverNotes: string) => void;
  markNotificationRead: (id: string) => void;
  resetDemoData: () => void;

  // Role permissions checker helper
  canPerformAction: (action: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'gudm_plms_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('Super Administrator');
  const [currentNav, setCurrentNav] = useState<string>('Dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [fiscalYear, setFiscalYear] = useState<string>('FY 2024-25');

  // Stored states with fallback
  const [projects, setProjects] = useState<ProjectMaster[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [rfps, setRfps] = useState<RFPRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'rfps');
    return saved ? JSON.parse(saved) : INITIAL_RFPS;
  });

  const [contracts, setContracts] = useState<ContractRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'contracts');
    return saved ? JSON.parse(saved) : INITIAL_CONTRACTS;
  });

  const [inspections, setInspections] = useState<SiteInspection[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'inspections');
    return saved ? JSON.parse(saved) : INITIAL_INSPECTIONS;
  });

  const [issuesRisks, setIssuesRisks] = useState<IssueRisk[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'issuesRisks');
    return saved ? JSON.parse(saved) : INITIAL_ISSUES_RISKS;
  });

  const [documents, setDocuments] = useState<DocumentRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [approvals, setApprovals] = useState<ApprovalItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'approvals');
    return saved ? JSON.parse(saved) : INITIAL_APPROVALS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync state to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'rfps', JSON.stringify(rfps));
  }, [rfps]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'contracts', JSON.stringify(contracts));
  }, [contracts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'inspections', JSON.stringify(inspections));
  }, [inspections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'issuesRisks', JSON.stringify(issuesRisks));
  }, [issuesRisks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'approvals', JSON.stringify(approvals));
  }, [approvals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_PREFIX + 'notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Role Permissions Logic
  const canPerformAction = (action: string): boolean => {
    if (currentRole === 'Super Administrator') return true;
    switch (action) {
      case 'create_project':
        return ['GUDM Department Administrator', 'Project Manager', 'Engineering Officer'].includes(currentRole);
      case 'edit_rfp':
        return ['Procurement Officer', 'GUDM Department Administrator'].includes(currentRole);
      case 'approve_workflow':
        return ['Senior Management', 'Super Administrator', 'Finance Officer', 'Engineering Officer'].includes(currentRole);
      case 'conduct_inspection':
        return ['Field Inspection Officer', 'Engineering Officer', 'Project Manager'].includes(currentRole);
      case 'update_progress':
        return ['Project Manager', 'Contractor / Implementing Agency', 'Engineering Officer'].includes(currentRole);
      case 'process_finance':
        return ['Finance Officer', 'Senior Management'].includes(currentRole);
      case 'upload_document':
        return true;
      default:
        return true;
    }
  };

  // 1. Create a new project
  const createProject = (data: Partial<ProjectMaster>): ProjectMaster => {
    const year = new Date().getFullYear();
    const count = projects.length + 1;
    const padded = String(count).padStart(3, '0');
    const newId = `GUDM-PRJ-${year}-${padded}`;

    const defaultMilestones: Milestone[] = [
      { id: 'M1', name: 'Site Survey & Detailed Engineering Report', weightage: 20, plannedDate: data.plannedStartDate || '2025-06-30', status: 'In Progress', deliverable: 'Sanctioned engineering blueprint' },
      { id: 'M2', name: 'Foundation & Trunk Infrastructure', weightage: 35, plannedDate: '2025-12-31', status: 'Pending', deliverable: 'Substructure audit report' },
      { id: 'M3', name: 'Superstructure & Electro-Mechanical Fitout', weightage: 30, plannedDate: '2026-06-30', status: 'Pending', deliverable: 'Equipment test certificates' },
      { id: 'M4', name: 'Trial Runs, SCADA Link & Handover', weightage: 15, plannedDate: data.plannedCompletionDate || '2026-12-31', status: 'Pending', deliverable: 'Final operational certification' }
    ];

    const auditEntry: AuditEntry = {
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      performedBy: `Current User (${currentRole})`,
      role: currentRole,
      action: 'Project Registered',
      previousStatus: 'None',
      newStatus: 'Planning',
      remarks: 'Project master created in PLMS system.'
    };

    const newPrj: ProjectMaster = {
      id: newId,
      name: data.name || 'Untitled Infrastructure Scheme',
      category: data.category || 'Urban Roads & Bridges',
      type: data.type || 'Greenfield Infrastructure',
      description: data.description || 'Project proposal formulated under GUDM guidelines.',
      district: data.district || 'Ahmedabad',
      ulb: data.ulb || 'GUDM Direct',
      location: data.location || 'Gujarat Urban Corridor',
      coordinates: data.coordinates || { lat: 23.0225, lng: 72.5714 },
      implementingAgency: data.implementingAgency || 'Gujarat Urban Development Mission',
      department: data.department || 'Urban Infrastructure Cell',
      projectManager: data.projectManager || 'Er. J. M. Solanki (EE)',
      estimatedCost: Number(data.estimatedCost) || 50.0,
      approvedCost: Number(data.approvedCost) || Number(data.estimatedCost) || 50.0,
      expenditure: 0,
      committedCost: 0,
      fundingSource: data.fundingSource || 'Swarnim Jayanti Mukhya Mantri Shehri Vikas Yojana (SJMMSVY)',
      plannedStartDate: data.plannedStartDate || '2025-05-01',
      plannedCompletionDate: data.plannedCompletionDate || '2026-12-31',
      expectedCompletionDate: data.plannedCompletionDate || '2026-12-31',
      currentStage: 'Project idea',
      currentStatus: 'Planning',
      physicalProgress: 0,
      financialProgress: 0,
      riskLevel: data.riskLevel || 'Low',
      priority: data.priority || 'Standard',
      milestones: defaultMilestones,
      delayDays: 0,
      lastUpdated: new Date().toISOString().substring(0, 10),
      auditTrail: [auditEntry]
    };

    setProjects(prev => [newPrj, ...prev]);

    // Create system notification
    const notif: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      title: `New Project Registered: ${newPrj.name}`,
      description: `Project ${newPrj.id} entered in planning stage with budget Rs. ${newPrj.approvedCost} Cr.`,
      category: 'Pending Approval',
      severity: 'Low',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      projectId: newPrj.id,
      read: false
    };
    setNotifications(prev => [notif, ...prev]);

    return newPrj;
  };

  // 2. Move Project Stage
  const moveProjectStage = (projectId: string, newStage: ProjectStage, remarks: string) => {
    let newStatus: ProjectStatus = 'Planning';
    if (['RFP preparation', 'RFP publication', 'Bid submission', 'Bid evaluation'].includes(newStage)) {
      newStatus = 'Under RFP';
    } else if (['Contract award', 'Work order'].includes(newStage)) {
      newStatus = 'Awarded';
    } else if (['Project execution', 'Site inspection', 'Progress monitoring', 'Bill and payment processing'].includes(newStage)) {
      newStatus = 'In Execution';
    } else if (['Completion', 'Handover', 'Closure'].includes(newStage)) {
      newStatus = 'Completed';
    }

    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        const audit: AuditEntry = {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          performedBy: `Current User (${currentRole})`,
          role: currentRole,
          action: `Stage Transition: ${p.currentStage} -> ${newStage}`,
          previousStatus: p.currentStatus,
          newStatus: newStatus,
          remarks: remarks || `Moved stage to ${newStage}`
        };
        return {
          ...p,
          currentStage: newStage,
          currentStatus: newStatus,
          lastUpdated: new Date().toISOString().substring(0, 10),
          auditTrail: [audit, ...p.auditTrail]
        };
      })
    );
  };

  // 3. Create RFP
  const createRfp = (rfpData: Partial<RFPRecord>): RFPRecord => {
    const year = new Date().getFullYear();
    const count = rfps.length + 1;
    const rfpId = `GUDM/RFP/${year}/${String(count).padStart(3, '0')}`;

    const newRfp: RFPRecord = {
      id: rfpId,
      projectId: rfpData.projectId || '',
      projectName: rfpData.projectName || 'Infrastructure Scheme',
      title: rfpData.title || `Notice Inviting Tender for ${rfpData.projectName}`,
      category: rfpData.category || 'Urban Roads & Bridges',
      estimatedCost: Number(rfpData.estimatedCost) || 45.0,
      tenderFee: rfpData.tenderFee || 25000,
      emdAmount: rfpData.emdAmount || (Number(rfpData.estimatedCost || 45.0) * 100000),
      status: 'Published',
      publishDate: new Date().toISOString().substring(0, 10),
      preBidMeetingDate: rfpData.preBidMeetingDate || '2025-04-10',
      submissionDeadline: rfpData.submissionDeadline || '2025-04-28',
      openingDate: rfpData.openingDate || '2025-04-30',
      bidsCount: 0,
      eligibilityCriteria: rfpData.eligibilityCriteria || [
        'Class-AA registered contractor with Government of Gujarat',
        'Demonstrated turnover of 1.5x estimated value over last 3 years',
        'Valid GST and Provident Fund registrations'
      ],
      evaluationCommittee: [
        'Superintending Engineer (Chairman)',
        'Chief Accounts Officer (Finance Member)',
        'Executive Engineer (Member Secretary)'
      ],
      bids: []
    };

    setRfps(prev => [newRfp, ...prev]);

    // Also link to project and move stage
    if (newRfp.projectId) {
      setProjects(prev =>
        prev.map(p => {
          if (p.id !== newRfp.projectId) return p;
          const audit: AuditEntry = {
            id: `AUD-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            performedBy: `Current User (${currentRole})`,
            role: currentRole,
            action: `RFP Floated: ${newRfp.id}`,
            previousStatus: p.currentStatus,
            newStatus: 'Under RFP',
            remarks: `Tender published with opening on ${newRfp.openingDate}`
          };
          return {
            ...p,
            rfpId: newRfp.id,
            currentStage: 'RFP publication',
            currentStatus: 'Under RFP',
            auditTrail: [audit, ...p.auditTrail]
          };
        })
      );
    }

    return newRfp;
  };

  // 4. Evaluate Bid
  const evaluateBid = (
    rfpId: string,
    bidId: string,
    status: 'L1 (Preferred)' | 'L2' | 'Disqualified' | 'Technically Qualified',
    remarks: string
  ) => {
    setRfps(prev =>
      prev.map(rfp => {
        if (rfp.id !== rfpId) return rfp;
        const updatedBids = rfp.bids.map(b => (b.id === bidId ? { ...b, status, evaluatorRemarks: remarks } : b));
        const l1Bid = updatedBids.find(b => b.status === 'L1 (Preferred)');
        return {
          ...rfp,
          bids: updatedBids,
          status: 'Award Recommendation',
          recommendedBidder: l1Bid ? l1Bid.bidderName : rfp.recommendedBidder
        };
      })
    );
  };

  // 5. Award Contract from RFP
  const awardContractFromRfp = (rfpId: string, contractorName: string, contractValue: number): ContractRecord => {
    const rfp = rfps.find(r => r.id === rfpId);
    const count = contracts.length + 1;
    const year = new Date().getFullYear();
    const contractId = `GUDM/CTR/${year}/${String(count).padStart(3, '0')}`;
    const workOrderNo = `GUDM/WO/${year}/${String(count).padStart(3, '0')}`;

    const newContract: ContractRecord = {
      id: contractId,
      projectId: rfp ? rfp.projectId : '',
      projectName: rfp ? rfp.projectName : 'Awarded Scheme',
      contractorName,
      contractorPanGst: '24AABCG8812K1Z9',
      workOrderNumber: workOrderNo,
      workOrderDate: new Date().toISOString().substring(0, 10),
      contractValue,
      startDate: new Date().toISOString().substring(0, 10),
      scheduledEndDate: '2026-06-30',
      performanceSecurity: {
        bankName: 'State Bank of India (Commercial Branch)',
        bgNumber: `SBI-BG-${year}-${Math.floor(10000 + Math.random() * 90000)}`,
        amount: Math.round((contractValue * 0.05) * 100) / 100, // 5%
        validTill: '2026-12-31',
        verified: true
      },
      milestonesCount: 4,
      paymentTerms: 'Payment via Running Account (RA) bills verified through Measurement Book (MB) with 5% statutory retention.',
      variationOrders: [],
      extensionOfTimeDays: 0,
      penaltiesLevied: 0,
      contractorPerformanceRating: 4.5,
      status: 'Active'
    };

    setContracts(prev => [newContract, ...prev]);

    // Update RFP status
    setRfps(prev =>
      prev.map(r => (r.id === rfpId ? { ...r, status: 'Awarded' } : r))
    );

    // Update Project
    if (rfp && rfp.projectId) {
      setProjects(prev =>
        prev.map(p => {
          if (p.id !== rfp.projectId) return p;
          const audit: AuditEntry = {
            id: `AUD-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            performedBy: `Current User (${currentRole})`,
            role: currentRole,
            action: `Contract Awarded: ${contractId}`,
            previousStatus: p.currentStatus,
            newStatus: 'Awarded',
            remarks: `Work order ${workOrderNo} issued to ${contractorName} for Rs. ${contractValue} Cr.`
          };
          return {
            ...p,
            contractor: contractorName,
            contractId: contractId,
            committedCost: contractValue,
            currentStage: 'Work order',
            currentStatus: 'Awarded',
            auditTrail: [audit, ...p.auditTrail]
          };
        })
      );
    }

    return newContract;
  };

  // 6. Update Project Progress
  const updateProjectProgress = (
    projectId: string,
    physicalProgress: number,
    financialProgress: number,
    expenditureAmount: number,
    delayDays: number,
    delayReason: string,
    remarks: string
  ) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        const newStatus: ProjectStatus = delayDays > 30 ? 'Delayed' : physicalProgress >= 100 ? 'Completed' : 'In Execution';
        const newStage: ProjectStage = physicalProgress >= 100 ? 'Completion' : p.currentStage === 'Work order' ? 'Project execution' : p.currentStage;

        const audit: AuditEntry = {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          performedBy: `Current User (${currentRole})`,
          role: currentRole,
          action: 'Progress Updated',
          previousStatus: `${p.physicalProgress}% physical / ${p.financialProgress}% financial`,
          newStatus: `${physicalProgress}% physical / ${financialProgress}% financial`,
          remarks: remarks || `Progress refreshed. Expenditure updated to Rs. ${expenditureAmount} Cr.`
        };

        return {
          ...p,
          physicalProgress,
          financialProgress,
          expenditure: expenditureAmount,
          delayDays,
          delayReason: delayDays > 0 ? delayReason : undefined,
          currentStatus: newStatus,
          currentStage: newStage,
          lastUpdated: new Date().toISOString().substring(0, 10),
          auditTrail: [audit, ...p.auditTrail]
        };
      })
    );
  };

  // 7. Add Site Inspection
  const addSiteInspection = (data: Partial<SiteInspection>): SiteInspection => {
    const count = inspections.length + 1;
    const inspId = `INSP-2025-${String(count).padStart(3, '0')}`;
    const newInsp: SiteInspection = {
      id: inspId,
      projectId: data.projectId || '',
      projectName: data.projectName || '',
      inspectionDate: data.inspectionDate || new Date().toISOString().substring(0, 10),
      inspectionOfficer: data.inspectionOfficer || `Inspection Officer (${currentRole})`,
      designation: data.designation || 'Technical Auditor, GUDM',
      siteLocation: data.siteLocation || 'Project Site Main Works',
      workStatus: data.workStatus || 'Satisfactory',
      qualityObservations: data.qualityObservations || 'Materials and craftsmanship inspected and verified.',
      safetyObservations: data.safetyObservations || 'Barricading and personal protective gear in place.',
      defectsIdentified: data.defectsIdentified || [],
      instructionsToContractor: data.instructionsToContractor || 'Maintain daily curing log and cube testing registers.',
      followUpDate: data.followUpDate || '2025-04-10',
      complianceStatus: 'Pending',
      photographs: data.photographs || [
        {
          url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18615f8?auto=format&fit=crop&w=600&q=80',
          caption: 'Routine structural inspection and quality audit',
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
        }
      ]
    };

    setInspections(prev => [newInsp, ...prev]);

    // Append to audit trail of project
    if (newInsp.projectId) {
      setProjects(prev =>
        prev.map(p => {
          if (p.id !== newInsp.projectId) return p;
          const audit: AuditEntry = {
            id: `AUD-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            performedBy: newInsp.inspectionOfficer,
            role: currentRole,
            action: `Site Inspection Logged: ${inspId}`,
            previousStatus: p.currentStatus,
            newStatus: p.currentStatus,
            remarks: `Inspection outcome: ${newInsp.workStatus}. Instructions issued.`
          };
          return { ...p, auditTrail: [audit, ...p.auditTrail] };
        })
      );
    }

    return newInsp;
  };

  // 8. Add Issue / Risk
  const addIssueRisk = (data: Partial<IssueRisk>): IssueRisk => {
    const count = issuesRisks.length + 1;
    const id = `${data.type === 'Risk' ? 'RSK' : 'ISS'}-2025-${String(count).padStart(3, '0')}`;

    const newIssue: IssueRisk = {
      id,
      projectId: data.projectId || '',
      projectName: data.projectName || '',
      type: data.type || 'Issue',
      description: data.description || 'Inter-departmental clearance coordination required.',
      category: data.category || 'Technical',
      severity: data.severity || 'Medium',
      probability: data.probability || 'Medium',
      impact: data.impact || 'Medium',
      owner: data.owner || 'Project Manager',
      dueDate: data.dueDate || '2025-04-30',
      status: 'Open',
      correctiveAction: data.correctiveAction || 'Issue flagged to Mission Director.',
      escalationStatus: data.escalationStatus || 'None'
    };

    setIssuesRisks(prev => [newIssue, ...prev]);

    // If critical, escalate project risk
    if (newIssue.severity === 'Critical' && newIssue.projectId) {
      setProjects(prev =>
        prev.map(p => (p.id === newIssue.projectId ? { ...p, riskLevel: 'Critical' } : p))
      );
    }

    return newIssue;
  };

  // 9. Submit Approval
  const submitApproval = (data: Partial<ApprovalItem>): ApprovalItem => {
    const count = approvals.length + 1;
    const id = `APP-2025-${String(count).padStart(3, '0')}`;

    const newApp: ApprovalItem = {
      id,
      projectId: data.projectId || '',
      projectName: data.projectName || '',
      approvalType: data.approvalType || 'Administrative Approval (AS)',
      amount: data.amount || 0,
      submittedBy: `User (${currentRole})`,
      submitterRole: currentRole,
      currentOfficer: data.currentOfficer || 'Mission Director GUDM',
      submissionDate: new Date().toISOString().substring(0, 10),
      dueDate: data.dueDate || '2025-04-15',
      status: 'Pending',
      remarks: data.remarks || 'Submitted for administrative & financial concurrence.',
      history: [
        {
          officer: `User (${currentRole})`,
          action: 'File Submitted',
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          comments: data.remarks || 'Initiated proposal.'
        }
      ]
    };

    setApprovals(prev => [newApp, ...prev]);
    return newApp;
  };

  // 10. Handle Approval Action
  const handleApprovalAction = (
    approvalId: string,
    action: 'Approve' | 'Reject' | 'Send Back' | 'Clarification Requested',
    remarks: string
  ) => {
    setApprovals(prev =>
      prev.map(app => {
        if (app.id !== approvalId) return app;
        const newStatus =
          action === 'Approve'
            ? 'Approved'
            : action === 'Reject'
            ? 'Rejected'
            : action === 'Send Back'
            ? 'Sent Back'
            : 'Clarification Requested';

        const historyEntry = {
          officer: `Current Officer (${currentRole})`,
          action: action,
          date: new Date().toISOString().replace('T', ' ').substring(0, 16),
          comments: remarks || `Action: ${action}`
        };

        return {
          ...app,
          status: newStatus,
          remarks: remarks || app.remarks,
          history: [...app.history, historyEntry]
        };
      })
    );
  };

  // 11. Upload Document
  const uploadDocument = (data: Partial<DocumentRecord>): DocumentRecord => {
    const count = documents.length + 1;
    const docId = `DOC-2025-${String(count).padStart(3, '0')}`;

    const newDoc: DocumentRecord = {
      id: docId,
      projectId: data.projectId || '',
      projectName: data.projectName || '',
      title: data.title || 'Official File Document',
      category: data.category || 'Administrative approval',
      version: data.version || 'v1.0',
      fileName: data.fileName || 'GUDM_Sanction_Memo.pdf',
      fileSize: data.fileSize || '2.4 MB',
      uploadedBy: `User (${currentRole})`,
      role: currentRole,
      uploadDate: new Date().toISOString().substring(0, 10),
      approvalStatus: 'Approved'
    };

    setDocuments(prev => [newDoc, ...prev]);

    // Append to project audit
    if (newDoc.projectId) {
      setProjects(prev =>
        prev.map(p => {
          if (p.id !== newDoc.projectId) return p;
          const audit: AuditEntry = {
            id: `AUD-${Date.now()}`,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
            performedBy: `User (${currentRole})`,
            role: currentRole,
            action: `Document Uploaded: ${newDoc.title}`,
            previousStatus: p.currentStatus,
            newStatus: p.currentStatus,
            remarks: `File attached to repository: ${newDoc.fileName}`
          };
          return { ...p, auditTrail: [audit, ...p.auditTrail] };
        })
      );
    }

    return newDoc;
  };

  // 12. Mark Project Completed
  const completeProject = (projectId: string, handoverNotes: string) => {
    setProjects(prev =>
      prev.map(p => {
        if (p.id !== projectId) return p;
        const audit: AuditEntry = {
          id: `AUD-${Date.now()}`,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          performedBy: `User (${currentRole})`,
          role: currentRole,
          action: 'Project Handover & Completion Verified',
          previousStatus: p.currentStatus,
          newStatus: 'Completed',
          remarks: handoverNotes || 'Final inspection passed, punch list verified and handover protocol endorsed.'
        };
        return {
          ...p,
          currentStage: 'Handover',
          currentStatus: 'Completed',
          physicalProgress: 100,
          delayDays: 0,
          auditTrail: [audit, ...p.auditTrail]
        };
      })
    );
  };

  // Notification helper
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  // Reset to initial mock data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_PREFIX + 'projects');
    localStorage.removeItem(STORAGE_PREFIX + 'rfps');
    localStorage.removeItem(STORAGE_PREFIX + 'contracts');
    localStorage.removeItem(STORAGE_PREFIX + 'inspections');
    localStorage.removeItem(STORAGE_PREFIX + 'issuesRisks');
    localStorage.removeItem(STORAGE_PREFIX + 'documents');
    localStorage.removeItem(STORAGE_PREFIX + 'approvals');
    localStorage.removeItem(STORAGE_PREFIX + 'notifications');

    setProjects(INITIAL_PROJECTS);
    setRfps(INITIAL_RFPS);
    setContracts(INITIAL_CONTRACTS);
    setInspections(INITIAL_INSPECTIONS);
    setIssuesRisks(INITIAL_ISSUES_RISKS);
    setDocuments(INITIAL_DOCUMENTS);
    setApprovals(INITIAL_APPROVALS);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  const value = useMemo(
    () => ({
      currentRole,
      setCurrentRole,
      currentNav,
      setCurrentNav,
      selectedProjectId,
      setSelectedProjectId,
      fiscalYear,
      setFiscalYear,
      projects,
      rfps,
      contracts,
      inspections,
      issuesRisks,
      documents,
      approvals,
      notifications,
      createProject,
      moveProjectStage,
      createRfp,
      evaluateBid,
      awardContractFromRfp,
      updateProjectProgress,
      addSiteInspection,
      addIssueRisk,
      submitApproval,
      handleApprovalAction,
      uploadDocument,
      completeProject,
      markNotificationRead,
      resetDemoData,
      canPerformAction
    }),
    [
      currentRole,
      currentNav,
      selectedProjectId,
      fiscalYear,
      projects,
      rfps,
      contracts,
      inspections,
      issuesRisks,
      documents,
      approvals,
      notifications
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
