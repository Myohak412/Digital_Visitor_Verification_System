import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Phone,
  Settings2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AttentionRuleConfig } from '../../types';
import { AttentionReasonCard } from '../common/AttentionReasonCard';
import { StatusBadge } from '../common/StatusBadge';

export const AttentionQueue: React.FC = () => {
  const {
    currentUser,
    requests,
    rulesConfig,
    updateRuleConfig,
    supervisorReviewAction,
    recordVisitorEntry,
    setSelectedVisitorId,
    setActivePage,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'QUEUE' | 'RULES_CONFIG'>('QUEUE');
  const [supervisorNote, setSupervisorNote] = useState<{ [key: string]: string }>({});
  const [editableRules, setEditableRules] = useState<AttentionRuleConfig[]>(rulesConfig);

  const isSupervisor = currentUser.role === 'SUPERVISOR';

  // Requests that require attention or supervisor review
  const flaggedRequests = requests.filter(
    (r) =>
      r.attentionLevel === 'SUPERVISOR_REVIEW' ||
      r.attentionLevel === 'ATTENTION_REQUIRED' ||
      r.supervisorStatus === 'PENDING_REVIEW'
  );

  const handleRuleToggle = (code: string) => {
    const updated = editableRules.map((r) => (r.code === code ? { ...r, isActive: !r.isActive } : r));
    setEditableRules(updated);
    updateRuleConfig(updated);
  };

  const handlePointsChange = (code: string, points: number) => {
    const updated = editableRules.map((r) => (r.code === code ? { ...r, points } : r));
    setEditableRules(updated);
    updateRuleConfig(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Explainable Attention & Supervisor Review Queue</h2>
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-800 border border-rose-200">
              {flaggedRequests.length} Flagged Cases
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Transparent, rule-driven triage for visits requiring extra administrative oversight or supervisor approval.
          </p>
        </div>

        <div className="flex items-center rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setActiveTab('QUEUE')}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'QUEUE'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Attention Queue ({flaggedRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('RULES_CONFIG')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'RULES_CONFIG'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>Rule Weights & Thresholds</span>
          </button>
        </div>
      </div>

      {activeTab === 'QUEUE' ? (
        flaggedRequests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-emerald-500" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">No Attention Queue Backlog</h3>
            <p className="mt-1 text-xs text-slate-500">
              All active requests are within normal baseline thresholds (Score &lt; 30).
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {flaggedRequests.map((req) => (
              <div
                key={req.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedVisitorId(req.visitorId);
                          setActivePage('HISTORY');
                        }}
                        className="font-bold text-slate-900 text-base hover:text-indigo-600 underline-offset-2 hover:underline"
                      >
                        {req.visitorName}
                      </button>
                      <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        {req.id}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                      <span>Ph: {req.visitorPhone}</span>
                      {req.visitorVehicle && <span>• Vehicle: {req.visitorVehicle}</span>}
                      <span>• Registered by: {req.guardName}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge type="ATTENTION" value={req.attentionLevel} />
                    <StatusBadge type="LIFECYCLE" value={req.lifecycleStatus} size="sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Request Parameters */}
                  <div className="space-y-2 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200/80">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Intended Host:</span>
                      <span className="font-bold text-slate-800">{req.hostName} ({req.hostDepartment})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Stated Purpose:</span>
                      <span className="font-bold text-slate-800">{req.purpose.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expected Dwell Time:</span>
                      <span className="font-bold text-slate-800">{req.expectedDurationMinutes} Minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Appointment Status:</span>
                      <span className="font-bold text-slate-800">{req.appointmentStatus}</span>
                    </div>
                    {req.remarks && (
                      <div className="pt-2 border-t border-slate-200">
                        <span className="text-slate-500 block mb-0.5">Gate Remarks:</span>
                        <p className="italic text-slate-700">{req.remarks}</p>
                      </div>
                    )}
                  </div>

                  {/* Right: Transparent Attention Rule Breakdown */}
                  <div>
                    <AttentionReasonCard
                      score={req.attentionScore}
                      level={req.attentionLevel}
                      reasons={req.attentionReasons}
                    />
                  </div>
                </div>

                {/* Supervisor Review Action Bar */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <Shield className="h-4 w-4 text-purple-700" />
                      <span>Security Supervisor Decision & Directive</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {isSupervisor
                        ? 'Logged in as Chief Security Officer'
                        : 'Simulate or view supervisor sign-off'}
                    </span>
                  </div>

                  {req.supervisorStatus === 'PENDING_REVIEW' ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Enter official supervisor review note (e.g. Cleared after phone verification with Dean)..."
                        value={supervisorNote[req.id] || ''}
                        onChange={(e) =>
                          setSupervisorNote({ ...supervisorNote, [req.id]: e.target.value })
                        }
                        className="w-full rounded-xl border border-slate-200 px-3 py-1.5 text-xs bg-white focus:border-indigo-500 focus:outline-hidden"
                      />

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => {
                            supervisorReviewAction(
                              req.id,
                              'APPROVED',
                              supervisorNote[req.id] || 'Cleared by Security Supervisor.'
                            );
                            alert(`Request ${req.id} cleared by supervisor.`);
                          }}
                          className="flex items-center gap-1.5 rounded-xl bg-purple-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-800 shadow-xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve & Clear for Gate Entry</span>
                        </button>

                        <button
                          onClick={() => {
                            supervisorReviewAction(
                              req.id,
                              'REJECTED',
                              supervisorNote[req.id] || 'Denied entry by Security Supervisor.'
                            );
                            alert(`Request ${req.id} denied by supervisor.`);
                          }}
                          className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Deny Campus Entry</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-purple-900">
                          {req.supervisorStatus === 'APPROVED_OVERRIDE'
                            ? 'Approved by Supervisor:'
                            : 'Rejected by Supervisor:'}
                        </span>
                        <span className="italic">"{req.supervisorNote}"</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {req.supervisorReviewedAt
                          ? new Date(req.supervisorReviewedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : ''}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Configurable Attention Scoring Engine Rules */
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Attention Engine Rule Tuning & Policy Calibration</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              These deterministic heuristic rules govern how attention points are assigned. MCA researchers can modify weights to evaluate impact on gate processing latency and flag frequency.
            </p>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {editableRules.map((rule) => (
              <div key={rule.code} className="flex items-center justify-between p-4 text-xs hover:bg-slate-50">
                <div className="flex items-start gap-3 max-w-xl">
                  <input
                    type="checkbox"
                    checked={rule.isActive}
                    onChange={() => handleRuleToggle(rule.code)}
                    className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-slate-900">{rule.name}</p>
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.2 rounded">
                        {rule.code}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{rule.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-[11px] font-medium text-slate-600">Points Weight:</label>
                  <input
                    type="number"
                    min={5}
                    max={50}
                    step={5}
                    value={rule.points}
                    onChange={(e) => handlePointsChange(rule.code, Number(e.target.value))}
                    className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-xs font-bold text-center font-mono"
                  />
                  <span className="text-xs font-bold text-slate-500">pts</span>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 text-xs text-indigo-900 flex items-start gap-2.5">
            <HelpCircle className="h-4 w-4 shrink-0 text-indigo-600 mt-0.5" />
            <div>
              <p className="font-bold">Transparent Threshold Standard</p>
              <p className="mt-0.5 text-[11px] text-indigo-800">
                0–29 points = Normal (Green) • 30–59 points = Attention Required (Yellow) • 60+ points = Supervisor Review (Red). Rules are deterministic, auditable, and never use black-box machine learning.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
