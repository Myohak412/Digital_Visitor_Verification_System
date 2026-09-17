import React, { useState } from 'react';
import {
  Archive,
  CheckCircle2,
  Database,
  Download,
  EyeOff,
  Lock,
  Save,
  Shield,
  Trash2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RetentionSettings } from '../../types';

export const PrivacySettings: React.FC = () => {
  const { retentionSettings, updateRetentionSettings, requests, visitors } = useApp();
  const [formData, setFormData] = useState<RetentionSettings>(retentionSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateRetentionSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportData = () => {
    // Generate an anonymized research dataset JSON
    const anonymizedDataset = {
      exportedAt: new Date().toISOString(),
      institution: 'College Campus Security Research Sample',
      totalRecords: requests.length,
      records: requests.map((r, i) => ({
        studyRecordId: `REC-${i + 1}`,
        purpose: r.purpose,
        expectedStayMinutes: r.expectedDurationMinutes,
        actualStayMinutes: r.actualDurationMinutes || null,
        appointmentStatus: r.appointmentStatus,
        attentionScore: r.attentionScore,
        attentionLevel: r.attentionLevel,
        hostDecision: r.hostApprovalStatus,
        lifecycle: r.lifecycleStatus,
        // Privacy: Personal identifying info omitted in research export
        maskedHostType: r.hostType,
      })),
    };

    const blob = new Blob([JSON.stringify(anonymizedDataset, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anonymized_visitor_research_dataset_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Privacy, Governance & Data Retention Settings</h2>
        <p className="text-xs text-slate-500">
          Enforce institutional data minimization policies, automated record archival, and research data export.
        </p>
      </div>

      {savedSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>Data retention and privacy configuration successfully saved.</span>
        </div>
      )}

      {/* Principles Banner */}
      <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
          <Lock className="h-4 w-4 text-indigo-600" />
          <span>Privacy-by-Design Compliance Statement</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-700">
          <div className="bg-white/80 p-3 rounded-xl border border-indigo-100">
            <span className="font-bold text-slate-900 block mb-1">Data Minimization</span>
            Zero collection of Aadhaar numbers, biometric fingerprints, or facial photos. Only basic operational contact data is recorded.
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-indigo-100">
            <span className="font-bold text-slate-900 block mb-1">Role Segregation</span>
            Guards see gate logs; hosts see only their own invited guests; supervisors audit system-level patterns.
          </div>
          <div className="bg-white/80 p-3 rounded-xl border border-indigo-100">
            <span className="font-bold text-slate-900 block mb-1">Bounded Retention</span>
            Logs are automatically scheduled for anonymization or archival after designated academic review cycles.
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Configurable Lifecycle & Archival Policies</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Active Log Retention Period (Days)
              </label>
              <select
                value={formData.logRetentionDays}
                onChange={(e) =>
                  setFormData({ ...formData, logRetentionDays: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-hidden"
              >
                <option value={30}>30 Days (One Month)</option>
                <option value={90}>90 Days (One Semester Quarter)</option>
                <option value={180}>180 Days (One Academic Semester)</option>
                <option value={365}>365 Days (Full Academic Year)</option>
              </select>
              <p className="mt-1 text-[11px] text-slate-500">
                Detailed gate logs older than this are archived into long-term audit storage.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Anonymize Contact Information After (Days)
              </label>
              <select
                value={formData.anonymizeAfterDays}
                onChange={(e) =>
                  setFormData({ ...formData, anonymizeAfterDays: Number(e.target.value) })
                }
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-hidden"
              >
                <option value={30}>30 Days</option>
                <option value={60}>60 Days</option>
                <option value={90}>90 Days</option>
                <option value={180}>180 Days</option>
              </select>
              <p className="mt-1 text-[11px] text-slate-500">
                Replaces telephone numbers and vehicles with cryptographic hashes to preserve analytics without exposing PII.
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="flex items-center gap-2.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={formData.maskPhoneNumbersInPublicViews}
                onChange={(e) =>
                  setFormData({ ...formData, maskPhoneNumbersInPublicViews: e.target.checked })
                }
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-slate-800">
                Mask Phone Numbers in General Terminal Views (e.g. 98450***** instead of full number)
              </span>
            </label>

            <label className="flex items-center gap-2.5 text-xs cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowDataExportForResearch}
                onChange={(e) =>
                  setFormData({ ...formData, allowDataExportForResearch: e.target.checked })
                }
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span className="font-semibold text-slate-800">
                Enable Anonymized Research Dataset Generation (Dissertation Experimentation)
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>Save Retention Policies</span>
          </button>

          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-2 rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export Anonymized Research JSON</span>
          </button>
        </div>
      </form>

      {/* Database Status */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <Database className="h-5 w-5 text-slate-400" />
          <div>
            <p className="font-bold text-slate-900">Current Storage Footprint</p>
            <p className="text-[11px] text-slate-500">
              {requests.length} Visit Records • {visitors.length} Unique Visitors • 0 Bytes external media storage
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
          Database Healthy
        </span>
      </div>
    </div>
  );
};
