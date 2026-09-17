import React from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { AttentionRuleResult, AttentionTier } from '../../types';
import { getAttentionBadgeStyle } from '../../utils/attentionEngine';

interface AttentionReasonCardProps {
  score: number;
  level: AttentionTier;
  reasons: AttentionRuleResult[];
  compact?: boolean;
}

export const AttentionReasonCard: React.FC<AttentionReasonCardProps> = ({
  score,
  level,
  reasons,
  compact = false,
}) => {
  const badgeStyle = getAttentionBadgeStyle(level);

  if (compact) {
    return (
      <div className={`rounded-lg border p-2.5 ${badgeStyle.bg} ${badgeStyle.border}`}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium text-xs">
            {level === 'SUPERVISOR_REVIEW' ? (
              <ShieldAlert className="h-4 w-4 text-rose-600" />
            ) : level === 'ATTENTION_REQUIRED' ? (
              <AlertCircle className="h-4 w-4 text-amber-600" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            )}
            <span className={badgeStyle.text}>{badgeStyle.label}</span>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/80 text-slate-700 border border-slate-200">
            Score: {score} pts
          </span>
        </div>
        {reasons.length > 0 && (
          <ul className="mt-1.5 space-y-0.5 text-xs text-slate-700 pl-4 list-disc">
            {reasons.slice(0, 2).map((r, i) => (
              <li key={i}>{r.plainReason}</li>
            ))}
            {reasons.length > 2 && (
              <li className="text-slate-500 italic">+{reasons.length - 2} more rule trigger(s)</li>
            )}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border p-4 ${badgeStyle.bg} ${badgeStyle.border}`}>
      <div className="flex items-center justify-between pb-3 border-b border-black/5">
        <div className="flex items-center gap-2">
          {level === 'SUPERVISOR_REVIEW' ? (
            <ShieldAlert className="h-5 w-5 text-rose-600" />
          ) : level === 'ATTENTION_REQUIRED' ? (
            <AlertCircle className="h-5 w-5 text-amber-600" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          )}
          <div>
            <h4 className={`text-sm font-semibold ${badgeStyle.text}`}>
              Attention Level: {badgeStyle.label}
            </h4>
            <p className="text-xs text-slate-600">
              Deterministic rule-based administrative score: <span className="font-bold">{score} Points</span>
            </p>
          </div>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-xs">
          Transparent Heuristic
        </span>
      </div>

      <div className="mt-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          Why was this request assigned this level?
        </p>

        {reasons.length === 0 ? (
          <p className="mt-1.5 text-xs text-emerald-800 bg-emerald-100/50 p-2 rounded border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Standard visit profile. Scheduled appointment, standard hours, and within expected duration thresholds. No attention triggers met.
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {reasons.map((r, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 bg-white/90 p-2.5 rounded-lg border border-slate-200/80 text-xs shadow-xs"
              >
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-slate-500" />
                  <div>
                    <span className="font-semibold text-slate-900">{r.ruleName}:</span>{' '}
                    <span className="text-slate-700">{r.plainReason}</span>
                  </div>
                </div>
                <span className="shrink-0 font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                  +{r.pointsAdded}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 pt-2 border-t border-black/5 text-[11px] text-slate-500 flex items-center justify-between">
        <span>Evaluation Standard: College Campus Gate Protocol v1.0</span>
        <span className="italic">Non-criminal administrative attention only</span>
      </div>
    </div>
  );
};
