import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Mail, User, Lock } from 'lucide-react';

interface WelcomeScreenProps {
  onSignup: (email: string, name: string, password: string) => void;
  onLogin: (email: string, password: string) => void;
}

export function WelcomeScreen({ onSignup, onLogin }: WelcomeScreenProps) {
  const [step, setStep] = useState<'welcome' | 'signup' | 'login'>('welcome');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name && password) {
      onSignup(email, name, password);
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  if (step === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mb-8 flex justify-center"
          >
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Sparkles className="w-12 h-12 text-purple-600" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white mb-4"
          >
            Smart Habit Tracker
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/90 mb-4 max-w-sm mx-auto px-4"
          >
            Build healthy habits with AI-powered coaching and personalized insights
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4 mb-12 max-w-sm mx-auto px-4"
          >
            <FeatureItem icon="🎯" text="Track daily habits effortlessly" delay={0.7} />
            <FeatureItem icon="🤖" text="Get AI-powered coaching" delay={0.8} />
            <FeatureItem icon="📊" text="Visualize your progress" delay={0.9} />
            <FeatureItem icon="👥" text="Share with friends" delay={1.0} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="space-y-3"
          >
            <button
              onClick={() => setStep('signup')}
              className="px-8 py-4 bg-white text-purple-600 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 w-full max-w-xs"
            >
              Get Started
            </button>
            <button
              onClick={() => setStep('login')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full hover:bg-white/20 transition-all w-full max-w-xs"
            >
              I Already Have an Account
            </button>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (step === 'login') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Login to continue tracking</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
            >
              Login
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep('welcome');
                  setEmail('');
                  setPassword('');
                }}
                className="flex-1 py-3 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('signup');
                  setPassword('');
                }}
                className="flex-1 py-3 text-purple-600 hover:text-purple-700 transition-colors"
              >
                Create Account
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Start your journey to better habits</p>
        </div>

        <form onSubmit={handleSignupSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            Start Tracking Habits
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setStep('welcome');
                setEmail('');
                setName('');
                setPassword('');
              }}
              className="flex-1 py-3 text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('login');
                setName('');
              }}
              className="flex-1 py-3 text-purple-600 hover:text-purple-700 transition-colors"
            >
              Login Instead
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

interface FeatureItemProps {
  icon: string;
  text: string;
  delay: number;
}

function FeatureItem({ icon, text, delay }: FeatureItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 text-white/90"
    >
      <span className="text-2xl">{icon}</span>
      <span>{text}</span>
    </motion.div>
  );
}