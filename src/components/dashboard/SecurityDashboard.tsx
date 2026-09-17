import React from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  Clock,
  LogOut,
  PlusCircle,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttentionReasonCard } from '../common/AttentionReasonCard';
import { StatusBadge } from '../common/StatusBadge';

export const SecurityDashboard: React.FC = () => {
  const {
    requests,
    visitors,
    setActivePage,
    setSelectedVisitorId,
    recordVisitorEntry,
    recordVisitorExit,
  } = useApp();

  // Metrics
  const totalVisitorsToday = requests.length;
  const insideCampus = requests.filter((r) => r.lifecycleStatus === 'CHECKED_IN');
  const pendingApprovals = requests.filter((r) => r.hostApprovalStatus === 'PENDING');
  const requiringAttention = requests.filter(
    (r) =>
      r.attentionLevel === 'ATTENTION_REQUIRED' ||
      r.attentionLevel === 'SUPERVISOR_REVIEW' ||
      r.supervisorStatus === 'PENDING_REVIEW'
  );
  const rejectedCount = requests.filter(
    (r) => r.hostApprovalStatus === 'REJECTED' || r.lifecycleStatus === 'REJECTED'
  ).length;

  const frequentVisitors = visitors.filter((v) => v.totalVisits >= 3).length;

  return (
    <div className="space-y-6">
      {/* Top Banner / Operational Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Campus Security Command Center</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Gate Sync Active
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Real-time digital visitor verification, host confirmations, and explainable attention levels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActivePage('NEW_ENTRY')}
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition-colors"
          >
            <PlusCircle className="h-4 w-4 text-indigo-400" />
            <span>Register New Visitor</span>
          </button>
          <button
            onClick={() => setActivePage('ACTIVE_VISITORS')}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Clock className="h-4 w-4 text-slate-500" />
            <span>View Active Roster ({insideCampus.length})</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visitors Today */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Visitors Today</span>
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-slate-900">{totalVisitorsToday}</p>
          <p className="mt-1 text-[11px] text-slate-500">Gate 1 & North Gate logs</p>
        </div>

        {/* Currently Inside */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-emerald-800">Currently Inside</span>
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-950">{insideCampus.length}</p>
          <div className="mt-1 flex items-center justify-between text-[11px] text-emerald-700">
            <span>Active on campus</span>
            <button
              onClick={() => setActivePage('ACTIVE_VISITORS')}
              className="underline font-semibold hover:text-emerald-900"
            >
              Manage Exits
            </button>
          </div>
        </div>

        {/* Pending Host Approvals */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-amber-800">Pending Host Approval</span>
            <UserCheck className="h-4 w-4 text-amber-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-amber-950">{pendingApprovals.length}</p>
          <div className="mt-1 flex items-center justify-between text-[11px] text-amber-700">
            <span>Awaiting host action</span>
            <button
              onClick={() => setActivePage('PENDING_APPROVALS')}
              className="underline font-semibold hover:text-amber-900"
            >
              Open Inbox
            </button>
          </div>
        </div>

        {/* Requiring Attention / Review */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-800">Attention / Review Queue</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-rose-950">{requiringAttention.length}</p>
          <div className="mt-1 flex items-center justify-between text-[11px] text-rose-700">
            <span>Scored &ge; 30 pts</span>
            <button
              onClick={() => setActivePage('ATTENTION_QUEUE')}
              className="underline font-semibold hover:text-rose-900"
            >
              Review Flagged
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Metrics & Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Clock className="h-4 w-4 text-slate-500" />
            <span>Average Approval Latency</span>
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">3.8 minutes</p>
          <p className="text-[11px] text-slate-500">From gate registration to host confirmation</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <AlertCircle className="h-4 w-4 text-slate-500" />
            <span>Host Denials / Rejections</span>
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">{rejectedCount} Requests</p>
          <p className="text-[11px] text-slate-500">Unauthorized walk-ins prevented at gate</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Shield className="h-4 w-4 text-slate-500" />
            <span>Frequent Visitors Recorded</span>
          </div>
          <p className="mt-2 text-xl font-bold text-slate-900">{frequentVisitors} Regulars</p>
          <p className="text-[11px] text-slate-500">&ge; 3 past visits tracked with historical timeline</p>
        </div>
      </div>

      {/* Recent Gate Activity & Action Center */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Today's Gate Verification Stream</h3>
            <p className="text-xs text-slate-500">
              Live status across gate entry, host responses, and attention triggers.
            </p>
          </div>
          <button
            onClick={() => setActivePage('REQUESTS')}
            className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            <span>View All Records</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Visitor Name & Phone</th>
                <th className="px-4 py-3">Host & Department</th>
                <th className="px-4 py-3">Purpose & Stay</th>
                <th className="px-4 py-3">Attention Level</th>
                <th className="px-4 py-3">Approval State</th>
                <th className="px-4 py-3">Gate Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.slice(0, 5).map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedVisitorId(req.visitorId);
                        setActivePage('HISTORY');
                      }}
                      className="text-left font-bold text-slate-900 hover:text-indigo-600 underline-offset-2 hover:underline"
                    >
                      {req.visitorName}
                    </button>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Ph: {req.visitorPhone}</span>
                      {req.visitorVehicle && (
                        <span className="font-mono bg-slate-100 px-1 rounded text-slate-700">
                          {req.visitorVehicle}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900">{req.hostName}</p>
                    <p className="text-[11px] text-slate-500">{req.hostDepartment}</p>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-800">
                      {req.purpose.replace(/_/g, ' ')}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Expected: {req.expectedDurationMinutes} min ({req.appointmentStatus})
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge type="ATTENTION" value={req.attentionLevel} size="sm" />
                    {req.attentionReasons.length > 0 && (
                      <p className="text-[10px] text-slate-500 mt-1 truncate max-w-[180px]">
                        {req.attentionReasons[0].plainReason}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge type="HOST_APPROVAL" value={req.hostApprovalStatus} size="sm" />
                    <div className="mt-1">
                      <StatusBadge type="LIFECYCLE" value={req.lifecycleStatus} size="sm" />
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {/* Gate action based on lifecycle */}
                    {req.lifecycleStatus === 'APPROVED_NOT_ENTERED' && (
                      <button
                        onClick={() => recordVisitorEntry(req.id)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        <span>Record Entry</span>
                      </button>
                    )}

                    {req.lifecycleStatus === 'CHECKED_IN' && (
                      <button
                        onClick={() => recordVisitorExit(req.id)}
                        className="flex items-center gap-1 rounded-lg bg-slate-800 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-900 shadow-xs"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>Record Exit</span>
                      </button>
                    )}

                    {req.lifecycleStatus === 'AWAITING_HOST_APPROVAL' && (
                      <span className="text-[11px] text-amber-700 italic">
                        Waiting for Host response
                      </span>
                    )}

                    {req.lifecycleStatus === 'AWAITING_SUPERVISOR_REVIEW' && (
                      <button
                        onClick={() => setActivePage('ATTENTION_QUEUE')}
                        className="rounded-md border border-rose-300 bg-rose-50 px-2 py-0.5 text-[11px] font-bold text-rose-800 hover:bg-rose-100"
                      >
                        Supervisor Review
                      </button>
                    )}

                    {req.lifecycleStatus === 'CHECKED_OUT' && (
                      <span className="text-[11px] text-slate-500">
                        Stay: {req.actualDurationMinutes}m
                      </span>
                    )}

                    {req.lifecycleStatus === 'REJECTED' && (
                      <span className="text-[11px] text-rose-600 font-medium">Denied entry</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
