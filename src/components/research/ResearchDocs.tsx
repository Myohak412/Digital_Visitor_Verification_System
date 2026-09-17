import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  FileCheck,
  GraduationCap,
  HelpCircle,
  Layers,
  Scale,
  Shield,
  Sparkles,
} from 'lucide-react';
import { researchSurveyData } from '../../data/mockData';

export const ResearchDocs: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'OVERVIEW' | 'QUESTIONS' | 'SURVEY' | 'VIVA_QA' | 'LIMITATIONS'>('OVERVIEW');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
              MCA
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              Master of Computer Applications (MCA) Research & Defense Hub
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dissertation title: <em>“Smart Visitor Risk and Approval Management System for College Campus Security”</em>
          </p>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            onClick={() => setActiveSection('OVERVIEW')}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeSection === 'OVERVIEW'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Core Concept
          </button>
          <button
            onClick={() => setActiveSection('QUESTIONS')}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeSection === 'QUESTIONS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Research Questions
          </button>
          <button
            onClick={() => setActiveSection('SURVEY')}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeSection === 'SURVEY'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Survey Findings (N=50)
          </button>
          <button
            onClick={() => setActiveSection('VIVA_QA')}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeSection === 'VIVA_QA'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Viva Q&A Defense
          </button>
          <button
            onClick={() => setActiveSection('LIMITATIONS')}
            className={`rounded-lg px-3 py-1.5 transition-all ${
              activeSection === 'LIMITATIONS'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Limitations
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW */}
      {activeSection === 'OVERVIEW' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
              <span>Project Abstract & Academic Motivation</span>
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              Traditional college visitor management relies either on manual paper registers—which provide no real-time auditability, zero host confirmation, and zero dwell tracking—or on high-cost biometric and automated surveillance systems that introduce high capital expenditure, maintenance failures, and severe privacy violations.
            </p>
            <p className="text-xs text-slate-700 leading-relaxed">
              This research introduces a <strong>low-cost, explainable, browser-based digital visitor verification and decision-support prototype</strong> designed specifically for college campus dynamics. The system employs a <em>rule-based deterministic Attention Engine</em> that calculates transparent attention scores without black-box machine learning, paired with a tripartite asynchronous workflow (Security Guard, Campus Host, and Security Supervisor).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="font-bold text-slate-900 text-xs block mb-1">Zero Hardware Overhead</span>
                <p className="text-[11px] text-slate-600">
                  Runs purely in responsive web browsers across gate smartphones, student laptops, and guard tablets. No expensive turnstiles or proprietary scanners required.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="font-bold text-slate-900 text-xs block mb-1">Explainable Triage</span>
                <p className="text-[11px] text-slate-600">
                  Avoids opaque ML models. Every attention point is strictly attributed to plain-English, auditable campus security rules (e.g. walk-ins, past rejections, long durations).
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <span className="font-bold text-slate-900 text-xs block mb-1">Host-Verified Clearance</span>
                <p className="text-[11px] text-slate-600">
                  Visitors cannot enter simply by claiming an appointment; the faculty or student host must confirm via mobile before the gate guard records physical entry.
                </p>
              </div>
            </div>
          </div>

          {/* Rule-Based vs Machine Learning Comparison */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="h-5 w-5 text-indigo-600" />
              <span>Why Rule-Based Heuristic Over Machine Learning? (Key Viva Defense)</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-700">
                  <tr>
                    <th className="p-3">Evaluation Criteria</th>
                    <th className="p-3 text-emerald-800 bg-emerald-50/50">Our System (Rule-Based Attention Engine)</th>
                    <th className="p-3 text-rose-800 bg-rose-50/50">Complex Machine Learning / Neural Net</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Explainability / Auditability</td>
                    <td className="p-3 bg-emerald-50/20 text-emerald-950 font-medium">
                      100% Deterministic: Exact rule, points weight, and reason displayed to guard and supervisor.
                    </td>
                    <td className="p-3 bg-rose-50/20 text-rose-950">
                      Black box probabilities. Guard cannot explain to an agitated visitor why entry was flagged.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Training Data Requirements</td>
                    <td className="p-3 bg-emerald-50/20 text-emerald-950 font-medium">
                      Zero training data required. Works out-of-the-box from Day 1 on any college campus.
                    </td>
                    <td className="p-3 bg-rose-50/20 text-rose-950">
                      Requires thousands of historical security incident logs, which colleges simply do not possess.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Bias & Algorithmic Fairness</td>
                    <td className="p-3 bg-emerald-50/20 text-emerald-950 font-medium">
                      Guaranteed neutral: Evaluates strictly objective parameters (time, appointment, duration, host confirmation).
                    </td>
                    <td className="p-3 bg-rose-50/20 text-rose-950">
                      High risk of demographic, socio-economic, or dress bias learned from subjective human incident records.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Computation & Hosting Cost</td>
                    <td className="p-3 bg-emerald-50/20 text-emerald-950 font-medium">
                      Near-zero cost: Pure lightweight logic running in client browsers and standard PostgreSQL.
                    </td>
                    <td className="p-3 bg-rose-50/20 text-rose-950">
                      Requires GPU inference servers, ongoing data labeling, model drift monitoring, and high cloud bills.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. RESEARCH QUESTIONS */}
      {activeSection === 'QUESTIONS' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">Formal Research Questions & Methodology Alignment</h3>
            <p className="text-xs text-slate-600">
              The project investigates four foundational research questions designed for practical institutional evaluation:
            </p>

            <div className="space-y-3">
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-indigo-600 text-white px-2 py-0.5 rounded">RQ1</span>
                  <h4 className="text-xs font-bold text-indigo-950">
                    Feasibility of Low-Cost Digital Verification
                  </h4>
                </div>
                <p className="text-xs text-slate-700">
                  <em>“Can a browser-based, hardware-free digital visitor verification system reliably replace manual paper registers in collegiate environments without increasing gate processing latency?”</em>
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  <strong>Verification Metric:</strong> Gate entry registration benchmarked under 45 seconds; host approval confirmation latency recorded in real time.
                </p>
              </div>

              <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">RQ2</span>
                  <h4 className="text-xs font-bold text-emerald-950">
                    Host Asynchronous Confirmation Efficacy
                  </h4>
                </div>
                <p className="text-xs text-slate-700">
                  <em>“Does shifting initial visitor authorization to the intended host (faculty or student) prevent unauthorized walk-ins compared to security guard discretion?”</em>
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  <strong>Verification Metric:</strong> Tracking host rejection rates, clarification requests, and unauthorized entry attempts prevented at gate level.
                </p>
              </div>

              <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-amber-600 text-white px-2 py-0.5 rounded">RQ3</span>
                  <h4 className="text-xs font-bold text-amber-950">
                    Explainability & Acceptance of Attention Scoring
                  </h4>
                </div>
                <p className="text-xs text-slate-700">
                  <em>“How does transparent, rule-based attention scoring influence stakeholder trust and supervisory intervention rates relative to black-box systems?”</em>
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  <strong>Verification Metric:</strong> 92% survey agreement that explicit rule breakdown promotes trust; audit trail analysis of supervisor overrides.
                </p>
              </div>

              <div className="rounded-xl border border-purple-200 bg-purple-50/30 p-4 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold bg-purple-600 text-white px-2 py-0.5 rounded">RQ4</span>
                  <h4 className="text-xs font-bold text-purple-950">
                    Campus Temporal Patterns & Dwell Tracking
                  </h4>
                </div>
                <p className="text-xs text-slate-700">
                  <em>“What actionable security insights emerge from continuous dwell-time monitoring and hourly arrival trends in a higher-education institution?”</em>
                </p>
                <p className="text-[11px] text-slate-500 pt-1">
                  <strong>Verification Metric:</strong> Automated identification of overstays, peak arrival curves (11:00 AM & 3:00 PM), and recurring visitor clustering.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. SURVEY FINDINGS */}
      {activeSection === 'SURVEY' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Pre-Implementation Field Survey Analysis</h3>
                <p className="text-xs text-slate-500">
                  Survey sample size: <strong>N = {researchSurveyData.sampleSize}</strong> respondents across campus stakeholders.
                </p>
              </div>
              <span className="font-mono text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1 rounded-lg">
                Confidence Level: 90%
              </span>
            </div>

            {/* Breakdown of respondents */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs text-slate-500">Students</span>
                <p className="text-lg font-bold text-slate-900">{researchSurveyData.respondentsBreakdown.students}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs text-slate-500">Faculty Members</span>
                <p className="text-lg font-bold text-slate-900">{researchSurveyData.respondentsBreakdown.faculty}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs text-slate-500">Security Personnel</span>
                <p className="text-lg font-bold text-slate-900">{researchSurveyData.respondentsBreakdown.securityPersonnel}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <span className="text-xs text-slate-500">Admin Staff</span>
                <p className="text-lg font-bold text-slate-900">{researchSurveyData.respondentsBreakdown.administrators}</p>
              </div>
            </div>

            {/* Survey Key Findings */}
            <div className="space-y-3 pt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Quantitative Results</h4>
              
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">Prior experience with institutional visitor systems</span>
                    <span className="font-bold text-slate-900">{researchSurveyData.keyFindings.hasPriorInstitutionalExperience}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${researchSurveyData.keyFindings.hasPriorInstitutionalExperience}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">Expressed support for replacing paper registers with digital workflow</span>
                    <span className="font-bold text-slate-900">{researchSurveyData.keyFindings.supportDigitalSystem}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${researchSurveyData.keyFindings.supportDigitalSystem}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">Expressed concerns regarding potential gate registration delays</span>
                    <span className="font-bold text-slate-900">{researchSurveyData.keyFindings.concernedAboutGateDelay}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${researchSurveyData.keyFindings.concernedAboutGateDelay}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Directly addressed by keyboard-optimized quick-entry forms taking under 45 seconds.
                  </p>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-slate-700">Agree that transparency of attention reason is critical for trust</span>
                    <span className="font-bold text-slate-900">{researchSurveyData.keyFindings.demandExplainableDecisions}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: `${researchSurveyData.keyFindings.demandExplainableDecisions}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. VIVA Q&A DEFENSE */}
      {activeSection === 'VIVA_QA' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="h-5 w-5 text-indigo-600" />
              <span>Examiner Viva Defense: Anticipated Questions & Model Answers</span>
            </h3>

            <div className="space-y-4 text-xs">
              {/* Q1 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <p className="font-bold text-slate-900 text-sm">
                  Q1: “Why did you not implement AI/Machine Learning models for visitor risk classification?”
                </p>
                <div className="text-slate-700 leading-relaxed space-y-1">
                  <p>
                    <strong>Model Viva Answer:</strong> “Colleges do not have vast, labeled historical security datasets to train neural networks or ML classifiers without introducing massive sampling bias or hallucinated predictions. In security decision support, an unexplainable probabilistic score (e.g. 78% risk) is dangerous because the guard cannot explain the reason to the visitor. Our rule-based Attention Engine is 100% explainable, mathematically transparent, auditable, requires zero compute overhead, and aligns with academic explainability standards.”
                  </p>
                </div>
              </div>

              {/* Q2 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <p className="font-bold text-slate-900 text-sm">
                  Q2: “Why did you reject Aadhaar verification and Biometric scanning?”
                </p>
                <div className="text-slate-700 leading-relaxed space-y-1">
                  <p>
                    <strong>Model Viva Answer:</strong> “Under India's Supreme Court Justice K.S. Puttaswamy judgment and standard institutional privacy frameworks, Aadhaar numbers and biometrics cannot be casually demanded by private or non-governmental entities for routine gate entry. Demanding biometric data creates significant data liability, security leakage risks, and equipment cost. Our system enforces the <em>Data Minimization Principle</em>—verifying visitors through mobile phone confirmation and host authorization rather than sensitive identity hoarding.”
                  </p>
                </div>
              </div>

              {/* Q3 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <p className="font-bold text-slate-900 text-sm">
                  Q3: “How does the system prevent gate bottlenecks if a faculty host does not respond immediately?”
                </p>
                <div className="text-slate-700 leading-relaxed space-y-1">
                  <p>
                    <strong>Model Viva Answer:</strong> “The system incorporates a 2-tier fallback: First, pre-scheduled appointments bypass waiting queues. Second, for walk-in visits where a faculty host is teaching, the Security Guard can escalate to the Security Supervisor Queue, who can override or clear the visitor based on phone verification or alternative contact, logging the supervisor note in the permanent audit trail.”
                  </p>
                </div>
              </div>

              {/* Q4 */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
                <p className="font-bold text-slate-900 text-sm">
                  Q4: “What is the difference between a paper-register-to-digital-form conversion and your research system?”
                </p>
                <div className="text-slate-700 leading-relaxed space-y-1">
                  <p>
                    <strong>Model Viva Answer:</strong> “A simple digital register merely converts paper columns into a database table. Our system introduces active decision support: asynchronous host approval loops, longitudinal memory that automatically identifies recurring visitors and past rejections, real-time campus dwell-time tracking with overstay warnings, and a rule-based attention scoring triage that actively assists guards and supervisors in prioritizing scrutiny.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. LIMITATIONS */}
      {activeSection === 'LIMITATIONS' && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span>Explicit Research Limitations (Academic Honesty Requirement)</span>
            </h3>
            <p className="text-xs text-slate-600">
              For an MCA viva, explicitly acknowledging methodology limitations demonstrates high academic rigor and prevents examiners from penalizing scope:
            </p>

            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <span className="font-bold text-slate-900 block mb-1">1. Non-Predictive Heuristic Nature</span>
                <p className="text-slate-600">
                  The Attention Engine is deterministic and non-predictive. It evaluates risk parameters defined by administrative policy; it does not claim to predict criminal or malicious intent.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <span className="font-bold text-slate-900 block mb-1">2. Sample Size Scope (N=50)</span>
                <p className="text-slate-600">
                  The initial feasibility survey was conducted across 50 collegiate respondents. While statistically informative for prototype requirements, broader generalized campus adoption requires multi-semester longitudinal data across varied campus layouts.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <span className="font-bold text-slate-900 block mb-1">3. Dependence on Host Connectivity</span>
                <p className="text-slate-600">
                  The asynchronous host verification loop assumes campus Wi-Fi or cellular network availability for faculty/students to receive arrival notifications.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <span className="font-bold text-slate-900 block mb-1">4. Perimeter Gate Boundary Constraint</span>
                <p className="text-slate-600">
                  The system tracks campus presence between gate check-in and gate check-out. It does not perform indoor real-time physical positioning inside classrooms or departmental hallways.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
