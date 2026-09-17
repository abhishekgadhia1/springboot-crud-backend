import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderGit2,
  FileSpreadsheet,
  FileText,
  Briefcase,
  Layers,
  Activity,
  ClipboardCheck,
  IndianRupee,
  FileArchive,
  AlertOctagon,
  CheckSquare,
  MapPin,
  BarChart3,
  BellRing,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentNav, setCurrentNav, approvals, issuesRisks, notifications } = useApp();

  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending').length;
  const criticalIssuesCount = issuesRisks.filter(i => i.severity === 'Critical' || i.severity === 'High').length;
  const unreadAlertsCount = notifications.filter(n => !n.read).length;

  const menuSections = [
    {
      title: 'CORE OVERSIGHT',
      items: [
        { id: 'Dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'Projects', label: 'Project Registry', icon: FolderGit2 },
        { id: 'GIS Map', label: 'GIS Project Map', icon: MapPin },
      ]
    },
    {
      title: 'LIFECYCLE & PROCUREMENT',
      items: [
        { id: 'Project Planning', label: 'Project Planning', icon: FileSpreadsheet },
        { id: 'RFP / Tenders', label: 'RFP / Tenders', icon: FileText },
        { id: 'Contracts', label: 'Contracts Management', icon: Briefcase },
      ]
    },
    {
      title: 'EXECUTION & MONITORING',
      items: [
        { id: 'Project Delivery', label: 'Project Delivery & WBS', icon: Layers },
        { id: 'Progress Monitoring', label: 'Progress Monitoring', icon: Activity },
        { id: 'Site Inspections', label: 'Site Inspections', icon: ClipboardCheck },
        { id: 'Finance', label: 'Finance & Payments', icon: IndianRupee },
        { id: 'Documents', label: 'Document Repository', icon: FileArchive },
      ]
    },
    {
      title: 'GOVERNANCE & GO-LIVE',
      items: [
        {
          id: 'Issues & Risks',
          label: 'Issues & Risks',
          icon: AlertOctagon,
          badge: criticalIssuesCount > 0 ? criticalIssuesCount : undefined,
          badgeColor: 'bg-rose-100 text-rose-800'
        },
        {
          id: 'Approvals',
          label: 'Workflow & Approvals',
          icon: CheckSquare,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeColor: 'bg-amber-100 text-amber-800'
        },
        { id: 'Reports', label: 'Reports & Analytics', icon: BarChart3 },
        {
          id: 'Notifications',
          label: 'Alerts & Escalations',
          icon: BellRing,
          badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
          badgeColor: 'bg-blue-100 text-blue-800'
        },
        { id: 'Administration', label: 'Administration & Specs', icon: ShieldCheck },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#0A2540] text-slate-200 flex-shrink-0 flex flex-col h-[calc(100vh-85px)] sticky top-[85px] border-r border-slate-700/60 select-none overflow-y-auto">
      {/* Navigation Sections */}
      <nav className="p-3 space-y-5 flex-1">
        {menuSections.map((section, idx) => (
          <div key={idx}>
            <div className="px-2.5 mb-1.5 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = currentNav === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentNav(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-[#184979] text-white shadow-xs font-semibold'
                        : 'text-slate-300 hover:bg-[#12385e] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 flex-shrink-0 transition-colors ${
                          isActive ? 'text-amber-400' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 flex-shrink-0">
                      {item.badge !== undefined && (
                        <span className={`px-1.5 py-0.2 text-[10px] font-bold rounded-full ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Internal System Audit Indicator Footer */}
      <div className="p-3 bg-[#071b30] border-t border-slate-700/50 text-[10px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between text-slate-300">
          <span className="font-semibold uppercase tracking-wider">PLMS Engine v1.0.4</span>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" title="System Online"></span>
        </div>
        <p className="text-slate-400">GUDM NIC Gujarat Data Center</p>
        <p className="text-slate-500 font-mono text-[9px]">ID: 8ae181f7-GUDM-PROT</p>
      </div>
    </aside>
  );
};
