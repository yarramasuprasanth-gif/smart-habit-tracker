import { useState } from 'react';
import { Share2, Copy, Check, QrCode } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';

export function ShareAppLink() {
  const [copied, setCopied] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const currentUrl = window.location.href;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Smart Habit Tracker',
          text: 'Check out this habit tracking app!',
          url: currentUrl,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-purple-600" />
          <h3 className="text-gray-900">Share This App</h3>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="text-sm text-purple-600 hover:text-purple-700"
        >
          {showInfo ? 'Hide' : 'How?'}
        </button>
      </div>

      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-3"
          >
            <div className="bg-white rounded-lg p-3 text-sm text-gray-600 space-y-2">
              <p className="flex items-center gap-2">
                <QrCode className="w-4 h-4 text-purple-600" />
                <span>Create QR code at <strong>qr-code-generator.com</strong></span>
              </p>
              <p>• Share via email, WhatsApp, or SMS</p>
              <p>• Others can install on their phone!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-lg p-3 mb-3">
        <p className="text-xs text-gray-500 mb-1">App URL:</p>
        <p className="text-sm text-gray-900 break-all font-mono bg-gray-50 p-2 rounded">
          {currentUrl}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleCopy}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          disabled={copied}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </>
          )}
        </Button>
        
        {navigator.share && (
          <Button
            onClick={handleShare}
            variant="outline"
            className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        )}
      </div>
    </div>
  );
}
