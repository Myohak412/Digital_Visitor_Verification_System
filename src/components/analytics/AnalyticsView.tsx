import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  PieChart as PieIcon,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AnalyticsView: React.FC = () => {
  const { requests } = useApp();

  // 1. Purpose Distribution
  const purposeMap: { [key: string]: number } = {};
  requests.forEach((r) => {
    const p = r.purpose.replace(/_/g, ' ');
    purposeMap[p] = (purposeMap[p] || 0) + 1;
  });
  const purposeData = Object.entries(purposeMap).map(([name, count]) => ({
    name,
    count,
  }));

  // 2. Attention Level Distribution
  const attentionMap: { [key: string]: number } = {
    NORMAL: 0,
    ATTENTION_REQUIRED: 0,
    SUPERVISOR_REVIEW: 0,
  };
  requests.forEach((r) => {
    attentionMap[r.attentionLevel] = (attentionMap[r.attentionLevel] || 0) + 1;
  });
  const attentionData = [
    { name: 'Normal (Green)', value: attentionMap.NORMAL, color: '#10b981' },
    { name: 'Attention Required (Yellow)', value: attentionMap.ATTENTION_REQUIRED, color: '#f59e0b' },
    { name: 'Supervisor Review (Red)', value: attentionMap.SUPERVISOR_REVIEW, color: '#f43f5e' },
  ];

  // 3. Hourly Activity Curve (Simulated realistic 24-hr distribution)
  const hourlyData = [
    { hour: '08:00', visitors: 2 },
    { hour: '09:00', visitors: 8 },
    { hour: '10:00', visitors: 14 },
    { hour: '11:00', visitors: 18 }, // Peak 1
    { hour: '12:00', visitors: 9 },
    { hour: '13:00', visitors: 5 },
    { hour: '14:00', visitors: 12 },
    { hour: '15:00', visitors: 16 }, // Peak 2
    { hour: '16:00', visitors: 10 },
    { hour: '17:00', visitors: 6 },
    { hour: '18:00', visitors: 2 },
  ];

  // 4. Host Approval Ratios
  const approvedCount = requests.filter((r) => r.hostApprovalStatus === 'APPROVED').length;
  const rejectedCount = requests.filter((r) => r.hostApprovalStatus === 'REJECTED').length;
  const infoReqCount = requests.filter((r) => r.hostApprovalStatus === 'INFO_REQUESTED').length;
  const pendingCount = requests.filter((r) => r.hostApprovalStatus === 'PENDING').length;

  const approvalComparisonData = [
    { status: 'Approved', count: approvedCount, fill: '#10b981' },
    { status: 'Rejected', count: rejectedCount, fill: '#f43f5e' },
    { status: 'Info Requested', count: infoReqCount, fill: '#3b82f6' },
    { status: 'Pending', count: pendingCount, fill: '#f59e0b' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900">Security Analytics & Research Trends</h2>
        <p className="text-xs text-slate-500">
          Data visualization supporting Research Questions RQ1, RQ3, and RQ4 (Hourly peak volume, purpose patterns, and attention spread).
        </p>
      </div>

      {/* Key Research Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Total Recorded Visits</span>
          <p className="mt-1 text-2xl font-bold text-slate-900">{requests.length}</p>
          <span className="text-[11px] text-emerald-700 font-medium">100% digital auditability</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Host Approval Rate</span>
          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {requests.length > 0 ? Math.round((approvedCount / requests.length) * 100) : 0}%
          </p>
          <span className="text-[11px] text-slate-500">{approvedCount} of {requests.length} authorized</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Peak Gate Hour</span>
          <p className="mt-1 text-2xl font-bold text-indigo-600">11:00 AM</p>
          <span className="text-[11px] text-slate-500">Academic & document inquiries</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Flagged for Review</span>
          <p className="mt-1 text-2xl font-bold text-amber-600">
            {attentionMap.ATTENTION_REQUIRED + attentionMap.SUPERVISOR_REVIEW}
          </p>
          <span className="text-[11px] text-slate-500">
            {Math.round(
              ((attentionMap.ATTENTION_REQUIRED + attentionMap.SUPERVISOR_REVIEW) /
                Math.max(1, requests.length)) *
                100
            )}
            % required triage
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Hourly Gate Activity Curve */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                Hourly Campus Inflow Curve
              </h3>
              <p className="text-[11px] text-slate-500">Identifies peak security staffing requirements at main gates.</p>
            </div>
            <span className="text-[11px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-100 font-bold">
              RQ4
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    color: '#fff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4f46e5' }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Attention Level Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <PieIcon className="h-4 w-4 text-emerald-600" />
                Attention-Level Tier Distribution
              </h3>
              <p className="text-[11px] text-slate-500">Validates explainable scoring rule separation.</p>
            </div>
            <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-100 font-bold">
              RQ3
            </span>
          </div>
          <div className="h-64 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attentionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {attentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Visit Purpose Breakdown */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                Visitors by Stated Purpose
              </h3>
              <p className="text-[11px] text-slate-500">Distribution of campus visitor reasons.</p>
            </div>
            <span className="text-[11px] font-mono bg-purple-50 text-purple-700 px-2 py-0.5 rounded border border-purple-100 font-bold">
              RQ4
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={purposeData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="name" type="category" width={110} stroke="#64748b" fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Host Approval vs Rejection */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Host Decision Outcomes
              </h3>
              <p className="text-[11px] text-slate-500">Evaluates host participation and gate denial effectiveness.</p>
            </div>
            <span className="text-[11px] font-mono bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-bold">
              RQ2
            </span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={approvalComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="status" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]}>
                  {approvalComparisonData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
