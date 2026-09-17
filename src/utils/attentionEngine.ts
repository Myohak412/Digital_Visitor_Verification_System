import {
  AppointmentStatus,
  AttentionRuleResult,
  AttentionTier,
  VisitPurpose,
  Visitor,
} from '../types';

export interface EvaluationInput {
  appointmentStatus: AppointmentStatus;
  expectedDurationMinutes: number;
  purpose: VisitPurpose;
  remarks?: string;
  visitorHistory?: Visitor | null;
  requestTime?: Date;
  isHostStudent?: boolean;
}

export function evaluateVisitorAttention(input: EvaluationInput): {
  score: number;
  level: AttentionTier;
  reasons: AttentionRuleResult[];
} {
  const reasons: AttentionRuleResult[] = [];
  let score = 0;
  const now = input.requestTime || new Date();
  const currentHour = now.getHours();

  // Rule 1: No Appointment (Walk-in)
  if (input.appointmentStatus === 'WALK_IN') {
    const points = 20;
    score += points;
    reasons.push({
      ruleCode: 'R1_NO_APPT',
      ruleName: 'Unscheduled Walk-in',
      pointsAdded: points,
      plainReason: 'No prior scheduled appointment was recorded in the system.',
    });
  }

  // Rule 2: Expected duration is very long (> 240 minutes / 4 hours)
  if (input.expectedDurationMinutes > 240) {
    const points = 15;
    score += points;
    reasons.push({
      ruleCode: 'R2_LONG_DURATION',
      ruleName: 'Extended Stay Duration',
      pointsAdded: points,
      plainReason: `Expected duration (${Math.round(input.expectedDurationMinutes / 60)} hrs) exceeds the standard 4-hour campus threshold.`,
    });
  }

  // Rule 3: Outside standard academic operating hours (before 08:00 or after 18:00)
  if (currentHour < 8 || currentHour >= 18) {
    const points = 25;
    score += points;
    reasons.push({
      ruleCode: 'R3_OFF_HOURS',
      ruleName: 'Non-Standard Visit Hours',
      pointsAdded: points,
      plainReason: `Visit initiated outside standard campus operating hours (${currentHour}:00 hrs).`,
    });
  }

  // Rule 4: Previous rejection history
  if (input.visitorHistory && input.visitorHistory.rejectedVisits >= 2) {
    const points = 30;
    score += points;
    reasons.push({
      ruleCode: 'R4_PAST_REJECTIONS',
      ruleName: 'Multiple Prior Host Rejections',
      pointsAdded: points,
      plainReason: `Visitor has ${input.visitorHistory.rejectedVisits} previously rejected visit requests on record.`,
    });
  }

  // Rule 5: Unusually frequent visits (High frequency pattern)
  if (input.visitorHistory && input.visitorHistory.totalVisits >= 5) {
    const points = 15;
    score += points;
    reasons.push({
      ruleCode: 'R5_HIGH_FREQUENCY',
      ruleName: 'Frequent Campus Activity',
      pointsAdded: points,
      plainReason: `High visit count (${input.visitorHistory.totalVisits} previous visits recorded). Verification of ongoing business advised.`,
    });
  }

  // Rule 6: Purpose marked as OTHER without explanatory remarks
  if (input.purpose === 'OTHER' && (!input.remarks || input.remarks.trim().length < 5)) {
    const points = 20;
    score += points;
    reasons.push({
      ruleCode: 'R6_UNCLEAR_PURPOSE',
      ruleName: 'Incomplete Purpose Remarks',
      pointsAdded: points,
      plainReason: 'Purpose is specified as "Other" without specific explanatory details.',
    });
  }

  // Rule 7: Evening visit to student residential quarters
  if (input.isHostStudent && currentHour >= 17) {
    const points = 15;
    score += points;
    reasons.push({
      ruleCode: 'R7_HOSTEL_EVENING',
      ruleName: 'Late Student Quarter Visit',
      pointsAdded: points,
      plainReason: 'Evening visitor request to a student residential/hostel block requires strict host check.',
    });
  }

  // Determine Tier
  let level: AttentionTier = 'NORMAL';
  if (score >= 60) {
    level = 'SUPERVISOR_REVIEW';
  } else if (score >= 30) {
    level = 'ATTENTION_REQUIRED';
  } else {
    level = 'NORMAL';
  }

  return {
    score,
    level,
    reasons,
  };
}

export function getAttentionBadgeStyle(tier: AttentionTier): {
  bg: string;
  text: string;
  border: string;
  label: string;
  dotColor: string;
} {
  switch (tier) {
    case 'SUPERVISOR_REVIEW':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        label: 'Supervisor Review (High)',
        dotColor: 'bg-rose-600',
      };
    case 'ATTENTION_REQUIRED':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-800',
        border: 'border-amber-200',
        label: 'Attention Required (Moderate)',
        dotColor: 'bg-amber-500',
      };
    case 'NORMAL':
    default:
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        label: 'Normal (Low)',
        dotColor: 'bg-emerald-600',
      };
  }
}
