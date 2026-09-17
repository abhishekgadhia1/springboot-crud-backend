import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { DocumentCategory, DocumentRecord } from '../../types';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { Modal } from '../common/Modal';
import {
  FileArchive,
  Upload,
  Search,
  Filter,
  FileText,
  Download,
  CheckCircle2,
  Calendar,
  User,
  Eye
} from 'lucide-react';

export const DocumentRepository: React.FC = () => {
  const { documents, projects, uploadDocument } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form State (Demo Scenario 13)
  const [upProjectId, setUpProjectId] = useState(projects[0]?.id || '');
  const [upTitle, setUpTitle] = useState('');
  const [upCategory, setUpCategory] = useState<DocumentCategory>('Administrative approval');
  const [upFileName, setUpFileName] = useState('Govt_Sanction_Order_2025.pdf');

  const categories: DocumentCategory[] = [
    'Project proposal',
    'Administrative approval',
    'Technical sanction',
    'Financial approval',
    'RFP',
    'Bid documents',
    'Evaluation documents',
    'Contract',
    'Drawings',
    'Site inspection reports',
    'Bills',
    'Progress reports',
    'Completion certificate',
    'Handover documents'
  ];

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchSearch =
        searchTerm === '' ||
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = selectedCategory === 'All' || doc.category === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [documents, searchTerm, selectedCategory]);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prj = projects.find(p => p.id === upProjectId);
    uploadDocument({
      projectId: upProjectId,
      projectName: prj ? prj.name : 'Urban Scheme',
      title: upTitle || 'Official Government Order',
      category: upCategory,
      fileName: upFileName || 'Sanction_Note.pdf'
    });
    setShowUploadModal(false);
    setUpTitle('');
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="Document Repository" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Central Government Document & Sanction Repository</h2>
          <p className="text-xs text-slate-600">
            Categorized digital archive of DPRs, Administrative Approvals (AS), Technical Sanctions (TS), Contracts & CAD Drawings
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded bg-[#0E355C] text-white hover:bg-[#092644] transition-colors shadow-xs"
        >
          <Upload className="w-3.5 h-3.5 mr-1" />
          Upload Official Document
        </button>
      </div>

      {/* Toolbar: Category Chips & Search */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2 text-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search document title, scheme name or officer..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded text-xs bg-slate-50 focus:bg-white focus:outline-none"
            />
          </div>

          <div className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{filteredDocs.length}</strong> verified documents
          </div>
        </div>

        {/* Categories scrollable pill filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[11px]">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap font-medium transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0E355C] text-white uppercase text-[10px] font-semibold tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Doc ID</th>
                <th className="py-2.5 px-3">Document Title & File</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Linked Scheme</th>
                <th className="py-2.5 px-3">Version</th>
                <th className="py-2.5 px-3">Upload Date & Officer</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No documents found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{doc.id}</td>
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-800 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-slate-900 block line-clamp-1">{doc.title}</span>
                          <span className="font-mono text-[10px] text-slate-500">{doc.fileName} &bull; {doc.fileSize}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-xs text-slate-700 font-medium line-clamp-1">
                      {doc.projectName}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 font-semibold">{doc.version}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                      <div>{doc.uploadDate}</div>
                      <div className="text-[10px] text-slate-400">{doc.uploadedBy}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap space-x-1">
                      <button
                        onClick={() => alert(`Simulated downloading ${doc.fileName}`)}
                        className="px-2 py-1 text-xs rounded border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium"
                      >
                        <Download className="w-3 h-3 inline mr-1" />
                        Download
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Upload Official Document (Demo Scenario 13) */}
      {showUploadModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowUploadModal(false)}
          title="Upload Official Document Artifact"
          subtitle="Deposit into immutable GUDM Document Repository"
        >
          <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Project Scheme</label>
              <select
                value={upProjectId}
                onChange={e => setUpProjectId(e.target.value)}
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
              <label className="font-semibold text-slate-700 block mb-1">Official Document Title</label>
              <input
                type="text"
                required
                value={upTitle}
                onChange={e => setUpTitle(e.target.value)}
                placeholder="e.g., Chief Engineer Technical Sanction Order Revision 1"
                className="w-full border border-slate-300 rounded p-2 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Document Category</label>
                <select
                  value={upCategory}
                  onChange={e => setUpCategory(e.target.value as any)}
                  className="w-full border border-slate-300 rounded p-2 bg-white"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">File Name Attachment</label>
                <input
                  type="text"
                  value={upFileName}
                  onChange={e => setUpFileName(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 bg-white font-mono"
                />
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded border border-dashed border-slate-300 text-center text-slate-500 text-xs">
              <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
              <span>Simulated drag-and-drop or PDF file selection</span>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-[#0E355C] text-white font-semibold hover:bg-[#092644]"
              >
                Upload & Register Version 1.0
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
