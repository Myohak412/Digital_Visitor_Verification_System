import React, { useState } from 'react';
import {
  CheckCircle,
  Eye,
  Filter,
  LogOut,
  PlusCircle,
  Search,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttentionTier, HostApprovalStatus, VisitLifecycleStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const VisitorRequestsList: React.FC = () => {
  const { requests, recordVisitorEntry, recordVisitorExit, setSelectedVisitorId, setActivePage } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAttention, setFilterAttention] = useState<string>('ALL');
  const [filterApproval, setFilterApproval] = useState<string>('ALL');
  const [filterLifecycle, setFilterLifecycle] = useState<string>('ALL');

  const filtered = requests.filter((req) => {
    const matchesSearch =
      req.visitorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.visitorPhone.includes(searchTerm) ||
      req.hostName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.visitorVehicle && req.visitorVehicle.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesAttention = filterAttention === 'ALL' || req.attentionLevel === filterAttention;
    const matchesApproval = filterApproval === 'ALL' || req.hostApprovalStatus === filterApproval;
    const matchesLifecycle = filterLifecycle === 'ALL' || req.lifecycleStatus === filterLifecycle;

    return matchesSearch && matchesAttention && matchesApproval && matchesLifecycle;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Campus Visitor Requests Master Roster</h2>
          <p className="text-xs text-slate-500">
            Searchable, filterable audit log of all gate entries, host decisions, and attention scoring.
          </p>
        </div>

        <button
          onClick={() => setActivePage('NEW_ENTRY')}
          className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800"
        >
          <PlusCircle className="h-4 w-4 text-indigo-400" />
          <span>Register Walk-in</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search visitor, phone, host, vehicle..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 pl-9 pr-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-hidden"
          />
        </div>

        {/* Attention Filter */}
        <select
          value={filterAttention}
          onChange={(e) => setFilterAttention(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs font-medium text-slate-700"
        >
          <option value="ALL">All Attention Levels</option>
          <option value="NORMAL">Normal</option>
          <option value="ATTENTION_REQUIRED">Attention Required</option>
          <option value="SUPERVISOR_REVIEW">Supervisor Review</option>
        </select>

        {/* Host Approval Filter */}
        <select
          value={filterApproval}
          onChange={(e) => setFilterApproval(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs font-medium text-slate-700"
        >
          <option value="ALL">All Host Approvals</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="INFO_REQUESTED">Info Requested</option>
        </select>

        {/* Lifecycle Filter */}
        <select
          value={filterLifecycle}
          onChange={(e) => setFilterLifecycle(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs font-medium text-slate-700"
        >
          <option value="ALL">All Gate States</option>
          <option value="CHECKED_IN">Inside Campus</option>
          <option value="APPROVED_NOT_ENTERED">Cleared for Entry</option>
          <option value="CHECKED_OUT">Exited</option>
          <option value="REJECTED">Denied</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Visitor Name & Phone</th>
                <th className="px-4 py-3">Host & Department</th>
                <th className="px-4 py-3">Purpose & Details</th>
                <th className="px-4 py-3">Attention Level</th>
                <th className="px-4 py-3">Host Approval</th>
                <th className="px-4 py-3">Gate State</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((req) => (
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
                      Stay: {req.expectedDurationMinutes} min • {req.appointmentStatus}
                    </p>
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge type="ATTENTION" value={req.attentionLevel} size="sm" />
                    {req.attentionReasons.length > 0 && (
                      <p className="text-[10px] text-slate-500 mt-1 max-w-[170px] truncate">
                        {req.attentionReasons[0].plainReason}
                      </p>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge type="HOST_APPROVAL" value={req.hostApprovalStatus} size="sm" />
                  </td>

                  <td className="px-4 py-3">
                    <StatusBadge type="LIFECYCLE" value={req.lifecycleStatus} size="sm" />
                  </td>

                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {req.lifecycleStatus === 'APPROVED_NOT_ENTERED' && (
                        <button
                          onClick={() => recordVisitorEntry(req.id)}
                          className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-semibold text-white hover:bg-emerald-700 shadow-xs"
                          title="Record Entry"
                        >
                          Check In
                        </button>
                      )}

                      {req.lifecycleStatus === 'CHECKED_IN' && (
                        <button
                          onClick={() => recordVisitorExit(req.id)}
                          className="rounded-lg bg-slate-800 px-2 py-1 text-xs font-semibold text-white hover:bg-slate-900 shadow-xs"
                          title="Record Exit"
                        >
                          Check Out
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedVisitorId(req.visitorId);
                          setActivePage('HISTORY');
                        }}
                        className="rounded-lg border border-slate-200 p-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        title="View Profile & Timeline"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
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
