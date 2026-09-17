import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { UserRole } from '../../types';
import {
  ShieldCheck,
  Users,
  Database,
  Key,
  Server,
  Code,
  FileCode,
  History,
  CheckCircle2,
  Lock,
  Layers,
  Cpu
} from 'lucide-react';

export const AdministrationModule: React.FC = () => {
  const { currentRole, setCurrentRole } = useApp();
  const [activeAdminTab, setActiveAdminTab] = useState<'roles' | 'matrix' | 'api' | 'db' | 'integrations' | 'security'>('roles');

  const allRoles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'Super Admin', title: 'State Super Administrator', desc: 'System-wide configuration, master data, user provisioning and audit logs' },
    { role: 'Mission Director', title: 'Mission Director, GUDM (IAS)', desc: 'Executive sanction, AS approval, high-level review, cabinet reporting and inter-departmental escalation' },
    { role: 'Chief Engineer', title: 'Chief Engineer (Technical)', desc: 'Technical Sanction (TS), engineering review, tender committee chair, variation approvals' },
    { role: 'Project Manager', title: 'Executive Engineer / Project Manager', desc: 'Day-to-day scheme execution, WBS updating, site photos, MB bill verification, progress logging' },
    { role: 'Finance Officer', title: 'Chief Accounts Officer / Finance Officer', desc: 'Budget allotment, Treasury releases, IFMS vouchers, RA bill clearance, audit compliance' },
    { role: 'Quality Inspector', title: 'Quality Assurance Inspector / Auditor', desc: 'Independent site inspections, QA/QC tests, non-conformance notices, defect identification' },
    { role: 'Procurement Officer', title: 'Tender & Procurement Officer', desc: 'RFP drafting, e-Tender publishing, bid opening, comparative statements, award recommendations' },
    { role: 'ULB Officer', title: 'Urban Local Body (ULB) Commissioner', desc: 'Municipal coordination, land handover, utility relocation consent, final asset handover' },
    { role: 'Contractor View', title: 'Authorized Contractor / Agency', desc: 'Milestone submission, MB measurement entry, RA bill submission, DLP compliance reporting' },
  ];

  const permissionMatrix = [
    { feature: 'Register New Project', super: true, md: true, ce: true, pm: true, fin: false, qa: false, proc: false, ulb: false, cont: false },
    { feature: 'Approve Administrative Sanction (AS)', super: true, md: true, ce: false, pm: false, fin: false, qa: false, proc: false, ulb: false, cont: false },
    { feature: 'Issue Technical Sanction (TS)', super: true, md: false, ce: true, pm: false, fin: false, qa: false, proc: false, ulb: false, cont: false },
    { feature: 'Publish RFP / Tender', super: true, md: false, ce: true, pm: false, fin: false, qa: false, proc: true, ulb: false, cont: false },
    { feature: 'Evaluate Bids & Recommend L1', super: true, md: false, ce: true, pm: false, fin: false, qa: false, proc: true, ulb: false, cont: false },
    { feature: 'Award Work Order / Contract', super: true, md: true, ce: true, pm: false, fin: false, qa: false, proc: false, ulb: false, cont: false },
    { feature: 'Update Physical & Financial Progress', super: true, md: false, ce: true, pm: true, fin: false, qa: false, proc: false, ulb: false, cont: true },
    { feature: 'Log Site Inspections & Defect Notices', super: true, md: false, ce: true, pm: true, fin: false, qa: true, proc: false, ulb: false, cont: false },
    { feature: 'Approve & Release RA Bills', super: true, md: true, ce: true, pm: true, fin: true, qa: false, proc: false, ulb: false, cont: false },
    { feature: 'Sanction Variation Order / EOT', super: true, md: true, ce: true, pm: false, fin: false, qa: false, proc: false, ulb: false, cont: false },
    { feature: 'Endorse Completion & Handover', super: true, md: true, ce: true, pm: true, fin: false, qa: false, proc: false, ulb: true, cont: false },
  ];

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="Administration & Specifications" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">System Administration & SI Architecture Blueprint</h2>
          <p className="text-xs text-slate-600">
            Enterprise RBAC security, role-permission matrix, database schema definitions and API specifications for System Integrator
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex space-x-3 text-xs font-semibold text-slate-600 overflow-x-auto">
        {[
          { id: 'roles', label: 'User Roles & Profiles' },
          { id: 'matrix', label: 'Role-Permission Matrix' },
          { id: 'api', label: 'API Architecture Spec' },
          { id: 'db', label: 'Database Schema Entities' },
          { id: 'integrations', label: 'External Integrations' },
          { id: 'security', label: 'Security & Non-Functional' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`pb-2.5 px-2 border-b-2 transition-colors whitespace-nowrap ${
              activeAdminTab === tab.id
                ? 'border-blue-800 text-blue-900 font-bold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Roles */}
      {activeAdminTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {allRoles.map(r => {
            const isCurrent = currentRole === r.role;
            return (
              <div
                key={r.role}
                className={`bg-white p-4 rounded-lg border shadow-2xs space-y-2 ${
                  isCurrent ? 'border-blue-800 ring-2 ring-blue-100' : 'border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{r.role}</span>
                  {isCurrent ? (
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold text-[10px]">
                      Active Role
                    </span>
                  ) : (
                    <button
                      onClick={() => setCurrentRole(r.role)}
                      className="text-blue-700 hover:underline text-[11px] font-medium"
                    >
                      Switch &rarr;
                    </button>
                  )}
                </div>
                <div className="font-medium text-slate-700">{r.title}</div>
                <p className="text-slate-500 text-[11px] leading-relaxed">{r.desc}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Permission Matrix */}
      {activeAdminTab === 'matrix' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden text-xs">
          <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Enterprise Role-Based Access Control (RBAC) Governance Matrix
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0E355C] text-white uppercase text-[9px] font-semibold tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">System Operation / Action</th>
                  <th className="py-2.5 px-2 text-center">Super Admin</th>
                  <th className="py-2.5 px-2 text-center">Mission Dir</th>
                  <th className="py-2.5 px-2 text-center">Chief Eng</th>
                  <th className="py-2.5 px-2 text-center">Proj Mgr</th>
                  <th className="py-2.5 px-2 text-center">Finance</th>
                  <th className="py-2.5 px-2 text-center">QA Insp</th>
                  <th className="py-2.5 px-2 text-center">Procurement</th>
                  <th className="py-2.5 px-2 text-center">ULB</th>
                  <th className="py-2.5 px-2 text-center">Contractor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionMatrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{row.feature}</td>
                    <td className="py-2.5 px-2 text-center">{row.super ? '✓' : '—'}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-blue-900">{row.md ? '✓' : '—'}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-purple-900">{row.ce ? '✓' : '—'}</td>
                    <td className="py-2.5 px-2 text-center font-bold text-indigo-900">{row.pm ? '✓' : '—'}</td>
                    <td className="py-2.5 px-2 text-center">{row.fin ? '✓' : '—'}</td>
                    <td className="py-2.5 px-2 text-center">{row.qa ? '✓' : '—'}</td>
                    <td className="py-2.5 px-2 text-center">{row.proc ? '✓' : '—'}</td>
                    <td className="py-2.5 px-2 text-center">{row.ulb ? '✓' : '—'}</td>
                    <td className="py-2.5 px-2 text-center">{row.cont ? '✓' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: API Architecture Spec */}
      {activeAdminTab === 'api' && (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">System Integrator RESTful API Specification (OpenAPI 3.0)</h3>
          <p className="text-slate-600">
            Standard endpoint structure required for the production PLMS backend implementation:
          </p>

          <div className="space-y-2 font-mono text-[11px]">
            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="px-1.5 py-0.5 rounded bg-blue-700 text-white font-bold mr-2 text-[10px]">GET</span>
                <span className="text-slate-800 font-bold">/api/v1/projects</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">List projects with district, sector, stage filters</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold mr-2 text-[10px]">POST</span>
                <span className="text-slate-800 font-bold">/api/v1/projects</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Register new project scheme and generate UID</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="px-1.5 py-0.5 rounded bg-amber-700 text-white font-bold mr-2 text-[10px]">PUT</span>
                <span className="text-slate-800 font-bold">/api/v1/projects/:id/stage</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Transition lifecycle stage with audit entry</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="px-1.5 py-0.5 rounded bg-amber-700 text-white font-bold mr-2 text-[10px]">PUT</span>
                <span className="text-slate-800 font-bold">/api/v1/projects/:id/progress</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Update physical %, financial %, delay metrics</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold mr-2 text-[10px]">POST</span>
                <span className="text-slate-800 font-bold">/api/v1/rfp</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Create and publish tender notification</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold mr-2 text-[10px]">POST</span>
                <span className="text-slate-800 font-bold">/api/v1/contracts</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Award contract and generate work order</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold mr-2 text-[10px]">POST</span>
                <span className="text-slate-800 font-bold">/api/v1/inspections</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Upload QA audit, observations and geo-photos</span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded border border-slate-200 flex items-center justify-between">
              <div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-bold mr-2 text-[10px]">POST</span>
                <span className="text-slate-800 font-bold">/api/v1/workflow/decide</span>
              </div>
              <span className="text-slate-500 font-sans text-xs">Process approval (Approve, Reject, Send Back, Forward)</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Database Schema Entities */}
      {activeAdminTab === 'db' && (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">PostgreSQL / Enterprise Relational Data Model</h3>
          <p className="text-slate-600">
            Core normalized relational tables designed for multi-tier government transaction integrity:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-blue-900 font-mono block">1. plms_projects_master</span>
              <p className="text-slate-600 mt-1">
                PK: id (VARCHAR 32) &bull; name, category_id, district_id, ulb_id, estimated_cost, approved_cost, expenditure, current_stage_id, status, risk_level, lat, lng, created_at
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-blue-900 font-mono block">2. plms_wbs_milestones</span>
              <p className="text-slate-600 mt-1">
                PK: id &bull; FK: project_id &bull; milestone_name, weightage, planned_date, actual_date, deliverable_doc_id, status, certified_by
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-blue-900 font-mono block">3. plms_rfp_tenders</span>
              <p className="text-slate-600 mt-1">
                PK: id &bull; FK: project_id &bull; tender_ref_no, estimated_cost, emd_amount, pre_bid_date, deadline, status, technical_weight, financial_weight
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-blue-900 font-mono block">4. plms_bids_submitted</span>
              <p className="text-slate-600 mt-1">
                PK: id &bull; FK: rfp_id &bull; bidder_consortium_name, reg_no, tech_score, financial_quote, eligibility_flag, ranking, evaluation_remarks
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-blue-900 font-mono block">5. plms_contracts_workorders</span>
              <p className="text-slate-600 mt-1">
                PK: id &bull; FK: project_id, rfp_id &bull; contractor_id, work_order_no, original_value, current_value, pbg_amount, pbg_expiry, status
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-blue-900 font-mono block">6. plms_site_inspections</span>
              <p className="text-slate-600 mt-1">
                PK: id &bull; FK: project_id &bull; officer_user_id, date, chainage_loc, quality_status, qa_observations, safety_obs, defects_json, rect_instructions
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-blue-900 font-mono block">7. plms_workflow_approvals</span>
              <p className="text-slate-600 mt-1">
                PK: id &bull; FK: project_id &bull; workflow_type, step_order, initiator_id, current_officer_id, amount, status, signed_hash, decision_date
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200">
              <span className="font-bold text-blue-900 font-mono block">8. plms_immutable_audit_log</span>
              <p className="text-slate-600 mt-1">
                PK: id &bull; FK: project_id &bull; actor_user_id, role, prev_state, new_state, action_type, timestamp, ip_address, digital_signature
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: External Integrations */}
      {activeAdminTab === 'integrations' && (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">State & National Government Systems Integration</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-start space-x-3">
              <Server className="w-5 h-5 text-blue-800 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">1. Gujarat e-Procurement Portal (n-Procure / GeM)</span>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Automated sync of tender notices, corrigendum issuance, bidder registrations, technical scores and commercial quotes.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-start space-x-3">
              <Server className="w-5 h-5 text-emerald-800 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">2. Integrated Financial Management System (IFMS Gujarat)</span>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Direct treasury verification, automated budget release allocation, electronic sanction orders and bill token generation.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-start space-x-3">
              <Server className="w-5 h-5 text-purple-800 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">3. BISAG-N (Bhaskaracharya National Institute for Space Applications and Geo-informatics)</span>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  State cadastral maps, drone orthomosaic overlays, spatial asset geo-tagging and satellite construction verification.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 flex items-start space-x-3">
              <Server className="w-5 h-5 text-amber-800 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900">4. e-Nagar / ULB Municipal Core Enterprise ERP</span>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Two-way synchronization for land acquisition status, municipal utility NOC clearances and post-completion asset handover.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 6: Security & Non-Functional */}
      {activeAdminTab === 'security' && (
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs space-y-3 text-xs">
          <h3 className="font-bold text-slate-900 text-sm">Security, Auditability & SLA Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 flex items-center">
                <Lock className="w-4 h-4 mr-1 text-blue-800" />
                Digital Signature (DSC) Integration
              </span>
              <p className="text-slate-600 text-[11px]">
                Class 3 PKI tokens required for all Administrative Sanctions, Work Order signing, and Running Account bill approvals.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1 text-emerald-800" />
                Cert-In Safe-to-Host Security Audit
              </span>
              <p className="text-slate-600 text-[11px]">
                OWASP Top 10 hardening, TLS 1.3 encryption, AES-256 data at rest and WAF inspection for all public ingress endpoints.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 flex items-center">
                <History className="w-4 h-4 mr-1 text-amber-800" />
                CAG / State Audit Trail Mandate
              </span>
              <p className="text-slate-600 text-[11px]">
                Write-once-read-many (WORM) audit tables storing actor ID, IP address, timestamp, previous state and new state indefinitely.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-800 flex items-center">
                <Cpu className="w-4 h-4 mr-1 text-purple-800" />
                State Data Center (SDC) Hosting
              </span>
              <p className="text-slate-600 text-[11px]">
                High availability deployment across Gandhinagar primary data center and secondary disaster recovery site with 99.9% uptime.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
