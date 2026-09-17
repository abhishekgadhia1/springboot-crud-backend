import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from './Modal';
import {
  Play,
  CheckCircle2,
  ExternalLink,
  Zap,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DemoScenariosModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoScenariosModal: React.FC<DemoScenariosModalProps> = ({ isOpen, onClose }) => {
  const {
    projects,
    setCurrentNav,
    setSelectedProjectId,
    moveProjectStage,
    processApproval,
    approvals,
    setCurrentRole
  } = useApp();

  if (!isOpen) return null;

  const scenarios = [
    {
      id: 1,
      title: '1. Register / Create a Project Scheme',
      module: 'Projects',
      role: 'Project Manager',
      desc: 'Opens the Project Registry with pre-filled form to register new GUDM urban infrastructure scheme.',
      action: () => {
        setCurrentRole('Project Manager');
        setCurrentNav('Projects');
        onClose();
      }
    },
    {
      id: 2,
      title: '2. Advance Scheme Lifecycle Stages',
      module: 'Project Detail Master',
      role: 'Project Manager',
      desc: 'Opens the Master Record of scheme GUDM-AHM-001 with the 18-stage visual stepper and stage transition controls.',
      action: () => {
        setCurrentRole('Project Manager');
        setSelectedProjectId('GUDM-AHM-001');
        onClose();
      }
    },
    {
      id: 3,
      title: '3. Issue Administrative Sanction (AS Approval)',
      module: 'Approvals',
      role: 'Mission Director',
      desc: 'Switches to Mission Director (IAS) and opens the workflow file to endorse Administrative Sanction.',
      action: () => {
        setCurrentRole('Mission Director');
        setCurrentNav('Approvals');
        onClose();
      }
    },
    {
      id: 4,
      title: '4. Issue Financial Approval & Budget Release',
      module: 'Finance',
      role: 'Finance Officer',
      desc: 'Switches to Chief Accounts Officer to verify budget allotment and approve RA bills.',
      action: () => {
        setCurrentRole('Finance Officer');
        setCurrentNav('Finance');
        onClose();
      }
    },
    {
      id: 5,
      title: '5. Draft & Publish Tender / RFP Notice',
      module: 'RFP / Tenders',
      role: 'Procurement Officer',
      desc: 'Switches to Procurement Officer and displays live tender notices, EMD values and submission deadlines.',
      action: () => {
        setCurrentRole('Procurement Officer');
        setCurrentNav('RFP / Tenders');
        onClose();
      }
    },
    {
      id: 6,
      title: '6. Bid Opening & Technical/Financial Evaluation',
      module: 'RFP / Tenders',
      role: 'Chief Engineer',
      desc: 'Inspects comparative statement of bidders, technical qualifying criteria and QCBS/L1 ranking.',
      action: () => {
        setCurrentRole('Chief Engineer');
        setCurrentNav('RFP / Tenders');
        onClose();
      }
    },
    {
      id: 7,
      title: '7. Award Contract to Qualifying Bidder',
      module: 'Contracts',
      role: 'Chief Engineer',
      desc: 'Inspects awarded contract records, performance bank guarantees (PBG) and time extension (EOT) ledger.',
      action: () => {
        setCurrentRole('Chief Engineer');
        setCurrentNav('Contracts');
        onClose();
      }
    },
    {
      id: 8,
      title: '8. Issue Official Work Order & Notice to Proceed',
      module: 'Contracts',
      role: 'Chief Engineer',
      desc: 'Examines signed work orders, contract milestones, defect liability periods and contractor mobilization.',
      action: () => {
        setCurrentRole('Chief Engineer');
        setCurrentNav('Contracts');
        onClose();
      }
    },
    {
      id: 9,
      title: '9. Update Physical % & Financial Progress',
      module: 'Progress Monitoring',
      role: 'Project Manager',
      desc: 'Live tracking of physical vs financial progress, S-curve trajectory and delay day logging.',
      action: () => {
        setCurrentRole('Project Manager');
        setCurrentNav('Progress Monitoring');
        onClose();
      }
    },
    {
      id: 10,
      title: '10. Log Site Inspection & QA Observation',
      module: 'Site Inspections',
      role: 'Quality Inspector',
      desc: 'Quality control tests, field audit reports, safety observations and photo evidences.',
      action: () => {
        setCurrentRole('Field Inspection Officer' as any);
        setCurrentNav('Site Inspections');
        onClose();
      }
    },
    {
      id: 11,
      title: '11. Record Critical Bottleneck & Escalate Issue',
      module: 'Issues & Risks',
      role: 'Project Manager',
      desc: 'Registers statutory utility shifting delays or land clearances and routes escalation to Mission Director.',
      action: () => {
        setCurrentRole('Project Manager');
        setCurrentNav('Issues & Risks');
        onClose();
      }
    },
    {
      id: 12,
      title: '12. Execute Workflow Decision (Approve / Reject)',
      module: 'Approvals',
      role: 'Mission Director',
      desc: 'Signs and disposes pending files in the digital e-File approval workflow inbox.',
      action: () => {
        setCurrentRole('Mission Director');
        setCurrentNav('Approvals');
        onClose();
      }
    },
    {
      id: 13,
      title: '13. Upload & Inspect Sanction Document',
      module: 'Documents',
      role: 'Project Manager',
      desc: 'Digital repository of DPRs, Administrative Sanctions, Technical Sanctions and CAD drawings with versioning.',
      action: () => {
        setCurrentRole('Project Manager');
        setCurrentNav('Documents');
        onClose();
      }
    },
    {
      id: 14,
      title: '14. Inspect Gujarat State GIS Spatial Map',
      module: 'GIS Map',
      role: 'Super Administrator',
      desc: 'Interactive state map with clickable project pins, district filtering, sector layers and coordinates.',
      action: () => {
        setCurrentNav('GIS Map');
        onClose();
      }
    },
    {
      id: 15,
      title: '15. Generate Departmental & Cabinet MIS Report',
      module: 'Reports',
      role: 'Senior Management',
      desc: 'Preview 12 standard departmental reports, delayed scheme slippages and export to PDF/Excel.',
      action: () => {
        setCurrentRole('Senior Management');
        setCurrentNav('Reports');
        onClose();
      }
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Departmental Verification Scenarios (15 Mandated Paths)"
      subtitle="One-click launchers to test and demonstrate the complete PLMS lifecycle for GUDM evaluators"
      maxWidth="3xl"
    >
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 text-xs">
        <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-700 flex-shrink-0" />
            <span className="text-blue-900 font-medium">
              Click any scenario below to automatically switch to the designated government role and open the corresponding screen.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {scenarios.map(sc => (
            <div
              key={sc.id}
              onClick={sc.action}
              className="p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-700 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-900 group-hover:text-blue-900 transition-colors">
                    {sc.title}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                    {sc.module}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2">{sc.desc}</p>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-500 font-medium">
                  Role: <strong className="text-slate-800">{sc.role}</strong>
                </span>
                <span className="inline-flex items-center font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform">
                  Launch Demo <ArrowRight className="w-3 h-3 ml-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
