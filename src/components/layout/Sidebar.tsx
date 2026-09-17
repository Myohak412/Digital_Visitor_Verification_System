import React from 'react';
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Clock,
  FileSpreadsheet,
  History,
  LayoutDashboard,
  Lock,
  PlusCircle,
  UserCheck,
  UserCheck2,
  Users,
} from 'lucide-react';
import { NavigationPage, useApp } from '../../context/AppContext';

interface NavItem {
  id: NavigationPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
  badgeVariant?: 'red' | 'amber' | 'blue';
  rolesAllowed: Array<'GUARD' | 'HOST' | 'SUPERVISOR'>;
}

export const Sidebar: React.FC = () => {
  const { currentUser, activePage, setActivePage, requests, notifications } = useApp();

  // Calculate dynamic counts
  const pendingApprovalsCount = requests.filter(
    (r) =>
      r.hostApprovalStatus === 'PENDING' &&
      (currentUser.role === 'HOST' ? r.hostId === currentUser.id : true)
  ).length;

  const attentionQueueCount = requests.filter(
    (r) =>
      r.attentionLevel === 'SUPERVISOR_REVIEW' ||
      r.attentionLevel === 'ATTENTION_REQUIRED' ||
      r.lifecycleStatus === 'AWAITING_SUPERVISOR_REVIEW'
  ).length;

  const currentlyInsideCount = requests.filter((r) => r.lifecycleStatus === 'CHECKED_IN').length;

  const unreadNotifCount = notifications.filter(
    (n) => n.recipientUserId === currentUser.id && !n.isRead
  ).length;

  const NAV_ITEMS: NavItem[] = [
    {
      id: 'DASHBOARD',
      label: 'Security Dashboard',
      icon: LayoutDashboard,
      rolesAllowed: ['GUARD', 'SUPERVISOR'],
    },
    {
      id: 'NEW_ENTRY',
      label: 'New Visitor Entry',
      icon: PlusCircle,
      rolesAllowed: ['GUARD', 'SUPERVISOR'],
    },
    {
      id: 'PENDING_APPROVALS',
      label: 'Host Approvals',
      icon: UserCheck,
      badgeCount: pendingApprovalsCount,
      badgeVariant: 'amber',
      rolesAllowed: ['HOST', 'GUARD', 'SUPERVISOR'],
    },
    {
      id: 'ACTIVE_VISITORS',
      label: 'Current on Campus',
      icon: Clock,
      badgeCount: currentlyInsideCount,
      badgeVariant: 'blue',
      rolesAllowed: ['GUARD', 'SUPERVISOR'],
    },
    {
      id: 'ATTENTION_QUEUE',
      label: 'Attention Queue',
      icon: AlertTriangle,
      badgeCount: attentionQueueCount,
      badgeVariant: 'red',
      rolesAllowed: ['GUARD', 'SUPERVISOR'],
    },
    {
      id: 'REQUESTS',
      label: 'Visitor Requests',
      icon: FileSpreadsheet,
      rolesAllowed: ['GUARD', 'HOST', 'SUPERVISOR'],
    },
    {
      id: 'HISTORY',
      label: 'Visitor History Log',
      icon: History,
      rolesAllowed: ['GUARD', 'SUPERVISOR', 'HOST'],
    },
    {
      id: 'ANALYTICS',
      label: 'Security Analytics',
      icon: BarChart3,
      rolesAllowed: ['SUPERVISOR', 'GUARD'],
    },
    {
      id: 'NOTIFICATIONS',
      label: 'Notifications',
      icon: Bell,
      badgeCount: unreadNotifCount,
      badgeVariant: 'red',
      rolesAllowed: ['GUARD', 'HOST', 'SUPERVISOR'],
    },
    {
      id: 'PRIVACY_SETTINGS',
      label: 'Data Retention & Privacy',
      icon: Lock,
      rolesAllowed: ['SUPERVISOR'],
    },
    {
      id: 'PROFILE',
      label: 'User Profile & Role',
      icon: Users,
      rolesAllowed: ['GUARD', 'HOST', 'SUPERVISOR'],
    },
  ];

  // Filter items allowed for this user role
  const visibleNav = NAV_ITEMS.filter((item) => item.rolesAllowed.includes(currentUser.role));

  return (
    <aside className="w-64 shrink-0 border-r border-slate-200 bg-white min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4">
      <div className="space-y-6">
        {/* Role contextual header badge */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <UserCheck2 className="h-4 w-4 text-indigo-600" />
            <span>Active Terminal Role</span>
          </div>
          <p className="mt-1 text-sm font-bold text-slate-900">{currentUser.name}</p>
          <div className="mt-1 flex items-center justify-between">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                currentUser.role === 'GUARD'
                  ? 'bg-blue-100 text-blue-800'
                  : currentUser.role === 'SUPERVISOR'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {currentUser.role === 'HOST' ? `${currentUser.userType} HOST` : currentUser.role}
            </span>
            <span className="text-[11px] text-slate-500">{currentUser.department.split(' ')[0]}</span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {visibleNav.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 ${
                      isActive ? 'text-indigo-400' : 'text-slate-500'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.badgeVariant === 'red'
                        ? 'bg-rose-100 text-rose-700'
                        : item.badgeVariant === 'amber'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-[11px] text-slate-500 space-y-1">
        <p className="font-semibold text-slate-700">MCA Research System</p>
        <p>No biometrics • No Aadhaar • Low-cost commodity browser platform</p>
      </div>
    </aside>
  );
};
