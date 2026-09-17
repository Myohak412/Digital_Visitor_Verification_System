import React from 'react';
import { Bell, Check, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsView: React.FC = () => {
  const {
    currentUser,
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    setActivePage,
  } = useApp();

  const userNotifications = notifications.filter((n) => n.recipientUserId === currentUser.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Notifications & Alerts</h2>
          <p className="text-xs text-slate-500">
            Real-time asynchronous alerts for visitor arrivals, host responses, and supervisor flags.
          </p>
        </div>

        {userNotifications.length > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-xs"
          >
            <CheckCheck className="h-3.5 w-3.5 text-indigo-600" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {userNotifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Bell className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-sm font-bold text-slate-900">No Notifications</h3>
          <p className="mt-1 text-xs text-slate-500">
            You are completely caught up with all campus gate events.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {userNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`rounded-2xl border p-4 transition-all flex items-start justify-between gap-4 ${
                notif.isRead
                  ? 'border-slate-200 bg-white'
                  : 'border-indigo-200 bg-indigo-50/40 shadow-xs'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                    notif.type === 'SUPERVISOR_ALERT'
                      ? 'bg-rose-100 text-rose-700'
                      : notif.type === 'INFO_NEEDED'
                      ? 'bg-blue-100 text-blue-700'
                      : notif.type === 'HOST_DECISION'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{notif.title}</h4>
                    {!notif.isRead && (
                      <span className="rounded-full bg-indigo-600 px-2 py-0.2 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{notif.message}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(notif.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>• Request ID: {notif.requestId}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (currentUser.role === 'HOST') {
                      setActivePage('PENDING_APPROVALS');
                    } else if (currentUser.role === 'SUPERVISOR') {
                      setActivePage('ATTENTION_QUEUE');
                    } else {
                      setActivePage('REQUESTS');
                    }
                  }}
                  className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  <span>Open</span>
                  <ExternalLink className="h-3 w-3" />
                </button>

                {!notif.isRead && (
                  <button
                    onClick={() => markNotificationAsRead(notif.id)}
                    className="rounded-lg p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                    title="Mark read"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
