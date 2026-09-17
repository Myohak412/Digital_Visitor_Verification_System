/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { SecurityDashboard } from './components/dashboard/SecurityDashboard';
import { NewVisitorEntry } from './components/entry/NewVisitorEntry';
import { CurrentVisitors } from './components/active/CurrentVisitors';
import { VisitorRequestsList } from './components/requests/VisitorRequestsList';
import { PendingApprovals } from './components/approvals/PendingApprovals';
import { AttentionQueue } from './components/attention/AttentionQueue';
import { VisitorHistory } from './components/history/VisitorHistory';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { PrivacySettings } from './components/privacy/PrivacySettings';
import { ProfileView } from './components/profile/ProfileView';
import { ResearchDocs } from './components/research/ResearchDocs';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'DASHBOARD':
        return <SecurityDashboard />;
      case 'NEW_ENTRY':
        return <NewVisitorEntry />;
      case 'ACTIVE_VISITORS':
        return <CurrentVisitors />;
      case 'REQUESTS':
        return <VisitorRequestsList />;
      case 'PENDING_APPROVALS':
        return <PendingApprovals />;
      case 'ATTENTION_QUEUE':
        return <AttentionQueue />;
      case 'HISTORY':
        return <VisitorHistory />;
      case 'ANALYTICS':
        return <AnalyticsView />;
      case 'NOTIFICATIONS':
        return <NotificationsView />;
      case 'PRIVACY':
        return <PrivacySettings />;
      case 'PROFILE':
        return <ProfileView />;
      case 'RESEARCH':
        return <ResearchDocs />;
      default:
        return <SecurityDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Universal Navbar */}
      <Navbar />

      {/* Main Structural Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        {/* Left Navigation Sidebar */}
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20">
            <Sidebar />
          </div>
        </div>

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0">
          {renderCurrentPage()}
        </main>
      </div>

      {/* Footer / Academic Attribution */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>
            MCA Research Prototype • <strong>Digital Visitor Verification System</strong> for College Campus Security
          </p>
          <p className="text-[11px] text-slate-400">
            Explainable Attention Engine • Privacy-by-Design • Zero Proprietary Hardware
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
