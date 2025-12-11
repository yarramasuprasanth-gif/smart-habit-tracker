import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Bell, Settings, Shield, Download, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { api } from '../utils/api';
import { toast } from 'sonner@2.0.3';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  activeSettingType: 'notifications' | 'preferences' | 'privacy';
  accessToken: string;
}

interface UserSettings {
  notifications: {
    dailyReminders: boolean;
    streakAlerts: boolean;
    weeklyReports: boolean;
    friendActivity: boolean;
  };
  preferences: {
    theme: 'light' | 'dark';
    reminderTime: string;
    startOfWeek: 'sunday' | 'monday';
  };
  privacy: {
    profileVisibility: 'public' | 'friends' | 'private';
    showStreak: boolean;
    showActivity: boolean;
  };
}

export function SettingsDialog({ open, onClose, activeSettingType, accessToken }: SettingsDialogProps) {
  const [activeSection, setActiveSection] = useState<'notifications' | 'preferences' | 'privacy'>(activeSettingType);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (open) {
      setActiveSection(activeSettingType);
      loadSettings();
    }
  }, [open, activeSettingType]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await api.getSettings(accessToken);
      setSettings(data.settings);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!settings) return;

    try {
      setSaving(true);
      const updatedSettings = { ...settings, ...updates };
      await api.updateSettings(accessToken, updatedSettings);
      setSettings(updatedSettings);
      toast.success('Settings saved');
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      setSaving(true);
      await api.changePassword(accessToken, newPassword);
      toast.success('Password changed successfully');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Failed to change password:', error);
      toast.error('Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await api.exportData(accessToken);
      const blob = new Blob([JSON.stringify(data.data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `habit-tracker-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Data exported successfully');
    } catch (error) {
      console.error('Failed to export data:', error);
      toast.error('Failed to export data');
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveSection('notifications')}
            className={`flex-1 px-4 py-3 text-sm transition-colors ${
              activeSection === 'notifications'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bell className="w-4 h-4 mx-auto mb-1" />
            Notifications
          </button>
          <button
            onClick={() => setActiveSection('preferences')}
            className={`flex-1 px-4 py-3 text-sm transition-colors ${
              activeSection === 'preferences'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4 mx-auto mb-1" />
            Preferences
          </button>
          <button
            onClick={() => setActiveSection('privacy')}
            className={`flex-1 px-4 py-3 text-sm transition-colors ${
              activeSection === 'privacy'
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Shield className="w-4 h-4 mx-auto mb-1" />
            Privacy
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading settings...</div>
          ) : settings ? (
            <>
              {activeSection === 'notifications' && (
                <NotificationsSection
                  settings={settings.notifications}
                  onUpdate={(notifications) => updateSettings({ notifications })}
                  saving={saving}
                />
              )}

              {activeSection === 'preferences' && (
                <PreferencesSection
                  settings={settings.preferences}
                  onUpdate={(preferences) => updateSettings({ preferences })}
                  saving={saving}
                />
              )}

              {activeSection === 'privacy' && (
                <PrivacySection
                  settings={settings.privacy}
                  onUpdate={(privacy) => updateSettings({ privacy })}
                  newPassword={newPassword}
                  confirmPassword={confirmPassword}
                  showPassword={showPassword}
                  onPasswordChange={setNewPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                  onToggleShowPassword={() => setShowPassword(!showPassword)}
                  onChangePassword={handleChangePassword}
                  onExportData={handleExportData}
                  saving={saving}
                />
              )}
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

interface NotificationsSectionProps {
  settings: UserSettings['notifications'];
  onUpdate: (settings: UserSettings['notifications']) => void;
  saving: boolean;
}

function NotificationsSection({ settings, onUpdate, saving }: NotificationsSectionProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Manage how you receive notifications and reminders.
      </p>

      <ToggleItem
        label="Daily Reminders"
        description="Get reminded to complete your habits"
        checked={settings.dailyReminders}
        onChange={(checked) => onUpdate({ ...settings, dailyReminders: checked })}
        disabled={saving}
      />

      <ToggleItem
        label="Streak Alerts"
        description="Notifications when you reach milestones"
        checked={settings.streakAlerts}
        onChange={(checked) => onUpdate({ ...settings, streakAlerts: checked })}
        disabled={saving}
      />

      <ToggleItem
        label="Weekly Reports"
        description="Summary of your progress each week"
        checked={settings.weeklyReports}
        onChange={(checked) => onUpdate({ ...settings, weeklyReports: checked })}
        disabled={saving}
      />

      <ToggleItem
        label="Friend Activity"
        description="Updates when friends complete habits"
        checked={settings.friendActivity}
        onChange={(checked) => onUpdate({ ...settings, friendActivity: checked })}
        disabled={saving}
      />
    </div>
  );
}

interface PreferencesSectionProps {
  settings: UserSettings['preferences'];
  onUpdate: (settings: UserSettings['preferences']) => void;
  saving: boolean;
}

function PreferencesSection({ settings, onUpdate, saving }: PreferencesSectionProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Customize your app experience.
      </p>

      <div className="space-y-2">
        <label className="text-sm text-gray-900">Theme</label>
        <select
          value={settings.theme}
          onChange={(e) => onUpdate({ ...settings, theme: e.target.value as 'light' | 'dark' })}
          disabled={saving}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-900">Daily Reminder Time</label>
        <input
          type="time"
          value={settings.reminderTime}
          onChange={(e) => onUpdate({ ...settings, reminderTime: e.target.value })}
          disabled={saving}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm text-gray-900">Start of Week</label>
        <select
          value={settings.startOfWeek}
          onChange={(e) => onUpdate({ ...settings, startOfWeek: e.target.value as 'sunday' | 'monday' })}
          disabled={saving}
          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="sunday">Sunday</option>
          <option value="monday">Monday</option>
        </select>
      </div>
    </div>
  );
}

interface PrivacySectionProps {
  settings: UserSettings['privacy'];
  onUpdate: (settings: UserSettings['privacy']) => void;
  newPassword: string;
  confirmPassword: string;
  showPassword: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onToggleShowPassword: () => void;
  onChangePassword: () => void;
  onExportData: () => void;
  saving: boolean;
}

function PrivacySection({
  settings,
  onUpdate,
  newPassword,
  confirmPassword,
  showPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onToggleShowPassword,
  onChangePassword,
  onExportData,
  saving,
}: PrivacySectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-gray-900 mb-4">Security</p>
        
        <div className="space-y-3">
          <div className="relative">
            <label className="text-sm text-gray-600">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-3 py-2 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={onToggleShowPassword}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Confirm Password</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={onChangePassword}
            disabled={saving || !newPassword || !confirmPassword}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" />
            Change Password
          </button>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-900 mb-4">Privacy</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-gray-900">Profile Visibility</label>
            <select
              value={settings.profileVisibility}
              onChange={(e) => onUpdate({ ...settings, profileVisibility: e.target.value as any })}
              disabled={saving}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>

          <ToggleItem
            label="Show Streak"
            description="Display your streak on your profile"
            checked={settings.showStreak}
            onChange={(checked) => onUpdate({ ...settings, showStreak: checked })}
            disabled={saving}
          />

          <ToggleItem
            label="Show Activity"
            description="Let friends see your recent activity"
            checked={settings.showActivity}
            onChange={(checked) => onUpdate({ ...settings, showActivity: checked })}
            disabled={saving}
          />
        </div>
      </div>

      <div className="border-t border-gray-100 pt-4">
        <p className="text-sm text-gray-900 mb-4">Data Management</p>
        
        <button
          onClick={onExportData}
          className="w-full px-4 py-2 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export My Data
        </button>
      </div>
    </div>
  );
}

interface ToggleItemProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

function ToggleItem({ label, description, checked, onChange, disabled }: ToggleItemProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex-1">
        <p className="text-sm text-gray-900">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-purple-600' : 'bg-gray-300'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <motion.div
          animate={{ x: checked ? 20 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full"
        />
      </button>
    </div>
  );
}