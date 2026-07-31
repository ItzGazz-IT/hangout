import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';

const SETTINGS_KEY = 'hangout_settings';
const DEFAULTS = { darkMode: false, pushNotifications: true, locationAccess: true };

function loadSettings() {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}') }; }
  catch { return DEFAULTS; }
}

function Row({ label, settingKey, settings, onChange }: { label: string; settingKey: string; settings: Record<string, boolean>; onChange: (k: string, v: boolean) => void }) {
  const on = settings[settingKey] ?? true;
  return (
    <div className="flex items-center justify-between px-4 py-3.5 border-b border-app-border last:border-b-0">
      <span className="text-text-primary font-semibold text-sm">{label}</span>
      <button
        onClick={() => onChange(settingKey, !on)}
        className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-primary' : 'bg-muted'}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>(loadSettings);

  const handleChange = (key: string, value: boolean) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  };

  return (
    <div>
      <PageHeader title="Settings" />
      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="bg-card border border-app-border rounded-2xl overflow-hidden">
          <Row label="Dark mode" settingKey="darkMode" settings={settings} onChange={handleChange} />
          <Row label="Push notifications" settingKey="pushNotifications" settings={settings} onChange={handleChange} />
          <Row label="Location access" settingKey="locationAccess" settings={settings} onChange={handleChange} />
        </div>

        <div className="bg-card border border-app-border rounded-2xl overflow-hidden">
          <a
            href="https://hangout.co.za/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full text-left px-4 py-3.5 border-b border-app-border text-sm font-semibold hover:bg-surface/50 transition-colors text-text-primary"
          >
            Privacy Policy
          </a>
          <a
            href="https://hangout.co.za/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full text-left px-4 py-3.5 border-b border-app-border text-sm font-semibold hover:bg-surface/50 transition-colors text-text-primary"
          >
            Terms of Service
          </a>
          <button
            className="w-full text-left px-4 py-3.5 text-sm font-semibold hover:bg-red-50 transition-colors text-red-500"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
                alert('Please contact support@hangout.co.za to request account deletion.');
              }
            }}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
