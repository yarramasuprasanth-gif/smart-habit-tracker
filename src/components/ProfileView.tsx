import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Calendar, Settings, Bell, Shield, LogOut, Edit2, Check } from 'lucide-react';
import type { UserProfile, Habit } from '../App';
import { SettingsDialog } from './SettingsDialog';
import { PWAStatus } from './PWAStatus';
import { ShareAppLink } from './ShareAppLink';

interface ProfileViewProps {
  user: UserProfile;
  habits: Habit[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onLogout: () => void;
  accessToken: string;
}

export function ProfileView({ user, habits, onUpdateProfile, onLogout, accessToken }: ProfileViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user.name);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeSettingType, setActiveSettingType] = useState<'notifications' | 'preferences' | 'privacy'>('notifications');

  const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);
  const daysActive = Math.floor(
    (new Date().getTime() - new Date(user.joinedDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleSaveName = () => {
    if (editedName.trim()) {
      onUpdateProfile({ name: editedName.trim() });
      setIsEditingName(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* PWA Status Banner */}
      <PWAStatus />

      {/* Share App Link */}
      <ShareAppLink />

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-4xl">
            {user.avatar || '👤'}
          </div>
          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="px-3 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Check className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2>{user.name}</h2>
                <button
                  onClick={() => setIsEditingName(true)}
                  className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-white/80">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm text-center">
            <p className="text-2xl mb-1">{totalCompletions}</p>
            <p className="text-sm text-white/80">Total</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm text-center">
            <p className="text-2xl mb-1">{longestStreak}</p>
            <p className="text-sm text-white/80">Streak</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm text-center">
            <p className="text-2xl mb-1">{daysActive}</p>
            <p className="text-sm text-white/80">Days</p>
          </div>
        </div>
      </motion.div>

      {/* Account Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Account</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <SettingItem
            icon={<User className="w-5 h-5" />}
            label="Personal Information"
            value={user.name}
          />
          <SettingItem
            icon={<Mail className="w-5 h-5" />}
            label="Email"
            value={user.email}
          />
          <SettingItem
            icon={<Calendar className="w-5 h-5" />}
            label="Joined"
            value={new Date(user.joinedDate).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          />
        </div>
      </motion.div>

      {/* Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-sm overflow-hidden"
      >
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Settings</h3>
        </div>
        <div className="divide-y divide-gray-100">
          <SettingButton
            icon={<Bell className="w-5 h-5" />}
            label="Notifications"
            onClick={() => {
              setSettingsOpen(true);
              setActiveSettingType('notifications');
            }}
          />
          <SettingButton
            icon={<Settings className="w-5 h-5" />}
            label="Preferences"
            onClick={() => {
              setSettingsOpen(true);
              setActiveSettingType('preferences');
            }}
          />
          <SettingButton
            icon={<Shield className="w-5 h-5" />}
            label="Privacy & Security"
            onClick={() => {
              setSettingsOpen(true);
              setActiveSettingType('privacy');
            }}
          />
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl shadow-sm p-5"
      >
        <h3 className="text-gray-900 mb-4">Achievements</h3>
        <div className="grid grid-cols-3 gap-3">
          <AchievementBadge
            emoji="🔥"
            label="7-Day Streak"
            unlocked={longestStreak >= 7}
          />
          <AchievementBadge
            emoji="⭐"
            label="30 Habits"
            unlocked={totalCompletions >= 30}
          />
          <AchievementBadge
            emoji="🏆"
            label="100 Total"
            unlocked={totalCompletions >= 100}
          />
          <AchievementBadge
            emoji="💪"
            label="Consistent"
            unlocked={longestStreak >= 14}
          />
          <AchievementBadge
            emoji="🎯"
            label="Focused"
            unlocked={habits.length >= 4}
          />
          <AchievementBadge
            emoji="🚀"
            label="Champion"
            unlocked={longestStreak >= 30}
          />
        </div>
      </motion.div>

      {/* Logout Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={onLogout}
        className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center justify-center gap-2 text-red-600 hover:bg-red-50 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        <span>Log Out</span>
      </motion.button>

      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        activeSettingType={activeSettingType}
        accessToken={accessToken}
      />
    </div>
  );
}

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function SettingItem({ icon, label, value }: SettingItemProps) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="text-gray-400">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-gray-900">{value}</p>
      </div>
    </div>
  );
}

interface SettingButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

function SettingButton({ icon, label, onClick }: SettingButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="text-gray-400">{icon}</div>
      <div className="flex-1 text-left">
        <p className="text-gray-900">{label}</p>
      </div>
      <div className="text-gray-400">
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}

interface AchievementBadgeProps {
  emoji: string;
  label: string;
  unlocked: boolean;
}

function AchievementBadge({ emoji, label, unlocked }: AchievementBadgeProps) {
  return (
    <div className={`text-center p-3 rounded-xl transition-all ${
      unlocked 
        ? 'bg-gradient-to-br from-purple-100 to-pink-100' 
        : 'bg-gray-100 opacity-50'
    }`}>
      <div className={`text-3xl mb-1 ${unlocked ? '' : 'grayscale'}`}>
        {emoji}
      </div>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  );
}