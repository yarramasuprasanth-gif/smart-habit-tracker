import { useState } from 'react';
import { motion } from 'motion/react';
import { Share2, Heart, MessageCircle, TrendingUp, Users } from 'lucide-react';
import { ShareDialog } from './ShareDialog';
import type { Habit } from '../App';

interface SocialViewProps {
  userName: string;
  habits: Habit[];
}

interface FriendActivity {
  id: string;
  name: string;
  avatar: string;
  action: string;
  habit: string;
  timeAgo: string;
  likes: number;
  comments: number;
}

export function SocialView({ userName, habits }: SocialViewProps) {
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  // Mock friend activity data
  const friendActivities: FriendActivity[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: '👩',
      action: 'completed a 7-day streak',
      habit: 'Morning Yoga',
      timeAgo: '2 hours ago',
      likes: 12,
      comments: 3,
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: '👨',
      action: 'started tracking',
      habit: 'Learning Spanish',
      timeAgo: '5 hours ago',
      likes: 8,
      comments: 1,
    },
    {
      id: '3',
      name: 'Emma Davis',
      avatar: '👧',
      action: 'achieved 30-day milestone',
      habit: 'Daily Reading',
      timeAgo: '1 day ago',
      likes: 24,
      comments: 7,
    },
    {
      id: '4',
      name: 'Alex Rivera',
      avatar: '🧑',
      action: 'completed',
      habit: 'Evening Walk',
      timeAgo: '1 day ago',
      likes: 5,
      comments: 2,
    },
  ];

  const handleLike = (postId: string) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const completedToday = habits.filter(h => h.completedToday).length;
  const longestStreak = Math.max(...habits.map(h => h.streak), 0);

  return (
    <div className="space-y-6">
      {/* Your Progress Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3>Your Progress Today</h3>
            <p className="text-white/80">Share your achievements!</p>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <TrendingUp className="w-8 h-8" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-sm text-white/80">Completed Today</p>
            <p className="text-2xl">{completedToday}</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3 backdrop-blur-sm">
            <p className="text-sm text-white/80">Longest Streak</p>
            <p className="text-2xl">{longestStreak} days</p>
          </div>
        </div>

        <button
          onClick={() => setShowShareDialog(true)}
          className="w-full bg-white text-purple-600 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          Share Your Progress
        </button>
      </motion.div>

      {/* Friends Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Friends Activity</h3>
          <button className="flex items-center gap-2 text-purple-600 text-sm hover:text-purple-700">
            <Users className="w-4 h-4" />
            Find Friends
          </button>
        </div>

        <div className="space-y-3">
          {friendActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {activity.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-gray-900">{activity.name}</h4>
                      <p className="text-gray-600">
                        {activity.action} <span className="text-purple-600">{activity.habit}</span>
                      </p>
                      <p className="text-sm text-gray-400 mt-1">{activity.timeAgo}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => handleLike(activity.id)}
                      className={`flex items-center gap-1 text-sm transition-colors ${
                        likedPosts.has(activity.id)
                          ? 'text-red-500'
                          : 'text-gray-500 hover:text-red-500'
                      }`}
                    >
                      <Heart 
                        className={`w-5 h-5 ${likedPosts.has(activity.id) ? 'fill-current' : ''}`}
                      />
                      <span>{activity.likes + (likedPosts.has(activity.id) ? 1 : 0)}</span>
                    </button>
                    <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span>{activity.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm p-5"
      >
        <h3 className="text-gray-900 mb-4">Weekly Leaderboard</h3>
        <div className="space-y-3">
          {[
            { name: 'Emma Davis', avatar: '👧', completions: 42, rank: 1 },
            { name: userName, avatar: '🎯', completions: completedToday * 7, rank: 2 },
            { name: 'Sarah Johnson', avatar: '👩', completions: 35, rank: 3 },
            { name: 'Mike Chen', avatar: '👨', completions: 28, rank: 4 },
          ].map((user, index) => (
            <div
              key={user.name}
              className={`flex items-center gap-3 p-3 rounded-xl ${
                user.name === userName ? 'bg-purple-50 border-2 border-purple-200' : 'bg-gray-50'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                index === 0 ? 'bg-yellow-500 text-white' :
                index === 1 ? 'bg-gray-400 text-white' :
                index === 2 ? 'bg-orange-600 text-white' :
                'bg-gray-200 text-gray-600'
              }`}>
                {user.rank}
              </div>
              <div className="text-2xl">{user.avatar}</div>
              <div className="flex-1">
                <h4 className="text-gray-900">{user.name}</h4>
              </div>
              <div className="text-purple-600">{user.completions} completions</div>
            </div>
          ))}
        </div>
      </motion.div>

      {showShareDialog && (
        <ShareDialog
          userName={userName}
          completedToday={completedToday}
          longestStreak={longestStreak}
          onClose={() => setShowShareDialog(false)}
        />
      )}
    </div>
  );
}
