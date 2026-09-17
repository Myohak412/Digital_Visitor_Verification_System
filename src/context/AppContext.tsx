import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_RETENTION_SETTINGS,
  DEFAULT_RULES_CONFIG,
  INITIAL_NOTIFICATIONS,
  INITIAL_REQUESTS,
  INITIAL_USERS,
  INITIAL_VISITORS,
} from '../data/mockData';
import {
  AppointmentStatus,
  AttentionRuleConfig,
  HostApprovalStatus,
  NotificationItem,
  RetentionSettings,
  User,
  VisitPurpose,
  Visitor,
  VisitorRequest,
} from '../types';
import { evaluateVisitorAttention } from '../utils/attentionEngine';

export type NavigationPage =
  | 'DASHBOARD'
  | 'REQUESTS'
  | 'NEW_ENTRY'
  | 'PENDING_APPROVALS'
  | 'ACTIVE_VISITORS'
  | 'ATTENTION_QUEUE'
  | 'HISTORY'
  | 'ANALYTICS'
  | 'NOTIFICATIONS'
  | 'PROFILE'
  | 'PRIVACY_SETTINGS';

interface CreateRequestParams {
  visitorName: string;
  visitorPhone: string;
  visitorVehicle?: string;
  hostId: string;
  purpose: VisitPurpose;
  purposeOtherText?: string;
  expectedDurationMinutes: number;
  appointmentStatus: AppointmentStatus;
  remarks?: string;
}

interface AppContextType {
  currentUser: User;
  users: User[];
  visitors: Visitor[];
  requests: VisitorRequest[];
  notifications: NotificationItem[];
  rulesConfig: AttentionRuleConfig[];
  retentionSettings: RetentionSettings;
  activePage: NavigationPage;
  selectedVisitorId: string | null;
  isResearchModalOpen: boolean;

  // Navigation & UI controls
  setActivePage: (page: NavigationPage) => void;
  setSelectedVisitorId: (id: string | null) => void;
  setIsResearchModalOpen: (open: boolean) => void;
  switchUser: (userId: string) => void;

  // Actions
  createNewVisitorRequest: (params: CreateRequestParams) => VisitorRequest;
  respondAsHost: (requestId: string, status: HostApprovalStatus, note?: string) => void;
  recordVisitorEntry: (requestId: string) => void;
  recordVisitorExit: (requestId: string) => void;
  supervisorReviewAction: (requestId: string, decision: 'APPROVED' | 'REJECTED', note: string) => void;
  submitGuardClarification: (requestId: string, clarificationNote: string) => void;
  updateRuleConfig: (rules: AttentionRuleConfig[]) => void;
  updateRetentionSettings: (settings: RetentionSettings) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'dvvs_users_v1',
  CURRENT_USER_ID: 'dvvs_curr_user_id_v1',
  VISITORS: 'dvvs_visitors_v1',
  REQUESTS: 'dvvs_requests_v1',
  NOTIFICATIONS: 'dvvs_notifications_v1',
  RULES: 'dvvs_rules_v1',
  RETENTION: 'dvvs_retention_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load or initialize state with localStorage fallbacks
  const [users] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || INITIAL_USERS[0].id; // Default to Guard 1 (Ramesh Kumar)
  });

  const [visitors, setVisitors] = useState<Visitor[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.VISITORS);
    return saved ? JSON.parse(saved) : INITIAL_VISITORS;
  });

  const [requests, setRequests] = useState<VisitorRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    return saved ? JSON.parse(saved) : INITIAL_REQUESTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [rulesConfig, setRulesConfig] = useState<AttentionRuleConfig[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RULES);
    return saved ? JSON.parse(saved) : DEFAULT_RULES_CONFIG;
  });

  const [retentionSettings, setRetentionSettings] = useState<RetentionSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RETENTION);
    return saved ? JSON.parse(saved) : DEFAULT_RETENTION_SETTINGS;
  });

  const [activePage, setActivePage] = useState<NavigationPage>('DASHBOARD');
  const [selectedVisitorId, setSelectedVisitorId] = useState<string | null>(null);
  const [isResearchModalOpen, setIsResearchModalOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.VISITORS, JSON.stringify(visitors));
  }, [visitors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rulesConfig));
  }, [rulesConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RETENTION, JSON.stringify(retentionSettings));
  }, [retentionSettings]);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0];

  const switchUser = (userId: string) => {
    setCurrentUserId(userId);
    // When switching to Host, auto-direct to Pending Approvals if there are any
    const targetUser = users.find((u) => u.id === userId);
    if (targetUser?.role === 'HOST') {
      const hasPending = requests.some(
        (r) => r.hostId === userId && r.hostApprovalStatus === 'PENDING'
      );
      if (hasPending) {
        setActivePage('PENDING_APPROVALS');
      }
    }
  };

  const createNewVisitorRequest = (params: CreateRequestParams): VisitorRequest => {
    // 1. Locate or create Master Visitor Record
    const cleanPhone = params.visitorPhone.replace(/\D/g, '').slice(-10);
    let existingVisitor = visitors.find(
      (v) => v.phoneNumber.replace(/\D/g, '').slice(-10) === cleanPhone
    );

    const targetHost = users.find((u) => u.id === params.hostId) || users[2];

    // 2. Evaluate Attention Engine Rules
    const evaluation = evaluateVisitorAttention({
      appointmentStatus: params.appointmentStatus,
      expectedDurationMinutes: params.expectedDurationMinutes,
      purpose: params.purpose,
      remarks: params.remarks,
      visitorHistory: existingVisitor || null,
      requestTime: new Date(),
      isHostStudent: targetHost.userType === 'STUDENT',
    });

    const nowIso = new Date().toISOString();

    if (!existingVisitor) {
      existingVisitor = {
        id: `vis-${Date.now()}`,
        fullName: params.visitorName,
        phoneNumber: params.visitorPhone,
        vehicleNumber: params.visitorVehicle,
        totalVisits: 1,
        approvedVisits: 0,
        rejectedVisits: 0,
        totalTimeInsideMinutes: 0,
        firstSeenAt: nowIso,
        lastSeenAt: nowIso,
        observedPatterns: ['First-Time Campus Visitor'],
      };
      setVisitors((prev) => [existingVisitor!, ...prev]);
    } else {
      // Update existing visitor seen time
      const updatedVisitor: Visitor = {
        ...existingVisitor,
        totalVisits: existingVisitor.totalVisits + 1,
        lastSeenAt: nowIso,
        vehicleNumber: params.visitorVehicle || existingVisitor.vehicleNumber,
      };
      setVisitors((prev) => prev.map((v) => (v.id === updatedVisitor.id ? updatedVisitor : v)));
      existingVisitor = updatedVisitor;
    }

    const newRequestId = `req-${Date.now().toString().slice(-4)}`;

    const newRequest: VisitorRequest = {
      id: newRequestId,
      visitorId: existingVisitor.id,
      visitorName: params.visitorName,
      visitorPhone: params.visitorPhone,
      visitorVehicle: params.visitorVehicle,
      hostId: targetHost.id,
      hostName: targetHost.name,
      hostDepartment: targetHost.department,
      hostType: targetHost.userType === 'STUDENT' ? 'STUDENT' : 'FACULTY',
      guardId: currentUser.id,
      guardName: currentUser.name,
      purpose: params.purpose,
      purposeOtherText: params.purposeOtherText,
      expectedDurationMinutes: params.expectedDurationMinutes,
      appointmentStatus: params.appointmentStatus,
      remarks: params.remarks,
      attentionScore: evaluation.score,
      attentionLevel: evaluation.level,
      attentionReasons: evaluation.reasons,
      hostApprovalStatus: 'PENDING',
      supervisorStatus:
        evaluation.level === 'SUPERVISOR_REVIEW' ? 'PENDING_REVIEW' : 'NOT_REQUIRED',
      lifecycleStatus:
        evaluation.level === 'SUPERVISOR_REVIEW'
          ? 'AWAITING_SUPERVISOR_REVIEW'
          : 'AWAITING_HOST_APPROVAL',
      createdAt: nowIso,
    };

    setRequests((prev) => [newRequest, ...prev]);

    // Send notifications to Host and optionally Supervisor
    const newNotifications: NotificationItem[] = [
      {
        id: `notif-${Date.now()}-1`,
        recipientUserId: targetHost.id,
        requestId: newRequest.id,
        title: `Visitor Request: ${params.visitorName}`,
        message: `${params.visitorName} is at the campus gate requesting to meet you for ${params.purpose.replace(/_/g, ' ')}.`,
        type: 'NEW_REQUEST',
        isRead: false,
        createdAt: nowIso,
      },
    ];

    if (evaluation.level === 'SUPERVISOR_REVIEW') {
      const supervisor = users.find((u) => u.role === 'SUPERVISOR') || users[6];
      newNotifications.push({
        id: `notif-${Date.now()}-2`,
        recipientUserId: supervisor.id,
        requestId: newRequest.id,
        title: `Attention Alert: ${params.visitorName}`,
        message: `High attention score (${evaluation.score}). Supervisor review required for entry clearance.`,
        type: 'SUPERVISOR_ALERT',
        isRead: false,
        createdAt: nowIso,
      });
    }

    setNotifications((prev) => [...newNotifications, ...prev]);
    return newRequest;
  };

  const respondAsHost = (
    requestId: string,
    status: HostApprovalStatus,
    note?: string
  ) => {
    const nowIso = new Date().toISOString();
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;

        let nextLifecycle = req.lifecycleStatus;
        if (status === 'APPROVED') {
          // If supervisor review is pending, remains awaiting supervisor review
          nextLifecycle =
            req.supervisorStatus === 'PENDING_REVIEW'
              ? 'AWAITING_SUPERVISOR_REVIEW'
              : 'APPROVED_NOT_ENTERED';
        } else if (status === 'REJECTED') {
          nextLifecycle = 'REJECTED';
        } else if (status === 'INFO_REQUESTED') {
          nextLifecycle = 'AWAITING_HOST_APPROVAL';
        }

        return {
          ...req,
          hostApprovalStatus: status,
          hostResponseNote: note || req.hostResponseNote,
          hostRespondedAt: nowIso,
          lifecycleStatus: nextLifecycle,
        };
      })
    );

    // Update Visitor Stats if Rejected
    const targetReq = requests.find((r) => r.id === requestId);
    if (targetReq) {
      if (status === 'REJECTED') {
        setVisitors((prev) =>
          prev.map((v) =>
            v.id === targetReq.visitorId
              ? {
                  ...v,
                  rejectedVisits: v.rejectedVisits + 1,
                  observedPatterns: Array.from(
                    new Set([...v.observedPatterns, 'Host Rejection Logged'])
                  ),
                }
              : v
          )
        );
      }

      // Notify Guard
      const guardNotification: NotificationItem = {
        id: `notif-${Date.now()}`,
        recipientUserId: targetReq.guardId || users[0].id,
        requestId: targetReq.id,
        title: `Host Decision: ${status}`,
        message: `${targetReq.hostName} marked request for ${targetReq.visitorName} as ${status}.`,
        type: status === 'INFO_REQUESTED' ? 'INFO_NEEDED' : 'HOST_DECISION',
        isRead: false,
        createdAt: nowIso,
      };
      setNotifications((prev) => [guardNotification, ...prev]);
    }
  };

  const recordVisitorEntry = (requestId: string) => {
    const nowIso = new Date().toISOString();
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          entryTime: nowIso,
          lifecycleStatus: 'CHECKED_IN',
        };
      })
    );

    // Increment approved visits on visitor master record
    const targetReq = requests.find((r) => r.id === requestId);
    if (targetReq) {
      setVisitors((prev) =>
        prev.map((v) =>
          v.id === targetReq.visitorId
            ? { ...v, approvedVisits: v.approvedVisits + 1 }
            : v
        )
      );
    }
  };

  const recordVisitorExit = (requestId: string) => {
    const nowIso = new Date().toISOString();
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const entryDate = req.entryTime ? new Date(req.entryTime) : new Date();
        const exitDate = new Date(nowIso);
        const durationMin = Math.max(
          1,
          Math.round((exitDate.getTime() - entryDate.getTime()) / (1000 * 60))
        );

        // Update Visitor master total time
        setVisitors((vList) =>
          vList.map((v) =>
            v.id === req.visitorId
              ? {
                  ...v,
                  totalTimeInsideMinutes: v.totalTimeInsideMinutes + durationMin,
                }
              : v
          )
        );

        return {
          ...req,
          exitTime: nowIso,
          actualDurationMinutes: durationMin,
          lifecycleStatus: 'CHECKED_OUT',
        };
      })
    );
  };

  const supervisorReviewAction = (
    requestId: string,
    decision: 'APPROVED' | 'REJECTED',
    note: string
  ) => {
    const nowIso = new Date().toISOString();
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        const nextLifecycle =
          decision === 'APPROVED'
            ? req.hostApprovalStatus === 'APPROVED'
              ? 'APPROVED_NOT_ENTERED'
              : 'AWAITING_HOST_APPROVAL'
            : 'REJECTED';

        return {
          ...req,
          supervisorStatus:
            decision === 'APPROVED' ? 'APPROVED_OVERRIDE' : 'REJECTED_OVERRIDE',
          supervisorNote: note,
          supervisorReviewedAt: nowIso,
          supervisorReviewedBy: currentUser.name,
          lifecycleStatus: nextLifecycle,
        };
      })
    );
  };

  const submitGuardClarification = (requestId: string, note: string) => {
    setRequests((prev) =>
      prev.map((req) => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          guardClarificationNote: note,
        };
      })
    );
  };

  const updateRuleConfig = (newRules: AttentionRuleConfig[]) => {
    setRulesConfig(newRules);
  };

  const updateRetentionSettings = (newSettings: RetentionSettings) => {
    setRetentionSettings(newSettings);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.VISITORS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
    localStorage.removeItem(STORAGE_KEYS.RULES);
    localStorage.removeItem(STORAGE_KEYS.RETENTION);
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        visitors,
        requests,
        notifications,
        rulesConfig,
        retentionSettings,
        activePage,
        selectedVisitorId,
        isResearchModalOpen,
        setActivePage,
        setSelectedVisitorId,
        setIsResearchModalOpen,
        switchUser,
        createNewVisitorRequest,
        respondAsHost,
        recordVisitorEntry,
        recordVisitorExit,
        supervisorReviewAction,
        submitGuardClarification,
        updateRuleConfig,
        updateRetentionSettings,
        markNotificationAsRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
