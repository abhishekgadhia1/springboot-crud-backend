import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectMaster, ProjectCategory, ProjectStatus, RiskLevel } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { ProjectDetailModal } from './ProjectDetailModal';
import { Modal } from '../common/Modal';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Download,
  Eye,
  Building,
  CheckCircle2,
  Calendar,
  IndianRupee,
  MapPin
} from 'lucide-react';

export const ProjectRegistry: React.FC = () => {
  const { projects, createProject, selectedProjectId, setSelectedProjectId } = useApp();

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedRisk, setSelectedRisk] = useState<string>('All');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // New Project Registration Modal State (Demo Scenario 1)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<Partial<ProjectMaster>>({
    name: '',
    category: 'Water Supply & Sewerage',
    type: 'Greenfield Infrastructure',
    description: '',
    district: 'Ahmedabad',
    ulb: 'Ahmedabad Municipal Corporation (AMC)',
    location: '',
    department: 'Urban Water Supply Directorate',
    implementingAgency: 'Ahmedabad Municipal Corporation',
    projectManager: 'Er. R. S. Jadeja (Executive Engineer)',
    estimatedCost: 65.0,
    approvedCost: 62.5,
    fundingSource: 'Swarnim Jayanti Mukhya Mantri Shehri Vikas Yojana (SJMMSVY)',
    plannedStartDate: '2025-05-01',
    plannedCompletionDate: '2026-11-30',
    riskLevel: 'Low',
    priority: 'Standard'
  });

  // Extract unique filter options
  const districts = useMemo(() => {
    return Array.from(new Set(projects.map(p => p.district))).sort();
  }, [projects]);

  const categories = useMemo(() => {
    return Array.from(new Set(projects.map(p => p.category))).sort();
  }, [projects]);

  // Filtered List
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchSearch =
        searchTerm === '' ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.ulb.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.contractor && p.contractor.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchDistrict = selectedDistrict === 'All' || p.district === selectedDistrict;
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchStatus = selectedStatus === 'All' || p.currentStatus === selectedStatus;
      const matchRisk = selectedRisk === 'All' || p.riskLevel === selectedRisk;

      return matchSearch && matchDistrict && matchCategory && matchStatus && matchRisk;
    });
  }, [projects, searchTerm, selectedDistrict, selectedCategory, selectedStatus, selectedRisk]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  // Handle Form Submit (Demo Scenario 1)
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Please provide a valid project scheme title.');
      return;
    }
    const created = createProject(formData);
    setShowCreateModal(false);
    setSelectedProjectId(created.id);
  };

  const handleExportCSV = () => {
    const headers = 'Project ID,Project Name,District,Category,Approved Cost (Cr),Physical %,Financial %,Status,Risk\n';
    const rows = filteredProjects
      .map(
        p =>
          `"${p.id}","${p.name.replace(/"/g, '""')}","${p.district}","${p.category}",${p.approvedCost},${p.physicalProgress},${p.financialProgress},"${p.currentStatus}","${p.riskLevel}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `GUDM_Project_Registry_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Header & Controls */}
      <Breadcrumbs currentModule="Project Registry" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Central Project Master Registry</h2>
          <p className="text-xs text-slate-600">
            Comprehensive lifecycle ledger of all approved and ongoing urban infrastructure schemes in Gujarat
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-3 py-1.5 text-xs font-medium rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#092644] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Register New Project
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-3 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {/* Search bar */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, Scheme Title, ULB or Contractor..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-blue-700 focus:outline-none bg-slate-50/50 focus:bg-white"
            />
          </div>

          {/* District Filter */}
          <div>
            <select
              value={selectedDistrict}
              onChange={e => {
                setSelectedDistrict(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2 border border-slate-300 rounded text-xs bg-white text-slate-700"
            >
              <option value="All">All Districts ({districts.length})</option>
              {districts.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2 border border-slate-300 rounded text-xs bg-white text-slate-700"
            >
              <option value="All">All Sectors ({categories.length})</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={e => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-1.5 px-2 border border-slate-300 rounded text-xs bg-white text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="Planning">Planning</option>
              <option value="Under RFP">Under RFP</option>
              <option value="Awarded">Awarded</option>
              <option value="In Execution">In Execution</option>
              <option value="Delayed">Delayed</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Applied Filter Tags & Count */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredProjects.length}</strong> schemes matching criteria
          </span>
          {(searchTerm || selectedDistrict !== 'All' || selectedCategory !== 'All' || selectedStatus !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDistrict('All');
                setSelectedCategory('All');
                setSelectedStatus('All');
                setSelectedRisk('All');
              }}
              className="text-blue-700 hover:underline font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Central Projects Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E355C] text-white uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-2.5 px-3">Project ID</th>
                <th className="py-2.5 px-3">Scheme Title & Details</th>
                <th className="py-2.5 px-3">District / ULB</th>
                <th className="py-2.5 px-3 text-right">Approved Outlay</th>
                <th className="py-2.5 px-3 text-center">Physical %</th>
                <th className="py-2.5 px-3 text-center">Financial %</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-center">Risk</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No schemes found matching the selected search criteria.
                  </td>
                </tr>
              ) : (
                paginatedProjects.map(project => (
                  <tr
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    {/* Project ID */}
                    <td className="py-3 px-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                      {project.id}
                    </td>

                    {/* Scheme Title & Details */}
                    <td className="py-3 px-3 max-w-sm">
                      <div className="font-bold text-slate-900 line-clamp-1">{project.name}</div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="font-medium text-slate-700">{project.category}</span>
                        <span>&bull;</span>
                        <span>Stage: {project.currentStage}</span>
                      </div>
                    </td>

                    {/* District / ULB */}
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-800 block">{project.district}</span>
                      <span className="text-[11px] text-slate-500 line-clamp-1">{project.ulb}</span>
                    </td>

                    {/* Outlay */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800 whitespace-nowrap">
                      ₹ {project.approvedCost.toFixed(1)} Cr
                    </td>

                    {/* Physical Progress */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center space-x-1">
                        <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              project.physicalProgress >= 100
                                ? 'bg-teal-600'
                                : project.delayDays > 0
                                ? 'bg-amber-500'
                                : 'bg-blue-700'
                            }`}
                            style={{ width: `${project.physicalProgress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">{project.physicalProgress}%</span>
                      </div>
                    </td>

                    {/* Financial Progress */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center space-x-1">
                        <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${project.financialProgress}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">{project.financialProgress}%</span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <StatusBadge status={project.currentStatus} size="sm" />
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <StatusBadge risk={project.riskLevel} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedProjectId(project.id);
                        }}
                        className="p-1 text-blue-800 hover:bg-blue-100/60 rounded"
                        title="Open Project Master"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination Bar */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-2.5 py-1 rounded border text-xs font-semibold ${
                    currentPage === p
                      ? 'bg-[#0E355C] text-white border-[#0E355C]'
                      : 'border-slate-300 bg-white hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Register New Project Scheme (Demo Scenario 1) */}
      {showCreateModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowCreateModal(false)}
          title="New Project Scheme Registration"
          subtitle="Formulate initial project master record for GUDM sanction"
          maxWidth="3xl"
        >
          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-800 block mb-1">
                  Project Scheme Title <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Vadodara South Zone Underground Sewerage Network Augmentation"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-medium focus:ring-1 focus:ring-blue-700"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Category / Sector</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as ProjectCategory })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="Water Supply & Sewerage">Water Supply & Sewerage</option>
                    <option value="Stormwater Drainage">Stormwater Drainage</option>
                    <option value="Urban Roads & Bridges">Urban Roads & Bridges</option>
                    <option value="Solid Waste Management">Solid Waste Management</option>
                    <option value="Urban Transport & EV">Urban Transport & EV</option>
                    <option value="Lake Rejuvenation & Green Space">Lake Rejuvenation & Green Space</option>
                    <option value="Smart City & Digital Infra">Smart City & Digital Infra</option>
                    <option value="Affordable Housing & Slum Upgradation">Affordable Housing</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Infrastructure Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="Greenfield Infrastructure">Greenfield Infrastructure</option>
                    <option value="Capacity Expansion">Capacity Expansion</option>
                    <option value="Modernization">Modernization</option>
                    <option value="Brownfield Augmentation">Brownfield Augmentation</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">District</label>
                  <select
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    {[
                      'Ahmedabad',
                      'Surat',
                      'Vadodara',
                      'Rajkot',
                      'Bhavnagar',
                      'Jamnagar',
                      'Junagadh',
                      'Gandhinagar',
                      'Anand',
                      'Mehsana',
                      'Kutch',
                      'Bharuch',
                      'Navsari',
                      'Porbandar'
                    ].map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Urban Local Body (ULB) / Authority</label>
                  <input
                    type="text"
                    value={formData.ulb}
                    onChange={e => setFormData({ ...formData, ulb: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Site Location Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Tarsali - Makarpura Industrial Corridor"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-800 block mb-1">Detailed Scheme Description</label>
                <textarea
                  rows={2}
                  placeholder="Provide scope, population served, capacity metrics and design criteria..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-slate-300 rounded p-2 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Estimated Outlay (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.estimatedCost}
                    onChange={e => setFormData({ ...formData, estimatedCost: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Approved Outlay (₹ Cr)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.approvedCost}
                    onChange={e => setFormData({ ...formData, approvedCost: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded p-2 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Funding Mission / Scheme</label>
                  <select
                    value={formData.fundingSource}
                    onChange={e => setFormData({ ...formData, fundingSource: e.target.value as any })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  >
                    <option value="Swarnim Jayanti Mukhya Mantri Shehri Vikas Yojana (SJMMSVY)">SJMMSVY</option>
                    <option value="AMRUT 2.0">AMRUT 2.0</option>
                    <option value="Smart Cities Mission">Smart Cities Mission</option>
                    <option value="World Bank / GUDM Urban Resilient Fund">World Bank Fund</option>
                    <option value="State Budget Grant">State Budget Grant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Planned Start Date</label>
                  <input
                    type="date"
                    value={formData.plannedStartDate}
                    onChange={e => setFormData({ ...formData, plannedStartDate: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-800 block mb-1">Target Completion Date</label>
                  <input
                    type="date"
                    value={formData.plannedCompletionDate}
                    onChange={e => setFormData({ ...formData, plannedCompletionDate: e.target.value })}
                    className="w-full border border-slate-300 rounded p-2 bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644] shadow-xs"
              >
                Generate Project ID & Register
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Project Detail Master View Modal */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProjectId(null)}
        />
      )}
    </div>
  );
};
