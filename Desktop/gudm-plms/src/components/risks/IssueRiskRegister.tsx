import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { IssueRiskRecord, RiskLevel } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import { Modal } from '../common/Modal';
import {
  AlertOctagon,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';

export const IssueRiskRegister: React.FC = () => {
  const { issuesRisks, projects, addIssueRisk, updateIssueStatus, setSelectedProjectId } = useApp();

  const [typeFilter, setTypeFilter] = useState<'All' | 'Issue' | 'Risk'>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State (Demo Scenario 10)
  const [targetProjectId, setTargetProjectId] = useState(projects[0]?.id || '');
  const [itemType, setItemType] = useState<'Issue' | 'Risk'>('Issue');
  const [category, setCategory] = useState<any>('Technical');
  const [severity, setSeverity] = useState<RiskLevel>('High');
  const [desc, setDesc] = useState('');
  const [action, setAction] = useState('');

  const filteredItems = useMemo(() => {
    return issuesRisks.filter(item => {
      const matchType = typeFilter === 'All' || item.type === typeFilter;
      const matchSeverity = severityFilter === 'All' || item.severity === severityFilter;
      return matchType && matchSeverity;
    });
  }, [issuesRisks, typeFilter, severityFilter]);

  const criticalCount = issuesRisks.filter(i => i.severity === 'Critical').length;
  const highCount = issuesRisks.filter(i => i.severity === 'High').length;
  const openCount = issuesRisks.filter(i => i.status === 'Open' || i.status === 'Escalated').length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === targetProjectId);
    addIssueRisk({
      projectId: targetProjectId,
      projectName: prj ? prj.name : 'Urban Scheme',
      type: itemType,
      category,
      severity,
      description: desc || 'Statutory clearance coordination in progress with local revenue authority.',
      correctiveAction: action || 'High-level meeting scheduled with District Collector.'
    });
    setShowAddModal(false);
    setDesc('');
    setAction('');
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="Issues & Risk Register" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Enterprise Issue & Risk Governance Register</h2>
          <p className="text-xs text-slate-600">
            Escalation management, statutory clearance bottlenecks, contract disputes and risk mitigation plans
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#092644] transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1" />
          Log Issue / Risk
        </button>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-rose-800 uppercase">Critical Severity</div>
          <div className="text-2xl font-bold text-rose-700 mt-0.5">{criticalCount}</div>
          <div className="text-[10px] text-slate-500">Requires Mission Director intervention</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-amber-800 uppercase">High Severity</div>
          <div className="text-2xl font-bold text-amber-700 mt-0.5">{highCount}</div>
          <div className="text-[10px] text-slate-500">Chief Engineer review active</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-blue-900 uppercase">Open / Escalated Items</div>
          <div className="text-2xl font-bold text-blue-900 mt-0.5">{openCount}</div>
          <div className="text-[10px] text-slate-500">Pending resolution or signoff</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-emerald-800 uppercase">Resolved Items</div>
          <div className="text-2xl font-bold text-emerald-700 mt-0.5">
            {issuesRisks.filter(i => i.status === 'Resolved').length}
          </div>
          <div className="text-[10px] text-slate-500">Mitigated successfully</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-700">Filter By Type:</span>
          {['All', 'Issue', 'Risk'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t as any)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                typeFilter === t
                  ? 'bg-blue-800 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold text-slate-700">Severity:</span>
          <select
            value={severityFilter}
            onChange={e => setSeverityFilter(e.target.value)}
            className="border border-slate-300 rounded p-1 bg-white"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Issues & Risks Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E355C] text-white uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">ID & Type</th>
                <th className="py-2.5 px-3">Scheme Title</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-center">Severity</th>
                <th className="py-2.5 px-3">Description & Impact</th>
                <th className="py-2.5 px-3">Mitigation / Corrective Action</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono">
                    <span className="font-bold text-blue-900 block">{item.id}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">{item.type}</span>
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-900 max-w-xs line-clamp-1">
                    {item.projectName}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-700">{item.category}</td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <StatusBadge risk={item.severity} size="sm" />
                  </td>
                  <td className="py-2.5 px-3 text-slate-800 text-[11px] max-w-xs">{item.description}</td>
                  <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-xs">{item.correctiveAction}</td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'Escalated'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1">
                    {item.status !== 'Resolved' ? (
                      <button
                        onClick={() => updateIssueStatus(item.id, 'Resolved')}
                        className="px-2 py-1 text-xs rounded bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 font-semibold"
                      >
                        Resolve
                      </button>
                    ) : (
                      <button
                        onClick={() => updateIssueStatus(item.id, 'In Progress')}
                        className="px-2 py-1 text-xs rounded bg-slate-100 text-slate-600 hover:bg-slate-200"
                      >
                        Re-open
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedProjectId(item.projectId)}
                      className="px-2 py-1 text-xs rounded border border-slate-300 hover:bg-slate-100"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Log New Issue / Risk (Demo Scenario 10) */}
      {showAddModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowAddModal(false)}
          title="Register Project Bottleneck / Risk"
          subtitle="Submit formal escalation into GUDM Risk Ledger"
        >
          <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Scheme</label>
              <select
                value={targetProjectId}
                onChange={e => setTargetProjectId(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 bg-white font-medium"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.id} - {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Classification</label>
                <select
                  value={itemType}
                  onChange={e => setItemType(e.target.value as any)}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-bold"
                >
                  <option value="Issue">Issue (Active Problem)</option>
                  <option value="Risk">Risk (Foreseeable Threat)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
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
                <label className="font-semibold text-slate-700 block mb-1">Severity Rating</label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value as any)}
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
              <label className="font-semibold text-slate-700 block mb-1">Bottleneck Description</label>
              <textarea
                required
                value={desc}
                onChange={e => setDesc(e.target.value)}
                rows={2}
                placeholder="Specify precise cause, affected works and impact on schedule..."
                className="w-full border border-slate-300 rounded p-2 bg-white"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mitigation / Escalation Action</label>
              <textarea
                value={action}
                onChange={e => setAction(e.target.value)}
                rows={2}
                placeholder="Departmental escalation or contractor instruction..."
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
                Register & Escalate
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
