import React from 'react';
import { AttentionTier, HostApprovalStatus, VisitLifecycleStatus } from '../../types';
import { getAttentionBadgeStyle } from '../../utils/attentionEngine';

interface StatusBadgeProps {
  type: 'LIFECYCLE' | 'HOST_APPROVAL' | 'ATTENTION';
  value: VisitLifecycleStatus | HostApprovalStatus | AttentionTier;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  if (type === 'ATTENTION') {
    const style = getAttentionBadgeStyle(value as AttentionTier);
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${style.dotColor}`} />
        {style.label}
      </span>
    );
  }

  if (type === 'HOST_APPROVAL') {
    switch (value) {
      case 'APPROVED':
        return (
          <span className={`inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 ${sizeClasses}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Host Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className={`inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 text-rose-700 ${sizeClasses}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            Host Rejected
          </span>
        );
      case 'INFO_REQUESTED':
        return (
          <span className={`inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700 ${sizeClasses}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Info Requested
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className={`inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 text-amber-700 ${sizeClasses}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Pending Host Action
          </span>
        );
    }
  }

  // Lifecycle status
  switch (value) {
    case 'CHECKED_IN':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-emerald-300 bg-emerald-100/70 text-emerald-800 ${sizeClasses}`}>
          <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
          Inside Campus
        </span>
      );
    case 'CHECKED_OUT':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 text-slate-700 ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Completed / Exited
        </span>
      );
    case 'APPROVED_NOT_ENTERED':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          Cleared for Entry
        </span>
      );
    case 'AWAITING_SUPERVISOR_REVIEW':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-rose-300 bg-rose-100 text-rose-800 ${sizeClasses}`}>
          <span className="h-2 w-2 rounded-full bg-rose-600 animate-ping" />
          Supervisor Review Needed
        </span>
      );
    case 'AWAITING_HOST_APPROVAL':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 text-amber-800 ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Awaiting Host Confirmation
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 text-rose-700 ${sizeClasses}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Entry Denied
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600 ${sizeClasses}`}>
          {value}
        </span>
      );
  }
};
