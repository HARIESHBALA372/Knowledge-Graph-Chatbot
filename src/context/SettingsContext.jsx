import React, { createContext, useContext, useState, useEffect } from 'react';

const DEFAULT_SETTINGS = {
  // General
  language: 'en',
  timezone: 'Asia/Kolkata (IST)',
  // Chatbot
  responseLength: 'balanced', // concise, balanced, detailed
  showSources: true,
  showGraph: true,
  enableSuggestions: true,
  // Knowledge Graph
  autoExpandRelationships: true,
  defaultGraphDepth: 2,
  showEntityLabels: true,
  defaultGraphLayout: 'cose', // cose, breadthfirst, circle, concentric, grid
  // Notifications
  emailNotifications: true,
  systemNotifications: true,
  // Privacy & Telemetry
  saveChatHistory: true,
  queryLogging: true,
};

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('kg_settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('kg_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('kg_settings');
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
