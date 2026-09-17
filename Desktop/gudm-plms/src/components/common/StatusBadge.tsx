import React from 'react';
import { RiskLevel, PriorityLevel, ProjectStatus, ProjectStage } from '../../types';

interface StatusBadgeProps {
  status?: ProjectStatus | string;
  stage?: ProjectStage | string;
  risk?: RiskLevel;
  priority?: PriorityLevel;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  stage,
  risk,
  priority,
  size = 'md'
}) => {
  const pad = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  if (status) {
    switch (status) {
      case 'Planning':
        return <span className={`inline-flex items-center rounded border border-blue-200 bg-blue-50 text-blue-800 ${pad}`}>Planning</span>;
      case 'Under RFP':
        return <span className={`inline-flex items-center rounded border border-purple-200 bg-purple-50 text-purple-800 ${pad}`}>Under RFP</span>;
      case 'Awarded':
        return <span className={`inline-flex items-center rounded border border-indigo-200 bg-indigo-50 text-indigo-800 ${pad}`}>Awarded</span>;
      case 'In Execution':
        return <span className={`inline-flex items-center rounded border border-emerald-200 bg-emerald-50 text-emerald-800 ${pad}`}>In Execution</span>;
      case 'Delayed':
        return <span className={`inline-flex items-center rounded border border-amber-300 bg-amber-50 text-amber-900 ${pad}`}>Delayed</span>;
      case 'Completed':
        return <span className={`inline-flex items-center rounded border border-teal-200 bg-teal-50 text-teal-800 ${pad}`}>Completed</span>;
      case 'On Hold':
        return <span className={`inline-flex items-center rounded border border-slate-300 bg-slate-100 text-slate-700 ${pad}`}>On Hold</span>;
      default:
        return <span className={`inline-flex items-center rounded border border-slate-200 bg-slate-50 text-slate-700 ${pad}`}>{status}</span>;
    }
  }

  if (risk) {
    switch (risk) {
      case 'Low':
        return <span className={`inline-flex items-center rounded border border-slate-200 bg-slate-100 text-slate-700 ${pad}`}>Low Risk</span>;
      case 'Medium':
        return <span className={`inline-flex items-center rounded border border-amber-200 bg-amber-50 text-amber-800 ${pad}`}>Medium Risk</span>;
      case 'High':
        return <span className={`inline-flex items-center rounded border border-orange-200 bg-orange-50 text-orange-800 ${pad}`}>High Risk</span>;
      case 'Critical':
        return <span className={`inline-flex items-center rounded border border-rose-300 bg-rose-50 text-rose-800 ${pad}`}>Critical Risk</span>;
    }
  }

  if (priority) {
    switch (priority) {
      case 'Chief Minister Mission':
        return <span className={`inline-flex items-center rounded border border-rose-200 bg-rose-50 font-bold text-rose-800 ${pad}`}>CM Mission</span>;
      case 'Priority':
        return <span className={`inline-flex items-center rounded border border-blue-200 bg-blue-50 font-semibold text-blue-800 ${pad}`}>Priority</span>;
      case 'High':
        return <span className={`inline-flex items-center rounded border border-indigo-200 bg-indigo-50 text-indigo-800 ${pad}`}>High</span>;
      default:
        return <span className={`inline-flex items-center rounded border border-slate-200 bg-slate-50 text-slate-600 ${pad}`}>Standard</span>;
    }
  }

  if (stage) {
    return (
      <span className={`inline-flex items-center rounded border border-slate-300 bg-white font-medium text-slate-800 ${pad}`}>
        {stage}
      </span>
    );
  }

  return null;
};
