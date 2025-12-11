import { motion } from 'motion/react';
import { Check, Flame } from 'lucide-react';
import type { Habit } from '../App';

interface HabitCardProps {
  habit: Habit;
  onToggle: (habitId: string) => void;
}

export function HabitCard({ habit, onToggle }: HabitCardProps) {
  const progress = (habit.completedDates.length / habit.targetDays) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-sm p-4 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        {/* Habit Icon */}
        <div className="text-4xl">{habit.icon}</div>

        {/* Habit Info */}
        <div className="flex-1">
          <h3 className="text-gray-900">{habit.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600">{habit.category}</span>
            {habit.streak > 0 && (
              <div className="flex items-center gap-1 text-orange-500">
                <Flame className="w-4 h-4" />
                <span className="text-sm">{habit.streak} day{habit.streak !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>{habit.completedDates.length} / {habit.targetDays} days</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              />
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(habit.id)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            habit.completedToday
              ? 'bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          {habit.completedToday && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Check className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </motion.button>
      </div>
    </motion.div>
  );
}
