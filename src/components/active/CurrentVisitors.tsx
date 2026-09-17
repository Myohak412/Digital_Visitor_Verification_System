import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Clock,
  LogOut,
  Phone,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../common/StatusBadge';

export const CurrentVisitors: React.FC = () => {
  const { requests, recordVisitorExit, setSelectedVisitorId, setActivePage } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Update timer every 30 seconds for live elapsed duration
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const activeVisitors = requests.filter((r) => r.lifecycleStatus === 'CHECKED_IN');

  const filteredVisitors = activeVisitors.filter(
    (r) =>
      r.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.visitorPhone.includes(searchQuery) ||
      (r.visitorVehicle && r.visitorVehicle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.hostName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Current Campus Occupancy Roster</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-800 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              {activeVisitors.length} Active On Campus
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time tracking of visitors cleared through the gate. Single-click exit checkout.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search visitor, phone, or vehicle..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-hidden"
          />
        </div>
      </div>

      {filteredVisitors.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <ShieldCheck className="mx-auto h-12 w-12 text-slate-400" />
          <h3 className="mt-3 text-sm font-bold text-slate-900">No Visitors Currently on Campus</h3>
          <p className="mt-1 text-xs text-slate-500">
            All cleared visitors have completed their visits and signed out through the gate.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVisitors.map((req) => {
            const entryDate = req.entryTime ? new Date(req.entryTime) : new Date();
            const elapsedMinutes = Math.max(
              1,
              Math.round((currentTime - entryDate.getTime()) / (1000 * 60))
            );
            const isOverstay = elapsedMinutes > req.expectedDurationMinutes;

            return (
              <div
                key={req.id}
                className={`rounded-2xl border bg-white p-5 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                  isOverstay
                    ? 'border-rose-300 bg-rose-50/20 ring-1 ring-rose-300'
                    : 'border-slate-200'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <button
                        onClick={() => {
                          setSelectedVisitorId(req.visitorId);
                          setActivePage('HISTORY');
                        }}
                        className="text-left font-bold text-slate-900 hover:text-indigo-600 text-base underline-offset-2 hover:underline"
                      >
                        {req.visitorName}
                      </button>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                        <span>Ph: {req.visitorPhone}</span>
                        {req.visitorVehicle && (
                          <span className="font-mono bg-slate-100 px-1.5 py-0.2 rounded text-[11px] font-semibold text-slate-700">
                            {req.visitorVehicle}
                          </span>
                        )}
                      </div>
                    </div>

                    <StatusBadge type="ATTENTION" value={req.attentionLevel} size="sm" />
                  </div>

                  {/* Visit Parameters */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Host / Dept</span>
                      <p className="font-bold text-slate-800 truncate">{req.hostName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{req.hostDepartment}</p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Purpose</span>
                      <p className="font-semibold text-slate-800 truncate">
                        {req.purpose.replace(/_/g, ' ')}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Gate Entry Time</span>
                      <p className="font-semibold text-slate-800">
                        {entryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Expected Stay</span>
                      <p className="font-semibold text-slate-800">
                        {req.expectedDurationMinutes} Minutes
                      </p>
                    </div>
                  </div>

                  {/* Elapsed Timer Banner */}
                  <div
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold ${
                      isOverstay
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>Elapsed: {elapsedMinutes} mins</span>
                    </div>

                    {isOverstay ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-rose-700">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        Overstayed by {elapsedMinutes - req.expectedDurationMinutes}m
                      </span>
                    ) : (
                      <span className="text-[11px] text-emerald-700">
                        {req.expectedDurationMinutes - elapsedMinutes}m remaining
                      </span>
                    )}
                  </div>
                </div>

                {/* Checkout Action Button */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Record campus exit for ${req.visitorName}? Total duration: ~${elapsedMinutes} minutes.`
                        )
                      ) {
                        recordVisitorExit(req.id);
                      }
                    }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
                  >
                    <LogOut className="h-4 w-4 text-rose-400" />
                    <span>Record Gate Exit (Check Out)</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
