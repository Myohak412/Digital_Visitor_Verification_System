import React, { useState } from 'react';
import {
  Bell,
  BookOpen,
  CheckCircle,
  GraduationCap,
  RotateCcw,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    users,
    switchUser,
    requests,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    setActivePage,
    setIsResearchModalOpen,
    resetDemoData,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);

  // Live campus counter
  const insideCampusCount = requests.filter((r) => r.lifecycleStatus === 'CHECKED_IN').length;
  const userNotifications = notifications.filter((n) => n.recipientUserId === currentUser.id);
  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white shadow-xs">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
            <Shield className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-900 tracking-tight">
                Campus Visitor Verification
              </h1>
              <span className="hidden sm:inline-block rounded bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 border border-indigo-200">
                Research Prototype
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Low-Cost Decision Support & Approval Framework
            </p>
          </div>
        </div>

        {/* Center Indicators */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => setActivePage('ACTIVE_VISITORS')}
            className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Inside Campus:</span>
            <span className="rounded bg-emerald-200/80 px-1.5 py-0.2 text-emerald-900 font-bold">
              {insideCampusCount}
            </span>
          </button>

          <button
            onClick={() => setIsResearchModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-800 transition-colors hover:bg-indigo-100"
          >
            <GraduationCap className="h-4 w-4 text-indigo-600" />
            <span>Research & Viva Dossier</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset application to sample research data?')) {
                resetDemoData();
              }
            }}
            title="Reset to initial test data"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotifMenuOpen(!isNotifMenuOpen);
                setIsUserMenuOpen(false);
              }}
              className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {isNotifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-medium text-slate-600">
                      {userNotifications.length}
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {userNotifications.length === 0 ? (
                    <p className="py-4 text-center text-xs text-slate-500">
                      No notifications for your role.
                    </p>
                  ) : (
                    userNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (currentUser.role === 'HOST') {
                            setActivePage('PENDING_APPROVALS');
                          } else if (currentUser.role === 'SUPERVISOR') {
                            setActivePage('ATTENTION_QUEUE');
                          } else {
                            setActivePage('REQUESTS');
                          }
                          setIsNotifMenuOpen(false);
                        }}
                        className={`cursor-pointer rounded-lg p-2.5 text-xs transition-colors border ${
                          notif.isRead
                            ? 'bg-white border-slate-100 text-slate-600'
                            : 'bg-indigo-50/50 border-indigo-100 text-slate-900 font-medium'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <p className="font-semibold text-slate-900">{notif.title}</p>
                          {!notif.isRead && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsUserMenuOpen(!isUserMenuOpen);
                setIsNotifMenuOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-1.5 text-left transition-colors hover:bg-slate-100"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-900 leading-none">{currentUser.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[10px] font-semibold uppercase text-indigo-700">
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                    {currentUser.department}
                  </span>
                </div>
              </div>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Switch Active Persona</p>
                  <p className="text-[11px] text-slate-500">
                    Test the workflow from any user role:
                  </p>
                </div>

                <div className="py-1 space-y-1">
                  {users.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-start gap-2.5 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                          isSelected
                            ? 'bg-indigo-50 text-indigo-900 font-semibold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span
                          className={`mt-0.5 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            u.role === 'GUARD'
                              ? 'bg-blue-100 text-blue-800'
                              : u.role === 'SUPERVISOR'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {u.role}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate font-medium text-slate-900">{u.name}</p>
                          <p className="truncate text-[11px] text-slate-500">
                            {u.designation} ({u.department})
                          </p>
                        </div>
                        {isSelected && <CheckCircle className="h-4 w-4 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
