import React, { useState } from 'react';
import {
  AlertCircle,
  Building,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  MessageSquare,
  Phone,
  User,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HostApprovalStatus, VisitorRequest } from '../../types';
import { AttentionReasonCard } from '../common/AttentionReasonCard';
import { StatusBadge } from '../common/StatusBadge';

export const PendingApprovals: React.FC = () => {
  const { currentUser, requests, respondAsHost, submitGuardClarification } = useApp();

  const [activeTab, setActiveTab] = useState<'PENDING' | 'HISTORY'>('PENDING');
  const [responseNotes, setResponseNotes] = useState<{ [key: string]: string }>({});
  const [clarificationInputs, setClarificationInputs] = useState<{ [key: string]: string }>({});

  // If user is a Host, prioritize their own requests. If Guard/Supervisor, display all pending host approvals.
  const isHost = currentUser.role === 'HOST';

  const relevantRequests = requests.filter((r) => {
    if (isHost) {
      return r.hostId === currentUser.id;
    }
    return true; // Guards and supervisors can monitor all requests
  });

  const pendingRequests = relevantRequests.filter((r) => r.hostApprovalStatus === 'PENDING' || r.hostApprovalStatus === 'INFO_REQUESTED');
  const historicalRequests = relevantRequests.filter((r) => r.hostApprovalStatus === 'APPROVED' || r.hostApprovalStatus === 'REJECTED');

  const handleAction = (requestId: string, status: HostApprovalStatus) => {
    const note = responseNotes[requestId] || '';
    respondAsHost(requestId, status, note);
    // Clear response note
    setResponseNotes((prev) => ({ ...prev, [requestId]: '' }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Host Visitor Confirmation Inbox</h2>
          <p className="text-xs text-slate-500">
            {isHost
              ? `Reviewing requests assigned to you (${currentUser.name} — ${currentUser.department})`
              : 'Security supervisory view of all department and student host approvals in progress.'}
          </p>
        </div>

        <div className="flex items-center rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('PENDING')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'PENDING'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending Action ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('HISTORY')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'HISTORY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past Decisions ({historicalRequests.length})
          </button>
        </div>
      </div>

      {activeTab === 'PENDING' ? (
        pendingRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-500" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">Inbox Clean</h3>
            <p className="mt-1 text-xs text-slate-500">
              No pending visitor requests awaiting host response right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{req.visitorName}</h4>
                        <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                          {req.id}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {req.visitorPhone}
                        </span>
                        {req.visitorVehicle && (
                          <span className="font-mono bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
                            {req.visitorVehicle}
                          </span>
                        )}
                      </div>
                    </div>

                    <StatusBadge type="ATTENTION" value={req.attentionLevel} size="sm" />
                  </div>

                  {/* Visit Parameters */}
                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Purpose</span>
                      <p className="font-semibold text-slate-800">{req.purpose.replace(/_/g, ' ')}</p>
                      {req.purposeOtherText && (
                        <p className="text-[11px] text-slate-500 mt-0.5">{req.purposeOtherText}</p>
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Expected Stay</span>
                      <p className="font-semibold text-slate-800 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-slate-400" />
                        {req.expectedDurationMinutes} Minutes
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Appointment</span>
                      <p className="font-semibold text-slate-800">{req.appointmentStatus}</p>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Assigned Host</span>
                      <p className="font-semibold text-slate-800 truncate">{req.hostName}</p>
                    </div>
                  </div>

                  {/* Gate remarks if any */}
                  {req.remarks && (
                    <div className="rounded-lg bg-amber-50/70 p-2.5 text-xs text-amber-900 border border-amber-200/60">
                      <span className="font-semibold">Gate Guard Remark:</span> {req.remarks}
                    </div>
                  )}

                  {/* Attention reasons preview */}
                  {req.attentionReasons.length > 0 && (
                    <AttentionReasonCard
                      score={req.attentionScore}
                      level={req.attentionLevel}
                      reasons={req.attentionReasons}
                      compact
                    />
                  )}

                  {/* If info requested already */}
                  {req.hostApprovalStatus === 'INFO_REQUESTED' && (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900 space-y-2">
                      <p className="font-semibold flex items-center gap-1.5">
                        <HelpCircle className="h-4 w-4 text-blue-600" />
                        More Information Requested by Host
                      </p>
                      <p className="text-[11px] italic">"{req.requestedInfoDetails || req.hostResponseNote}"</p>
                      
                      {/* Guard can enter clarification */}
                      {!isHost && (
                        <div className="pt-2 border-t border-blue-200/60">
                          <label className="text-[10px] uppercase font-bold text-blue-800 block mb-1">
                            Guard Clarification from Visitor:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. Visitor presented letter from Vice Chancellor"
                              value={clarificationInputs[req.id] || ''}
                              onChange={(e) =>
                                setClarificationInputs({ ...clarificationInputs, [req.id]: e.target.value })
                              }
                              className="flex-1 text-xs px-2 py-1 rounded border border-blue-300 bg-white"
                            />
                            <button
                              onClick={() => {
                                if (clarificationInputs[req.id]) {
                                  submitGuardClarification(req.id, clarificationInputs[req.id]);
                                  alert('Clarification updated for host review.');
                                }
                              }}
                              className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-700 text-white"
                            >
                              Update Host
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Host Action Controls */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Optional note or instructions for the visitor / gate guard:
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Please send to 3rd Floor Seminar Hall / Please tell them I am in class"
                      value={responseNotes[req.id] || ''}
                      onChange={(e) =>
                        setResponseNotes({ ...responseNotes, [req.id]: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs focus:border-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleAction(req.id, 'APPROVED')}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => handleAction(req.id, 'INFO_REQUESTED')}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-blue-300 bg-blue-50 py-2 text-xs font-bold text-blue-700 hover:bg-blue-100 transition-colors"
                    >
                      <HelpCircle className="h-3.5 w-3.5" />
                      <span>Request Info</span>
                    </button>

                    <button
                      onClick={() => handleAction(req.id, 'REJECTED')}
                      className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Historical Responses List */
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Visitor Name</th>
                <th className="px-4 py-3">Purpose & Host</th>
                <th className="px-4 py-3">Decision</th>
                <th className="px-4 py-3">Host Note</th>
                <th className="px-4 py-3">Responded Time</th>
                <th className="px-4 py-3">Gate Outcome</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historicalRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <p className="font-bold text-slate-900">{req.visitorName}</p>
                    <p className="text-[11px] text-slate-500">Ph: {req.visitorPhone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{req.purpose.replace(/_/g, ' ')}</p>
                    <p className="text-[11px] text-slate-500">{req.hostName}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge type="HOST_APPROVAL" value={req.hostApprovalStatus} size="sm" />
                  </td>
                  <td className="px-4 py-3 italic text-slate-700">
                    {req.hostResponseNote || '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-[11px]">
                    {req.hostRespondedAt ? new Date(req.hostRespondedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge type="LIFECYCLE" value={req.lifecycleStatus} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
