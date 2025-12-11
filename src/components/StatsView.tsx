import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react';
import type { Habit } from '../App';

interface StatsViewProps {
  habits: Habit[];
}

export function StatsView({ habits }: StatsViewProps) {
  const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDates.length, 0);
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);
  const completedToday = habits.filter(h => h.completedToday).length;
  const averageCompletion = habits.length > 0 
    ? Math.round((completedToday / habits.length) * 100) 
    : 0;

  // Generate weekly data for chart
  const weeklyData = generateWeeklyData(habits);
  
  // Habit breakdown by category
  const habitsByCategory = habits.map(habit => ({
    name: habit.name.length > 15 ? habit.name.substring(0, 15) + '...' : habit.name,
    completions: habit.completedDates.length,
  }));

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={<TrendingUp className="w-6 h-6" />}
          label="Total Completions"
          value={totalCompletions.toString()}
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          icon={<Award className="w-6 h-6" />}
          label="Longest Streak"
          value={`${longestStreak} days`}
          gradient="from-orange-500 to-red-500"
        />
        <StatCard
          icon={<Calendar className="w-6 h-6" />}
          label="Today"
          value={`${completedToday}/${habits.length}`}
          gradient="from-purple-500 to-pink-500"
        />
        <StatCard
          icon={<Target className="w-6 h-6" />}
          label="Completion Rate"
          value={`${averageCompletion}%`}
          gradient="from-green-500 to-emerald-500"
        />
      </div>

      {/* Weekly Progress Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm p-5"
      >
        <h3 className="text-gray-900 mb-4">Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="completions" 
              stroke="url(#colorGradient)" 
              strokeWidth={3}
              dot={{ fill: '#a855f7', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Habit Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-sm p-5"
      >
        <h3 className="text-gray-900 mb-4">Habit Completions</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={habitsByCategory}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="name" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: 'none', 
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Bar 
              dataKey="completions" 
              fill="url(#barGradient)" 
              radius={[8, 8, 0, 0]}
            />
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Individual Habit Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <h3 className="text-gray-900">Habit Details</h3>
        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="bg-white rounded-xl shadow-sm p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{habit.icon}</span>
              <div className="flex-1">
                <h4 className="text-gray-900">{habit.name}</h4>
                <p className="text-sm text-gray-600">{habit.category}</p>
              </div>
              <div className="text-right">
                <p className="text-purple-600">{habit.completedDates.length} days</p>
                <p className="text-sm text-gray-600">{habit.streak} streak</p>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all"
                style={{ width: `${(habit.completedDates.length / habit.targetDays) * 100}%` }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  gradient: string;
}

function StatCard({ icon, label, value, gradient }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-sm p-4"
    >
      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="text-gray-900">{value}</p>
    </motion.div>
  );
}

function generateWeeklyData(habits: Habit[]) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const weekData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayName = days[date.getDay()];

    const completions = habits.reduce((count, habit) => {
      return count + (habit.completedDates.includes(dateStr) ? 1 : 0);
    }, 0);

    weekData.push({
      day: dayName,
      completions,
    });
  }

  return weekData;
}
