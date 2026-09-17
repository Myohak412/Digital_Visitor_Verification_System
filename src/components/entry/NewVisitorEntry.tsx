import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Calendar,
  Car,
  Clock,
  FileText,
  Phone,
  Send,
  User,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AppointmentStatus, VisitPurpose } from '../../types';
import { evaluateVisitorAttention } from '../../utils/attentionEngine';
import { AttentionReasonCard } from '../common/AttentionReasonCard';

export const NewVisitorEntry: React.FC = () => {
  const { users, visitors, createNewVisitorRequest, setActivePage } = useApp();

  // Form states
  const [visitorName, setVisitorName] = useState('');
  const [visitorPhone, setVisitorPhone] = useState('');
  const [visitorVehicle, setVisitorVehicle] = useState('');
  const [hostId, setHostId] = useState(users.find((u) => u.role === 'HOST')?.id || '');
  const [purpose, setPurpose] = useState<VisitPurpose>('ACADEMIC_MEETING');
  const [purposeOtherText, setPurposeOtherText] = useState('');
  const [expectedDurationMinutes, setExpectedDurationMinutes] = useState(90);
  const [appointmentStatus, setAppointmentStatus] = useState<AppointmentStatus>('WALK_IN');
  const [remarks, setRemarks] = useState('');
  const [submittedRequest, setSubmittedRequest] = useState<any>(null);

  // Available hosts
  const hostUsers = users.filter((u) => u.role === 'HOST');
  const selectedHost = users.find((u) => u.id === hostId);

  // Auto-detect existing visitor history if phone number matches
  const cleanPhone = visitorPhone.replace(/\D/g, '').slice(-10);
  const matchedVisitor = useMemo(() => {
    if (cleanPhone.length >= 8) {
      return (
        visitors.find(
          (v) => v.phoneNumber.replace(/\D/g, '').slice(-10) === cleanPhone
        ) || null
      );
    }
    return null;
  }, [cleanPhone, visitors]);

  // If matched visitor exists, optionally autofill name or vehicle if empty
  const handlePhoneChange = (val: string) => {
    setVisitorPhone(val);
    const cleaned = val.replace(/\D/g, '').slice(-10);
    if (cleaned.length === 10) {
      const match = visitors.find(
        (v) => v.phoneNumber.replace(/\D/g, '').slice(-10) === cleaned
      );
      if (match) {
        if (!visitorName) setVisitorName(match.fullName);
        if (!visitorVehicle && match.vehicleNumber) setVisitorVehicle(match.vehicleNumber);
      }
    }
  };

  // Real-time attention score preview
  const liveEvaluation = useMemo(() => {
    return evaluateVisitorAttention({
      appointmentStatus,
      expectedDurationMinutes: Number(expectedDurationMinutes) || 60,
      purpose,
      remarks,
      visitorHistory: matchedVisitor,
      requestTime: new Date(),
      isHostStudent: selectedHost?.userType === 'STUDENT',
    });
  }, [
    appointmentStatus,
    expectedDurationMinutes,
    purpose,
    remarks,
    matchedVisitor,
    selectedHost,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorPhone.trim() || !hostId) {
      alert('Please fill in visitor name, contact phone number, and intended host.');
      return;
    }

    const created = createNewVisitorRequest({
      visitorName,
      visitorPhone,
      visitorVehicle: visitorVehicle.trim() || undefined,
      hostId,
      purpose,
      purposeOtherText: purpose === 'OTHER' ? purposeOtherText : undefined,
      expectedDurationMinutes: Number(expectedDurationMinutes),
      appointmentStatus,
      remarks: remarks.trim() || undefined,
    });

    setSubmittedRequest(created);
  };

  if (submittedRequest) {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <Send className="h-7 w-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900">Visitor Request Registered Successfully</h3>
        <p className="text-sm text-slate-600">
          Request ID <span className="font-mono font-bold text-indigo-600">{submittedRequest.id}</span> for{' '}
          <strong className="text-slate-900">{submittedRequest.visitorName}</strong> has been transmitted to host{' '}
          <strong className="text-slate-900">{submittedRequest.hostName}</strong> ({submittedRequest.hostDepartment}).
        </p>

        <div className="text-left bg-slate-50 rounded-xl p-4 border border-slate-200">
          <AttentionReasonCard
            score={submittedRequest.attentionScore}
            level={submittedRequest.attentionLevel}
            reasons={submittedRequest.attentionReasons}
          />
        </div>

        <div className="flex items-center justify-center gap-3 pt-3">
          <button
            onClick={() => {
              setSubmittedRequest(null);
              setVisitorName('');
              setVisitorPhone('');
              setVisitorVehicle('');
              setRemarks('');
            }}
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Register Another Visitor
          </button>
          <button
            onClick={() => setActivePage('REQUESTS')}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Go to Visitor Requests Roster
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Gate Entry Registration Terminal</h2>
        <p className="text-xs text-slate-500">
          Fast, keyboard-optimized visitor intake with transparent real-time Attention Engine scoring.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column (7 Cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>Visitor Mobile Number *</span>
              </label>
              <input
                type="tel"
                required
                value={visitorPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="10-digit mobile number"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
              {matchedVisitor && (
                <p className="mt-1 text-[11px] font-medium text-indigo-700 bg-indigo-50 p-1.5 rounded border border-indigo-100">
                  Recognized recurring visitor: {matchedVisitor.totalVisits} previous visits ({matchedVisitor.approvedVisits} approved, {matchedVisitor.rejectedVisits} rejected).
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>Visitor Full Name *</span>
              </label>
              <input
                type="text"
                required
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vehicle Number (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Car className="h-3.5 w-3.5 text-slate-400" />
                <span>Vehicle Plate Number (Optional)</span>
              </label>
              <input
                type="text"
                value={visitorVehicle}
                onChange={(e) => setVisitorVehicle(e.target.value.toUpperCase())}
                placeholder="e.g. MH-12-AB-1234"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono uppercase focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Appointment Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Appointment Status *</span>
              </label>
              <select
                value={appointmentStatus}
                onChange={(e) => setAppointmentStatus(e.target.value as AppointmentStatus)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="WALK_IN">Unscheduled Walk-in (+20 Attention Pts)</option>
                <option value="SCHEDULED">Pre-Scheduled / Prior Appointment</option>
              </select>
            </div>
          </div>

          {/* Host Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-slate-400" />
              <span>Person to Meet (Campus Host) *</span>
            </label>
            <select
              required
              value={hostId}
              onChange={(e) => setHostId(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            >
              {hostUsers.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} — {h.department} ({h.userType === 'STUDENT' ? 'Student Host' : 'Faculty Host'})
                </option>
              ))}
            </select>
            {selectedHost && (
              <p className="mt-1 text-[11px] text-slate-500">
                Department: <span className="font-semibold text-slate-700">{selectedHost.department}</span> • Role: {selectedHost.designation}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Purpose */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Purpose of Visit *
              </label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value as VisitPurpose)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value="ACADEMIC_MEETING">Academic Meeting / Faculty Consultation</option>
                <option value="PARENT_GUARDIAN_VISIT">Parent / Guardian Visit</option>
                <option value="VENDOR_MAINTENANCE">Vendor / Repair / Equipment Maintenance</option>
                <option value="OFFICIAL_DOCUMENTS">Official Documents / Verification</option>
                <option value="GUEST_SPEAKER">Guest Speaker / Seminar Faculty</option>
                <option value="ADMISSION_INQUIRY">Admission Inquiry / Campus Tour</option>
                <option value="CAMPUS_INTERVIEW">Campus Placement / Recruitment</option>
                <option value="OTHER">Other Purpose</option>
              </select>
            </div>

            {/* Expected Duration */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  Expected Stay Duration
                </span>
                <span className="font-bold text-indigo-600">{expectedDurationMinutes} min</span>
              </label>
              <select
                value={expectedDurationMinutes}
                onChange={(e) => setExpectedDurationMinutes(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              >
                <option value={30}>30 Minutes (Quick delivery / inquiry)</option>
                <option value={60}>1 Hour (Standard consultation)</option>
                <option value={90}>1.5 Hours (Meeting / Lab visit)</option>
                <option value={120}>2 Hours (Detailed academic review)</option>
                <option value={180}>3 Hours (Half day)</option>
                <option value={300}>5 Hours (Extended vendor work &gt; 4 hrs)</option>
                <option value={480}>8 Hours (Full day guest)</option>
              </select>
            </div>
          </div>

          {purpose === 'OTHER' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Please specify "Other" purpose details *
              </label>
              <input
                type="text"
                required
                value={purposeOtherText}
                onChange={(e) => setPurposeOtherText(e.target.value)}
                placeholder="Specify exact nature of visit"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          )}

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-slate-400" />
              <span>Gate Guard Remarks / Carrying Material</span>
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Carrying equipment box, documents envelope, or personal luggage."
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs focus:border-indigo-500 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors"
            >
              <Send className="h-4 w-4 text-indigo-400" />
              <span>Submit Request & Notify Host</span>
            </button>
          </div>
        </form>

        {/* Live Attention Scoring & Historical Summary Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Live Attention Engine Preview
              </h3>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                Real-Time Heuristic
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Evaluates current input parameters deterministically against campus administrative safety thresholds:
            </p>

            <AttentionReasonCard
              score={liveEvaluation.score}
              level={liveEvaluation.level}
              reasons={liveEvaluation.reasons}
            />

            {liveEvaluation.level === 'SUPERVISOR_REVIEW' && (
              <div className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-rose-600" />
                <div>
                  <p className="font-bold">Supervisor Review Will Be Required</p>
                  <p className="text-[11px] mt-0.5">
                    Upon submission, this request will automatically route to the Security Supervisor Queue for clearance.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Past History Preview if Recognized */}
          {matchedVisitor && (
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-950">
                <Users className="h-4 w-4 text-indigo-700" />
                <span>Historical Visitor Memory</span>
              </div>
              <p className="text-xs text-slate-700">
                Found prior logs for <strong className="text-slate-900">{matchedVisitor.fullName}</strong>:
              </p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <p className="font-bold text-slate-900">{matchedVisitor.totalVisits}</p>
                  <p className="text-[10px] text-slate-500">Total Visits</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-emerald-200 text-emerald-800">
                  <p className="font-bold">{matchedVisitor.approvedVisits}</p>
                  <p className="text-[10px]">Approved</p>
                </div>
                <div className="bg-white p-2 rounded-lg border border-rose-200 text-rose-800">
                  <p className="font-bold">{matchedVisitor.rejectedVisits}</p>
                  <p className="text-[10px]">Rejected</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
