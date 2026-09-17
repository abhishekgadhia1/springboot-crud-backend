import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { ProjectDetailModal } from './components/projects/ProjectDetailModal';
import { DemoScenariosModal } from './components/common/DemoScenariosModal';

// Functional Views
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { ProjectRegistry } from './components/projects/ProjectRegistry';
import { ProjectPlanning } from './components/planning/ProjectPlanning';
import { RfpManagement } from './components/rfp/RfpManagement';
import { ContractManagement } from './components/contracts/ContractManagement';
import { ProjectDelivery } from './components/delivery/ProjectDelivery';
import { ProgressMonitoring } from './components/monitoring/ProgressMonitoring';
import { SiteInspections } from './components/inspections/SiteInspections';
import { FinanceModule } from './components/finance/FinanceModule';
import { DocumentRepository } from './components/documents/DocumentRepository';
import { IssueRiskRegister } from './components/risks/IssueRiskRegister';
import { ApprovalWorkflow } from './components/approvals/ApprovalWorkflow';
import { GisProjectMap } from './components/gis/GisProjectMap';
import { ReportsModule } from './components/reports/ReportsModule';
import { NotificationsModule } from './components/notifications/NotificationsModule';
import { AdministrationModule } from './components/admin/AdministrationModule';

import { Sparkles, HelpCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { currentNav, selectedProjectId, setSelectedProjectId, projects } = useApp();
  const [showScenariosModal, setShowScenariosModal] = useState(false);

  const selectedProject = selectedProjectId
    ? projects.find(p => p.id === selectedProjectId) || null
    : null;

  const renderActiveModule = () => {
    switch (currentNav) {
      case 'Dashboard':
        return <ExecutiveDashboard />;
      case 'Projects':
        return <ProjectRegistry />;
      case 'Project Planning':
        return <ProjectPlanning />;
      case 'RFP / Tenders':
        return <RfpManagement />;
      case 'Contracts':
        return <ContractManagement />;
      case 'Project Delivery':
        return <ProjectDelivery />;
      case 'Progress Monitoring':
        return <ProgressMonitoring />;
      case 'Site Inspections':
        return <SiteInspections />;
      case 'Finance':
        return <FinanceModule />;
      case 'Documents':
        return <DocumentRepository />;
      case 'Issues & Risks':
        return <IssueRiskRegister />;
      case 'Approvals':
        return <ApprovalWorkflow />;
      case 'GIS Map':
        return <GisProjectMap />;
      case 'Reports':
        return <ReportsModule />;
      case 'Notifications':
        return <NotificationsModule />;
      case 'Administration':
        return <AdministrationModule />;
      default:
        return <ExecutiveDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col">
      <Header />

      <div className="flex flex-1 relative">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full overflow-x-hidden">
          {renderActiveModule()}
        </main>
      </div>

      {/* Floating Demo Scenarios Launcher Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setShowScenariosModal(true)}
          className="flex items-center space-x-2 bg-[#0E355C] hover:bg-[#092644] text-white px-3.5 py-2.5 rounded-full shadow-lg border border-amber-400/80 transition-transform hover:scale-105 text-xs font-semibold"
          title="Open Guided Test Scenarios for GUDM PLMS Prototype"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>15 Demo Scenarios</span>
        </button>
      </div>

      {/* 15 Demo Scenarios Modal */}
      <DemoScenariosModal
        isOpen={showScenariosModal}
        onClose={() => setShowScenariosModal(false)}
      />

      {/* Central Project Master Record Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
        />
      )}

      {/* Departmental Footer */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1 max-w-[1600px] mx-auto">
          <span>
            &copy; {new Date().getFullYear()} Gujarat Urban Development Mission (GUDM), Urban Development & Urban Housing Department, Govt. of Gujarat.
          </span>
          <span className="text-[11px] text-slate-400">
            Internal Departmental Prototype &bull; For Architecture Evaluation Only
          </span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
