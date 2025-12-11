import { motion, AnimatePresence } from 'motion/react';
import { X, Twitter, Facebook, Link2, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareDialogProps {
  userName: string;
  completedToday: number;
  longestStreak: number;
  onClose: () => void;
}

export function ShareDialog({ userName, completedToday, longestStreak, onClose }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const shareText = `I just completed ${completedToday} habits today and have a ${longestStreak}-day streak! Join me on Smart Habit Tracker to build better habits! 🎯`;
  const shareUrl = 'https://smarthabittracker.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      '_blank'
    );
  };

  const handleShareFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
      '_blank'
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="mb-2">Share Your Progress</h2>
            <p className="text-white/90">Let your friends know about your achievements!</p>
          </div>

          {/* Stats Card */}
          <div className="p-6">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 text-3xl">
                  🎯
                </div>
                <h3 className="text-gray-900 mb-1">{userName}&apos;s Progress</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Completed Today</p>
                  <p className="text-2xl text-purple-600">{completedToday}</p>
                </div>
                <div className="bg-white rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 mb-1">Longest Streak</p>
                  <p className="text-2xl text-purple-600">{longestStreak}</p>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-3">
              <button
                onClick={handleShareTwitter}
                className="w-full flex items-center gap-3 p-4 bg-[#1DA1F2] text-white rounded-xl hover:bg-[#1a8cd8] transition-colors"
              >
                <Twitter className="w-5 h-5 fill-current" />
                <span>Share on Twitter</span>
              </button>

              <button
                onClick={handleShareFacebook}
                className="w-full flex items-center gap-3 p-4 bg-[#4267B2] text-white rounded-xl hover:bg-[#365899] transition-colors"
              >
                <Facebook className="w-5 h-5 fill-current" />
                <span>Share on Facebook</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 p-4 bg-gray-100 text-gray-900 rounded-xl hover:bg-gray-200 transition-colors relative"
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5 text-green-600" />
                    <span className="text-green-600">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-5 h-5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
