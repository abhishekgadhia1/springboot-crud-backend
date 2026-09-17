import React from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../common/Breadcrumbs';
import {
  BellRing,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  CheckCheck,
  ShieldAlert
} from 'lucide-react';

export const NotificationsModule: React.FC = () => {
  const { notifications, markNotificationRead, setSelectedProjectId, setCurrentNav } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-4">
      <Breadcrumbs currentModule="Alerts & Escalations" />
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-2">
        <div>
          <h2 className="text-xl font-bold text-[#0E355C] tracking-tight">System Alerts, Escalations & Reminders</h2>
          <p className="text-xs text-slate-600">
            Real-time notifications for milestone slippages, statutory deadline expiries and pending file sanctions
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="font-semibold text-slate-600">Unread Alerts:</span>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-bold font-mono">
            {unreadCount}
          </span>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Alert Activity Stream ({notifications.length})
          </h3>
          <button
            onClick={() => notifications.forEach(n => markNotificationRead(n.id))}
            className="text-xs font-semibold text-blue-700 hover:underline flex items-center"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark All as Read
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {notifications.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 flex items-start space-x-3 transition-colors text-xs cursor-pointer ${
                !n.read ? 'bg-blue-50/40 hover:bg-blue-50/70' : 'hover:bg-slate-50'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {n.type === 'critical' ? (
                  <ShieldAlert className="w-5 h-5 text-rose-600" />
                ) : n.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                ) : n.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <Info className="w-5 h-5 text-blue-600" />
                )}
              </div>

              <div className="flex-1 space-y-0.5">
                <div className="flex items-center justify-between">
                  <span className={`font-bold text-slate-900 ${!n.read ? 'text-blue-950 font-bold' : ''}`}>
                    {n.title}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {n.timestamp}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">{n.message}</p>

                {n.projectId && (
                  <div className="pt-1.5 flex items-center space-x-2">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedProjectId(n.projectId!);
                      }}
                      className="text-[11px] font-semibold text-blue-800 hover:underline"
                    >
                      Open Project Master ({n.projectId}) &rarr;
                    </button>
                  </div>
                )}
              </div>

              {!n.read && (
                <div className="flex-shrink-0 self-center">
                  <span className="w-2 h-2 rounded-full bg-blue-600 block" title="Unread" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
