import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  History,
  Phone,
  Search,
  ShieldAlert,
  User,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const VisitorHistory: React.FC = () => {
  const { visitors, requests, selectedVisitorId, setSelectedVisitorId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVisitors = visitors.filter(
    (v) =>
      v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phoneNumber.includes(searchQuery) ||
      (v.vehicleNumber && v.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Active visitor profile
  const activeVisitor = selectedVisitorId
    ? visitors.find((v) => v.id === selectedVisitorId) || visitors[0]
    : visitors[0];

  // Requests associated with this visitor
  const visitorRequests = activeVisitor
    ? requests.filter((r) => r.visitorId === activeVisitor.id || r.visitorPhone === activeVisitor.phoneNumber)
    : [];

  const avgDuration =
    activeVisitor && activeVisitor.totalVisits > 0
      ? Math.round(activeVisitor.totalTimeInsideMinutes / Math.max(1, activeVisitor.approvedVisits))
      : 0;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Visitor Directory & Activity Timeline</h2>
        <p className="text-xs text-slate-500">
          Longitudinal historical records, pattern recognition, and past gate entry/exit logs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visitor Directory (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search visitor directory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredVisitors.map((vis) => {
              const isSelected = activeVisitor?.id === vis.id;
              return (
                <button
                  key={vis.id}
                  onClick={() => setSelectedVisitorId(vis.id)}
                  className={`w-full flex items-center justify-between p-3.5 text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/70 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">{vis.fullName}</p>
                      <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-semibold text-slate-600">
                        {vis.totalVisits} visit(s)
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-slate-500 text-[11px]">
                      <span>Ph: {vis.phoneNumber}</span>
                      {vis.vehicleNumber && (
                        <span className="font-mono">{vis.vehicleNumber}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {vis.rejectedVisits > 0 && (
                      <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                        {vis.rejectedVisits} Rejections
                      </span>
                    )}
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Visitor Detail & Longitudinal Timeline (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {activeVisitor ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white font-bold text-sm">
                      {activeVisitor.fullName.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{activeVisitor.fullName}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <Phone className="h-3 w-3" />
                        <span>{activeVisitor.phoneNumber}</span>
                        {activeVisitor.city && <span>• {activeVisitor.city}</span>}
                      </p>
                    </div>
                  </div>
                </div>

                {activeVisitor.vehicleNumber && (
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Registered Vehicle</span>
                    <p className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {activeVisitor.vehicleNumber}
                    </p>
                  </div>
                )}
              </div>

              {/* Aggregated Statistics */}
              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <p className="text-lg font-bold text-slate-900">{activeVisitor.totalVisits}</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Total Visits</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-2.5 text-emerald-900">
                  <p className="text-lg font-bold">{activeVisitor.approvedVisits}</p>
                  <p className="text-[10px] font-semibold uppercase">Approved</p>
                </div>
                <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-2.5 text-rose-900">
                  <p className="text-lg font-bold">{activeVisitor.rejectedVisits}</p>
                  <p className="text-[10px] font-semibold uppercase">Rejected</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5">
                  <p className="text-lg font-bold text-slate-900">{avgDuration} min</p>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Avg Dwell</p>
                </div>
              </div>

              {/* Observed Patterns */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Observed Activity Patterns (Non-Predictive)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeVisitor.observedPatterns.map((pattern, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-800"
                    >
                      {pattern}
                    </span>
                  ))}
                  {activeVisitor.totalVisits >= 5 && (
                    <span className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800">
                      High Visit Frequency Pattern
                    </span>
                  )}
                </div>
              </div>

              {/* Chronological Vertical Timeline */}
              <div className="border-t border-slate-100 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                  <History className="h-4 w-4 text-slate-500" />
                  <span>Gate Visit Chronology & Records</span>
                </h4>

                {visitorRequests.length === 0 ? (
                  <p className="text-xs text-slate-500">No detailed visit logs recorded yet.</p>
                ) : (
                  <div className="relative border-l border-slate-200 pl-4 ml-2 space-y-5">
                    {visitorRequests.map((req) => {
                      const entryDate = req.entryTime ? new Date(req.entryTime) : null;
                      const exitDate = req.exitTime ? new Date(req.exitTime) : null;

                      return (
                        <div key={req.id} className="relative group">
                          {/* Dot indicator */}
                          <div
                            className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${
                              req.lifecycleStatus === 'CHECKED_OUT'
                                ? 'bg-slate-500'
                                : req.lifecycleStatus === 'CHECKED_IN'
                                ? 'bg-emerald-500'
                                : req.lifecycleStatus === 'REJECTED'
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                          />

                          <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span className="text-xs font-bold text-slate-900">
                                  {req.purpose.replace(/_/g, ' ')}
                                </span>
                                <p className="text-[11px] text-slate-500">
                                  Host: <strong className="text-slate-800">{req.hostName}</strong> ({req.hostDepartment})
                                </p>
                              </div>
                              <StatusBadge type="LIFECYCLE" value={req.lifecycleStatus} size="sm" />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200">
                              <div>
                                <span className="text-slate-400 block text-[10px]">Entry Log</span>
                                <span className="font-semibold">
                                  {entryDate
                                    ? entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : 'Not checked in'}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">Exit Log</span>
                                <span className="font-semibold">
                                  {exitDate
                                    ? exitDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : req.lifecycleStatus === 'CHECKED_IN'
                                    ? 'Currently Inside'
                                    : '—'}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">Actual Dwell</span>
                                <span className="font-semibold">
                                  {req.actualDurationMinutes ? `${req.actualDurationMinutes} mins` : '—'}
                                </span>
                              </div>
                            </div>

                            {req.attentionReasons.length > 0 && (
                              <div className="text-[10px] text-slate-500 pt-1">
                                <span className="font-semibold text-slate-700">Attention factors:</span>{' '}
                                {req.attentionReasons.map((r) => r.ruleName).join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-slate-500">
              Select a visitor from the directory to inspect their full timeline.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
