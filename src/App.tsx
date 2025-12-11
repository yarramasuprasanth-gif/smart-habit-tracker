import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { HabitCard } from './components/HabitCard';
import { AICoachChat } from './components/AICoachChat';
import { InsightCard } from './components/InsightCard';
import { SocialView } from './components/SocialView';
import { StatsView } from './components/StatsView';
import { ProfileView } from './components/ProfileView';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { Home, Brain, TrendingUp, Users, User } from 'lucide-react';
import { api } from './utils/api';
import { Toaster } from './components/ui/sonner';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completedToday: boolean;
  completedDates: string[];
  category: string;
  targetDays: number;
}

export interface UserProfile {
  email: string;
  name: string;
  joinedDate: string;
  avatar?: string;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'ai' | 'stats' | 'social' | 'profile'>('home');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [showAIChat, setShowAIChat] = useState(false);
  const [loading, setLoading] = useState(true);

  // Register service worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('habitTrackerToken');
    if (storedToken) {
      loadUserData(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserData = async (token: string) => {
    try {
      const [profileData, habitsData] = await Promise.all([
        api.getProfile(token),
        api.getHabits(token),
      ]);

      setCurrentUser(profileData.profile);
      
      // Update completedToday based on current date
      const today = new Date().toISOString().split('T')[0];
      const updatedHabits = habitsData.habits.map((habit: Habit) => ({
        ...habit,
        completedToday: habit.completedDates.includes(today),
      }));
      
      setHabits(updatedHabits);
      setAccessToken(token);
    } catch (error) {
      console.error('Failed to load user data:', error);
      localStorage.removeItem('habitTrackerToken');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (email: string, name: string, password: string) => {
    try {
      console.log('Attempting signup for:', email);
      const { user, profile } = await api.signup(email, name, password);
      
      console.log('Signup successful, attempting login...');
      // Now login to get the session
      const loginData = await api.login(email, password);
      const token = loginData.session.access_token;
      
      setCurrentUser(profile);
      setAccessToken(token);
      localStorage.setItem('habitTrackerToken', token);
      
      console.log('Loading habits...');
      // Load initial habits
      const habitsData = await api.getHabits(token);
      setHabits(habitsData.habits);
      console.log('Signup complete!');
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = error?.message || 'Failed to create account. Please try again.';
      alert(errorMessage);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      const token = data.session.access_token;
      
      localStorage.setItem('habitTrackerToken', token);
      await loadUserData(token);
    } catch (error) {
      console.error('Login error:', error);
      alert('Invalid email or password');
    }
  };

  const handleToggleHabit = async (habitId: string) => {
    if (!accessToken) return;

    try {
      const data = await api.toggleHabit(accessToken, habitId);
      
      // Update completedToday based on current date
      const today = new Date().toISOString().split('T')[0];
      const updatedHabits = data.habits.map((habit: Habit) => ({
        ...habit,
        completedToday: habit.completedDates.includes(today),
      }));
      
      setHabits(updatedHabits);
    } catch (error) {
      console.error('Failed to toggle habit:', error);
    }
  };

  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;

    const sortedDates = completedDates
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      checkDate.setHours(0, 0, 0, 0);

      const completedDate = new Date(sortedDates[i]);
      completedDate.setHours(0, 0, 0, 0);

      if (checkDate.getTime() === completedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!currentUser || !accessToken) return;

    try {
      const data = await api.updateProfile(accessToken, updates);
      setCurrentUser(data.profile);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAccessToken(null);
    setActiveTab('home');
    localStorage.removeItem('habitTrackerToken');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return <WelcomeScreen onSignup={handleSignup} onLogin={handleLogin} />;
  }

  const completedToday = habits.filter(h => h.completedToday).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-gray-900">Hello, {currentUser.name}!</h1>
              <p className="text-sm text-gray-600">
                {activeTab === 'home' && `${completedToday} of ${totalHabits} habits completed`}
                {activeTab === 'ai' && 'Your AI Coach'}
                {activeTab === 'stats' && 'Your Progress'}
                {activeTab === 'social' && 'Friends & Community'}
                {activeTab === 'profile' && 'Your Profile'}
              </p>
            </div>
            {activeTab === 'home' && (
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <div className="text-center">
                  <div className="text-xl">{completionRate}%</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {activeTab === 'home' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-gray-900">Today&apos;s Habits</h2>
              <span className="text-sm text-gray-600">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={handleToggleHabit}
              />
            ))}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900">AI Insights</h2>
              <button
                onClick={() => setShowAIChat(!showAIChat)}
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full text-sm"
              >
                {showAIChat ? 'View Insights' : 'Chat with Coach'}
              </button>
            </div>

            {showAIChat ? (
              <AICoachChat habits={habits} userName={currentUser.name} authToken={accessToken!} />
            ) : (
              <>
                <InsightCard
                  type="motivation"
                  title="Great Progress!"
                  message={`You've completed ${completedToday} habits today. Keep up the amazing work!`}
                  icon="🎉"
                />
                <InsightCard
                  type="suggestion"
                  title="Build Your Streak"
                  message="You're just 2 days away from a 7-day streak on Morning Meditation. Don't break the chain!"
                  icon="🔥"
                />
                <InsightCard
                  type="insight"
                  title="Pattern Detected"
                  message="You complete more habits on weekdays. Try setting weekend reminders to maintain consistency."
                  icon="💡"
                />
              </>
            )}
          </div>
        )}

        {activeTab === 'stats' && <StatsView habits={habits} />}

        {activeTab === 'social' && <SocialView userName={currentUser.name} habits={habits} />}

        {activeTab === 'profile' && (
          <ProfileView
            user={currentUser}
            habits={habits}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
            accessToken={accessToken!}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-bottom">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center justify-around py-2">
            <TabButton
              icon={<Home className="w-6 h-6" />}
              label="Home"
              active={activeTab === 'home'}
              onClick={() => setActiveTab('home')}
            />
            <TabButton
              icon={<Brain className="w-6 h-6" />}
              label="AI Coach"
              active={activeTab === 'ai'}
              onClick={() => {
                setActiveTab('ai');
                setShowAIChat(false);
              }}
            />
            <TabButton
              icon={<TrendingUp className="w-6 h-6" />}
              label="Stats"
              active={activeTab === 'stats'}
              onClick={() => setActiveTab('stats')}
            />
            <TabButton
              icon={<Users className="w-6 h-6" />}
              label="Social"
              active={activeTab === 'social'}
              onClick={() => setActiveTab('social')}
            />
            <TabButton
              icon={<User className="w-6 h-6" />}
              label="Profile"
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
            />
          </div>
        </div>
      </div>
      <Toaster />
      <PWAInstallPrompt />
    </div>
  );
}

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function TabButton({ icon, label, active, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-all ${
        active
          ? 'text-purple-600'
          : 'text-gray-400 hover:text-gray-600'
      }`}
    >
      <div className={active ? 'scale-110' : ''}>{icon}</div>
      <span className="text-xs">{label}</span>
    </button>
  );
}