export type UserRole = 'GUARD' | 'HOST' | 'SUPERVISOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  phone: string;
  avatar?: string;
  userType?: 'FACULTY' | 'STUDENT' | 'STAFF' | 'SECURITY';
}

export type VisitPurpose = 
  | 'ACADEMIC_MEETING'
  | 'PARENT_GUARDIAN_VISIT'
  | 'VENDOR_MAINTENANCE'
  | 'OFFICIAL_DOCUMENTS'
  | 'GUEST_SPEAKER'
  | 'ADMISSION_INQUIRY'
  | 'CAMPUS_INTERVIEW'
  | 'PERSONAL_GUEST'
  | 'OTHER';

export type AppointmentStatus = 'SCHEDULED' | 'WALK_IN';

export type HostApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'INFO_REQUESTED';

export type AttentionTier = 'NORMAL' | 'ATTENTION_REQUIRED' | 'SUPERVISOR_REVIEW';

export type SupervisorStatus = 'NOT_REQUIRED' | 'PENDING_REVIEW' | 'APPROVED_OVERRIDE' | 'REJECTED_OVERRIDE';

export type VisitLifecycleStatus = 
  | 'AWAITING_HOST_APPROVAL'
  | 'AWAITING_SUPERVISOR_REVIEW'
  | 'APPROVED_NOT_ENTERED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'REJECTED'
  | 'CANCELLED';

export interface Visitor {
  id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  city?: string;
  idProofType?: string; // e.g. "College ID / Driving License (Self-stated type, non-Aadhaar)"
  vehicleNumber?: string;
  totalVisits: number;
  approvedVisits: number;
  rejectedVisits: number;
  totalTimeInsideMinutes: number;
  firstSeenAt: string;
  lastSeenAt: string;
  observedPatterns: string[];
}

export interface AttentionRuleResult {
  ruleCode: string;
  ruleName: string;
  pointsAdded: number;
  plainReason: string;
}

export interface VisitorRequest {
  id: string;
  visitorId: string;
  visitorName: string;
  visitorPhone: string;
  visitorVehicle?: string;
  
  hostId: string;
  hostName: string;
  hostDepartment: string;
  hostType: 'FACULTY' | 'STUDENT' | 'STAFF';
  
  guardId: string;
  guardName: string;
  
  purpose: VisitPurpose;
  purposeOtherText?: string;
  expectedDurationMinutes: number;
  appointmentStatus: AppointmentStatus;
  remarks?: string;
  
  // Attention Scoring
  attentionScore: number;
  attentionLevel: AttentionTier;
  attentionReasons: AttentionRuleResult[];
  
  // Workflow States
  hostApprovalStatus: HostApprovalStatus;
  hostResponseNote?: string;
  hostRespondedAt?: string;
  
  supervisorStatus: SupervisorStatus;
  supervisorNote?: string;
  supervisorReviewedAt?: string;
  supervisorReviewedBy?: string;
  
  lifecycleStatus: VisitLifecycleStatus;
  
  // Timestamps
  createdAt: string;
  entryTime?: string;
  exitTime?: string;
  actualDurationMinutes?: number;
  
  // Follow-up clarifications
  requestedInfoDetails?: string;
  guardClarificationNote?: string;
}

export interface NotificationItem {
  id: string;
  recipientUserId: string;
  requestId: string;
  title: string;
  message: string;
  type: 'NEW_REQUEST' | 'HOST_DECISION' | 'SUPERVISOR_ALERT' | 'INFO_NEEDED' | 'OVERSTAY_ALERT';
  isRead: boolean;
  createdAt: string;
}

export interface AttentionRuleConfig {
  code: string;
  name: string;
  description: string;
  points: number;
  isActive: boolean;
}

export interface RetentionSettings {
  logRetentionDays: number;
  anonymizeAfterDays: number;
  autoPurgeRejectedAfterDays: number;
  allowDataExportForResearch: boolean;
  maskPhoneNumbersInPublicViews: boolean;
}
