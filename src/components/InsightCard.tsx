import { motion } from 'motion/react';

interface InsightCardProps {
  type: 'motivation' | 'suggestion' | 'insight';
  title: string;
  message: string;
  icon: string;
}

export function InsightCard({ type, title, message, icon }: InsightCardProps) {
  const gradients = {
    motivation: 'from-green-500 to-emerald-500',
    suggestion: 'from-orange-500 to-red-500',
    insight: 'from-blue-500 to-purple-500',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex gap-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradients[type]} flex items-center justify-center flex-shrink-0 text-2xl`}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-gray-900 mb-1">{title}</h3>
          <p className="text-gray-600">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
