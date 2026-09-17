import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import { StatusBadge } from '../common/StatusBadge';
import { ProjectMaster } from '../../types';
import {
  MapPin,
  Filter,
  Search,
  Eye,
  Layers,
  Building,
  Activity,
  ArrowUpRight,
  Maximize2
} from 'lucide-react';

export const GisProjectMap: React.FC = () => {
  const { projects, setSelectedProjectId } = useApp();

  const [selectedDistrict, setSelectedDistrict] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePinProject, setActivePinProject] = useState<ProjectMaster | null>(projects[0] || null);

  const districts = useMemo(() => Array.from(new Set(projects.map(p => p.district))).sort(), [projects]);
  const categories = useMemo(() => Array.from(new Set(projects.map(p => p.category))).sort(), [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const matchDist = selectedDistrict === 'All' || p.district === selectedDistrict;
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      return matchDist && matchCat;
    });
  }, [projects, selectedDistrict, selectedCategory]);

  // Gujarat bounding coordinates approximately:
  // Lat: 20.1 to 24.7
  // Lng: 68.1 to 74.4
  const minLat = 20.4;
  const maxLat = 24.5;
  const minLng = 68.6;
  const maxLng = 74.4;

  const getCoordinatesPct = (lat: number, lng: number) => {
    // Invert lat for Y-axis (top = maxLat, bottom = minLat)
    const yPct = ((maxLat - lat) / (maxLat - minLat)) * 82 + 8;
    const xPct = ((lng - minLng) / (maxLng - minLng)) * 82 + 8;
    return {
      top: `${Math.max(5, Math.min(92, yPct))}%`,
      left: `${Math.max(5, Math.min(92, xPct))}%`
    };
  };

  const getPinColor = (status: string) => {
    switch (status) {
      case 'In Execution':
        return 'bg-emerald-600 border-emerald-800';
      case 'Delayed':
        return 'bg-amber-500 border-amber-700';
      case 'Under RFP':
        return 'bg-purple-600 border-purple-800';
      case 'Awarded':
        return 'bg-blue-600 border-blue-800';
      case 'Completed':
        return 'bg-teal-600 border-teal-800';
      default:
        return 'bg-blue-800 border-blue-950';
    }
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="GIS Project Map" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">Geographic Information System (GIS) State Map</h2>
          <p className="text-xs text-slate-600">
            Spatial distribution, geo-tagged site footprints and district infrastructure coverage across Gujarat
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-600">Active Map Pins:</span>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold font-mono">
            {filteredProjects.length} Schemes
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-700">District:</span>
            <select
              value={selectedDistrict}
              onChange={e => setSelectedDistrict(e.target.value)}
              className="border border-slate-300 rounded p-1 bg-white font-medium"
            >
              <option value="All">All Gujarat ({districts.length})</option>
              {districts.map(d => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="font-semibold text-slate-700">Sector:</span>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="border border-slate-300 rounded p-1 bg-white font-medium"
            >
              <option value="All">All Sectors ({categories.length})</option>
              {categories.map(c => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-600">
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Execution</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Delayed</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
            <span>RFP / Tender</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Awarded</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600" />
            <span>Completed</span>
          </div>
        </div>
      </div>

      {/* Main Map Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Gujarat Spatial Canvas */}
        <div className="lg:col-span-2 bg-[#F1F5F9] rounded-lg border border-slate-300 p-4 relative min-h-[520px] overflow-hidden flex flex-col justify-between shadow-inner">
          {/* Subtle Gujarat Base Map Outline (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full text-slate-300/40 pointer-events-none"
            viewBox="0 0 1000 700"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Gujarat Stylized Administrative Perimeter */}
            <path
              d="M120,240 C140,160 220,130 300,100 C370,80 430,90 520,120 C580,100 660,110 740,160 C800,200 840,260 860,320 C880,390 850,440 820,490 C780,560 720,620 640,650 C580,670 510,660 460,610 C420,570 380,550 320,550 C260,550 200,530 160,470 C120,410 100,320 120,240 Z"
              fill="#E2E8F0"
              stroke="#94A3B8"
              strokeWidth="2"
              strokeDasharray="4 2"
            />
            {/* Gulf of Kutch / Khambhat Stylized Inlets */}
            <path
              d="M160,340 Q220,350 280,330 T360,350"
              stroke="#CBD5E1"
              strokeWidth="4"
              fill="none"
            />
            <path
              d="M520,450 Q560,520 600,560"
              stroke="#CBD5E1"
              strokeWidth="6"
              fill="none"
            />
          </svg>

          {/* Grid Overlay Lines */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-20 border border-slate-400">
            {Array.from({ length: 36 }).map((_, i) => (
              <div key={i} className="border-r border-b border-slate-400" />
            ))}
          </div>

          {/* District Labels */}
          <div className="absolute top-16 left-16 text-[11px] font-bold text-slate-400 select-none tracking-widest uppercase">
            Kutch Region
          </div>
          <div className="absolute top-28 left-1/2 text-[11px] font-bold text-slate-400 select-none tracking-widest uppercase">
            North Gujarat
          </div>
          <div className="absolute bottom-32 left-32 text-[11px] font-bold text-slate-400 select-none tracking-widest uppercase">
            Saurashtra
          </div>
          <div className="absolute bottom-20 right-28 text-[11px] font-bold text-slate-400 select-none tracking-widest uppercase">
            South Gujarat
          </div>

          {/* Dynamic Map Pins */}
          {filteredProjects.map(prj => {
            const pos = getCoordinatesPct(prj.coordinates.lat, prj.coordinates.lng);
            const isSelected = activePinProject?.id === prj.id;
            const pinColor = getPinColor(prj.currentStatus);

            return (
              <div
                key={prj.id}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => setActivePinProject(prj)}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
              >
                {/* Outer pulsing ring if selected */}
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-blue-600/30 animate-ping" />
                )}

                {/* Pin marker icon */}
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-125 ${pinColor} ${
                    isSelected ? 'ring-4 ring-blue-300 scale-125' : ''
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </div>

                {/* Hover Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-7 hidden group-hover:block bg-slate-900 text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-30 shadow-lg pointer-events-none">
                  <div className="font-bold">{prj.district}</div>
                  <div className="text-slate-300">{prj.id}: {prj.name}</div>
                </div>
              </div>
            );
          })}

          {/* Map Controls Floating Overlay */}
          <div className="relative z-20 flex items-center justify-between pointer-events-none">
            <div className="bg-white/90 backdrop-blur-xs px-2.5 py-1.5 rounded border border-slate-300 text-[10px] text-slate-700 shadow-2xs pointer-events-auto">
              <strong>Gujarat Urban GIS Portal</strong> &bull; EPSG:4326 WGS84
            </div>
            <div className="bg-white/90 backdrop-blur-xs px-2 py-1 rounded border border-slate-300 text-[10px] text-slate-700 shadow-2xs pointer-events-auto">
              Scale 1:500,000
            </div>
          </div>
        </div>

        {/* Right Side: Selected Pin Project Profile */}
        <div className="space-y-4">
          {activePinProject ? (
            <div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-4 text-xs space-y-3">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {activePinProject.id}
                  </span>
                  <StatusBadge status={activePinProject.currentStatus} size="sm" />
                  <StatusBadge risk={activePinProject.riskLevel} size="sm" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{activePinProject.name}</h3>
                <p className="text-slate-600 text-[11px] mt-0.5">{activePinProject.description}</p>
              </div>

              {/* Spatial Attributes */}
              <div className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">District & ULB:</span>
                  <span className="font-bold text-slate-800">{activePinProject.district} &bull; {activePinProject.ulb}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GIS Coordinates:</span>
                  <span className="font-mono text-slate-700">
                    {activePinProject.coordinates.lat.toFixed(4)}° N, {activePinProject.coordinates.lng.toFixed(4)}° E
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Site Location:</span>
                  <span className="font-medium text-slate-800">{activePinProject.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Approved Outlay:</span>
                  <span className="font-bold text-slate-900">₹ {activePinProject.approvedCost.toFixed(2)} Cr</span>
                </div>
              </div>

              {/* Progress Gauges */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Physical Completion</span>
                    <span className="font-bold text-slate-800">{activePinProject.physicalProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-700 h-full rounded-full" style={{ width: `${activePinProject.physicalProgress}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600 font-medium">Financial Expenditure Released</span>
                    <span className="font-bold text-emerald-800">
                      ₹ {activePinProject.expenditure.toFixed(2)} Cr ({activePinProject.financialProgress}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${activePinProject.financialProgress}%` }} />
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => setSelectedProjectId(activePinProject.id)}
                className="w-full py-2 bg-[#0E355C] text-white rounded font-semibold text-xs hover:bg-[#092644] transition-colors flex items-center justify-center shadow-xs"
              >
                <ArrowUpRight className="w-4 h-4 mr-1.5" />
                Open Full Project Master Record
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-xs text-slate-500">
              Click any project pin on the Gujarat map to inspect field details.
            </div>
          )}

          {/* Quick List of Displayed Schemes */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-700 uppercase tracking-wider">
              Schemes in View ({filteredProjects.length})
            </div>
            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto text-xs">
              {filteredProjects.map(p => (
                <div
                  key={p.id}
                  onClick={() => setActivePinProject(p)}
                  className={`p-2.5 cursor-pointer hover:bg-slate-50 flex items-center justify-between ${
                    activePinProject?.id === p.id ? 'bg-blue-50 font-bold' : ''
                  }`}
                >
                  <div className="truncate max-w-[200px]">
                    <span className="font-mono text-[10px] text-blue-900 block">{p.id}</span>
                    <span className="truncate block text-slate-800">{p.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-semibold">{p.district}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
