import React from 'react';
import {
  Building2,
  CheckCircle2,
  Mail,
  Phone,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const { currentUser, users, switchUser } = useApp();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">User Profile & Access Credentials</h2>
        <p className="text-xs text-slate-500">
          Role-Based Access Control (RBAC) details and terminal persona switching for demonstration.
        </p>
      </div>

      {/* Active User Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white shadow-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">{currentUser.name}</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                  currentUser.role === 'GUARD'
                    ? 'bg-blue-100 text-blue-800'
                    : currentUser.role === 'SUPERVISOR'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">{currentUser.designation}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-100 pt-4 text-xs">
          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-slate-400 block mb-0.5 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              Department
            </span>
            <span className="font-semibold text-slate-800">{currentUser.department}</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-slate-400 block mb-0.5 flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              Institutional Email
            </span>
            <span className="font-semibold text-slate-800">{currentUser.email}</span>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <span className="text-slate-400 block mb-0.5 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" />
              Direct Phone
            </span>
            <span className="font-semibold text-slate-800">{currentUser.phone}</span>
          </div>
        </div>

        {/* Role Permissions Summary */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Active Role Permissions Matrix
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
            {currentUser.role === 'GUARD' && (
              <>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Register Walk-in Visitors & Check Details</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>View Attention Level & Rules Explanation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Record Physical Gate Entry (Check In)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Record Campus Exit & Calculate Duration</span>
                </div>
              </>
            )}

            {currentUser.role === 'HOST' && (
              <>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Receive Real-Time Gate Arrival Notifications</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>One-Touch Actions: Accept, Reject, Request Details</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Provide Special Meeting Room Instructions</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Review Past Visitor Meeting History</span>
                </div>
              </>
            )}

            {currentUser.role === 'SUPERVISOR' && (
              <>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Full Administrative Oversight of All Gates</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Review Flagged Queue & Issue Clearances</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Tune Scoring Heuristic Weights & Thresholds</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Access Campus Safety Analytics & Data Governance</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Switch Persona Section */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Switch Persona for Viva / Project Demonstration</h3>
        <p className="text-xs text-slate-500">
          Effortlessly test how the digital visitor verification workflow behaves from each stakeholder's perspective:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {users.map((u) => {
            const isCurrent = u.id === currentUser.id;
            return (
              <div
                key={u.id}
                onClick={() => switchUser(u.id)}
                className={`cursor-pointer rounded-xl border p-3.5 transition-all text-xs flex items-center justify-between ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{u.name}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] font-bold uppercase ${
                        u.role === 'GUARD'
                          ? 'bg-blue-100 text-blue-800'
                          : u.role === 'SUPERVISOR'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {u.designation} ({u.department})
                  </p>
                </div>
                {isCurrent && <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
