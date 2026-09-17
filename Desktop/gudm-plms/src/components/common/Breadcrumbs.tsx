import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface BreadcrumbsProps {
  currentModule: string;
  subItem?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ currentModule, subItem }) => {
  const { setCurrentNav } = useApp();

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-slate-500 mb-4 select-none">
      <button
        onClick={() => setCurrentNav('Dashboard')}
        className="flex items-center hover:text-blue-900 transition-colors"
      >
        <Home className="w-3.5 h-3.5 mr-1 text-slate-400" />
        <span>GUDM PLMS</span>
      </button>
      <ChevronRight className="w-3 h-3 text-slate-400" />
      <span className="font-semibold text-slate-800">{currentModule}</span>
      {subItem && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-blue-900 font-medium truncate max-w-xs">{subItem}</span>
        </>
      )}
    </nav>
  );
};
