import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ChatbotPage from './pages/ChatbotPage';
import GraphExplorerPage from './pages/GraphExplorerPage';
import SearchPage from './pages/SearchPage';
import DocumentsPage from './pages/DocumentsPage';
import KnowledgeSourcesPage from './pages/KnowledgeSourcesPage';
import QueryHistoryPage from './pages/QueryHistoryPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';

export default function App() {
  return (
    <Routes>
      {/* Public Authentication Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Main Persistent Layout for Authenticated Pages */}
      <Route element={<AppLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Navigate to="/" replace />} />
        <Route path="chatbot" element={<ChatbotPage />} />
        <Route path="graph" element={<GraphExplorerPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="sources" element={<KnowledgeSourcesPage />} />
        <Route path="history" element={<QueryHistoryPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="help" element={<HelpPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
