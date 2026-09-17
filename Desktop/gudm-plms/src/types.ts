/**
 * Gujarat Urban Development Mission (GUDM) - PLMS Types
 * Department-facing Project Lifecycle Management System
 */

export type UserRole =
  | 'Super Administrator'
  | 'GUDM Department Administrator'
  | 'Project Manager'
  | 'Engineering Officer'
  | 'Procurement Officer'
  | 'Finance Officer'
  | 'Senior Management'
  | 'Contractor / Implementing Agency'
  | 'Field Inspection Officer'
  | 'Super Admin'
  | 'Mission Director'
  | 'Chief Engineer'
  | 'Quality Inspector'
  | 'ULB Officer'
  | 'Contractor View';

export type SiteInspectionRecord = SiteInspection;
export type IssueRiskRecord = IssueRisk;
export type ApprovalRecord = ApprovalItem;
export type WorkflowAction = 'Approve' | 'Reject' | 'Send back' | 'Request clarification' | 'Forward';
export type DocumentCategory = DocumentRecord['category'];

export type ProjectStage =
  | 'Project idea'
  | 'Preliminary proposal'
  | 'Technical assessment'
  | 'Administrative approval'
  | 'Financial approval'
  | 'RFP preparation'
  | 'RFP publication'
  | 'Bid submission'
  | 'Bid evaluation'
  | 'Contract award'
  | 'Work order'
  | 'Project execution'
  | 'Site inspection'
  | 'Progress monitoring'
  | 'Bill and payment processing'
  | 'Completion'
  | 'Handover'
  | 'Closure';

export type ProjectStatus =
  | 'Planning'
  | 'Under RFP'
  | 'Awarded'
  | 'In Execution'
  | 'Delayed'
  | 'Completed'
  | 'On Hold';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type PriorityLevel = 'Standard' | 'High' | 'Priority' | 'Chief Minister Mission';

export type ProjectCategory =
  | 'Water Supply & Sewerage'
  | 'Stormwater Drainage'
  | 'Urban Roads & Bridges'
  | 'Solid Waste Management'
  | 'Urban Transport & EV'
  | 'Lake Rejuvenation & Green Space'
  | 'Smart City & Digital Infra'
  | 'Affordable Housing & Slum Upgradation';

export type FundingSource =
  | 'Swarnim Jayanti Mukhya Mantri Shehri Vikas Yojana (SJMMSVY)'
  | 'AMRUT 2.0'
  | 'Smart Cities Mission'
  | 'World Bank / GUDM Urban Resilient Fund'
  | 'State Budget Grant'
  | 'ULB Own Fund / Municipal Bonds';

export interface Milestone {
  id: string;
  name: string;
  weightage: number; // percentage
  plannedDate: string;
  actualDate?: string;
  status: 'Pending' | 'In Progress' | 'Achieved' | 'Delayed';
  deliverable: string;
}

export interface SiteInspection {
  id: string;
  projectId: string;
  projectName: string;
  inspectionDate: string;
  inspectionOfficer: string;
  designation: string;
  siteLocation: string;
  workStatus: 'Satisfactory' | 'Needs Improvement' | 'Critical Issues Found' | 'Stopped';
  qualityObservations: string;
  safetyObservations: string;
  defectsIdentified: string[];
  instructionsToContractor: string;
  followUpDate: string;
  complianceStatus: 'Pending' | 'In Progress' | 'Complied' | 'Escalated';
  photographs: { url: string; caption: string; timestamp: string }[];
}

export interface IssueRisk {
  id: string;
  projectId: string;
  projectName: string;
  type: 'Issue' | 'Risk';
  description: string;
  category: 'Technical' | 'Land Acquisition' | 'Statutory Clearances' | 'Contractual' | 'Financial' | 'Environmental';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  probability?: 'High' | 'Medium' | 'Low';
  impact: 'High' | 'Medium' | 'Low';
  owner: string;
  dueDate: string;
  status: 'Open' | 'Under review' | 'Action assigned' | 'Resolved' | 'Closed';
  correctiveAction: string;
  escalationStatus: 'None' | 'Department Head' | 'Mission Director' | 'Secretary UD&UHD';
}

export interface DocumentRecord {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  category:
    | 'Project proposal'
    | 'Technical sanction'
    | 'Administrative approval'
    | 'Financial approval'
    | 'RFP'
    | 'Bid documents'
    | 'Evaluation documents'
    | 'Contract'
    | 'Drawings'
    | 'Site inspection reports'
    | 'Bills'
    | 'Progress reports'
    | 'Completion certificate'
    | 'Handover documents';
  version: string;
  fileName: string;
  fileSize: string;
  uploadedBy: string;
  role: string;
  uploadDate: string;
  approvalStatus: 'Approved' | 'Pending Review' | 'Draft' | 'Superseded';
}

export interface ApprovalItem {
  id: string;
  projectId: string;
  projectName: string;
  approvalType:
    | 'Administrative Approval (AS)'
    | 'Technical Sanction (TS)'
    | 'RFP Approval'
    | 'Tender Award Recommendation'
    | 'Contract Variation / EOT'
    | 'Running Account (RA) Bill'
    | 'Final Handover Acceptance';
  amount?: number;
  submittedBy: string;
  submitterRole: string;
  currentOfficer: string;
  submissionDate: string;
  dueDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Sent Back' | 'Clarification Requested';
  remarks?: string;
  history: {
    officer: string;
    action: string;
    date: string;
    comments: string;
  }[];
}

export interface BidRecord {
  id: string;
  bidderName: string;
  bidderRegistrationNo: string;
  technicalScore: number; // out of 100
  financialBidAmount: number; // in Crores
  bidSubmissionDate: string;
  eligibilityPassed: boolean;
  status: 'Under Evaluation' | 'Technically Qualified' | 'Disqualified' | 'L1 (Preferred)' | 'L2' | 'Awarded';
  evaluatorRemarks?: string;
}

export interface RFPRecord {
  id: string; // e.g., GUDM/RFP/2024/089
  projectId: string;
  projectName: string;
  title: string;
  category: ProjectCategory;
  estimatedCost: number; // in Crores
  tenderFee: number;
  emdAmount: number; // Earnest Money Deposit
  status:
    | 'Draft'
    | 'Internal Review'
    | 'Approved'
    | 'Published'
    | 'Bids Received'
    | 'Evaluation'
    | 'Award Recommendation'
    | 'Awarded';
  publishDate: string;
  preBidMeetingDate: string;
  submissionDeadline: string;
  openingDate: string;
  bidsCount: number;
  eligibilityCriteria: string[];
  evaluationCommittee: string[];
  bids: BidRecord[];
  recommendedBidder?: string;
}

export interface ContractRecord {
  id: string; // e.g. GUDM/CTR/2024/042
  projectId: string;
  projectName: string;
  contractorName: string;
  contractorPanGst: string;
  workOrderNumber: string;
  workOrderDate: string;
  contractValue: number; // in Crores
  startDate: string;
  scheduledEndDate: string;
  performanceSecurity: {
    bankName: string;
    bgNumber: string;
    amount: number;
    validTill: string;
    verified: boolean;
  };
  milestonesCount: number;
  paymentTerms: string;
  variationOrders: {
    id: string;
    description: string;
    amountDelta: number;
    timeExtensionDays: number;
    approvedDate: string;
  }[];
  extensionOfTimeDays: number;
  penaltiesLevied: number;
  contractorPerformanceRating: number; // 1-5
  status: 'Active' | 'Under Variation' | 'Substantially Complete' | 'Closed' | 'Terminated';
}

export interface ProjectMaster {
  id: string; // e.g., GUDM-PRJ-2024-001
  name: string;
  category: ProjectCategory;
  type: 'Greenfield Infrastructure' | 'Brownfield Augmentation' | 'Modernization' | 'Capacity Expansion';
  description: string;
  district: string;
  ulb: string; // Urban Local Body (e.g. Ahmedabad Municipal Corporation, Rajkot Municipal Corporation)
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  implementingAgency: string; // e.g. AMC, SMC, GWSSB, GUDM Direct
  department: string; // e.g. Urban Water & Sewerage Division, Roads & Drainage Cell
  projectManager: string;
  estimatedCost: number; // in Crores INR
  approvedCost: number; // in Crores INR
  expenditure: number; // in Crores INR
  committedCost: number; // in Crores INR
  fundingSource: FundingSource;
  plannedStartDate: string;
  plannedCompletionDate: string;
  actualStartDate?: string;
  expectedCompletionDate: string;
  currentStage: ProjectStage;
  currentStatus: ProjectStatus;
  physicalProgress: number; // 0 - 100
  financialProgress: number; // 0 - 100
  riskLevel: RiskLevel;
  priority: PriorityLevel;
  contractor?: string;
  milestones: Milestone[];
  rfpId?: string;
  contractId?: string;
  delayDays: number;
  delayReason?: string;
  lastUpdated: string;
  auditTrail: AuditEntry[];
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  performedBy: string;
  role: string;
  action: string;
  previousStatus: string;
  newStatus: string;
  remarks: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  category: 'Delayed Project' | 'Pending Approval' | 'Contract Expiry' | 'Milestone Due' | 'Site Inspection' | 'Financial Alert';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  timestamp: string;
  projectId?: string;
  read: boolean;
}

export interface FinancialSummary {
  totalBudgetApproved: number; // in Crores
  totalExpenditure: number; // in Crores
  totalCommitted: number; // in Crores
  totalBillsSubmitted: number;
  totalBillsApproved: number;
  totalBillsPaid: number;
  budgetUtilisationPct: number;
  fiscalYear: string;
}
