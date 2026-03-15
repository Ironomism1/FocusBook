import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, ArrowRight, Mail, Lock, User } from 'lucide-react';
import { cn } from '../lib/utils';

export const Auth = ({ onAuthSuccess }: { onAuthSuccess: (isNewUser: boolean) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    onAuthSuccess(!isLogin);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[var(--accent)]/20 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[var(--accent-secondary)]/20 blur-[120px] rounded-full animate-pulse" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass p-8 rounded-[2rem] relative z-10"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="w-16 h-16 bg-gradient-to-tr from-[var(--accent)] to-[var(--accent-secondary)] rounded-2xl flex items-center justify-center text-white mb-4 shadow-2xl shadow-[var(--accent)]/20"
          >
            <Shield size={32} />
          </motion.div>
          <h1 className="text-3xl font-display font-black tracking-tighter">FocusBook</h1>
          <p className="text-sm opacity-50 mt-1">Deep Focus Ecosystem</p>
        </div>

        <div className="flex gap-4 mb-8 p-1 bg-white/5 rounded-full border border-white/10">
          <button 
            onClick={() => setIsLogin(true)}
            className={cn(
              "flex-1 py-2 rounded-full text-sm font-bold transition-all",
              isLogin ? "bg-white text-black shadow-lg" : "text-white opacity-50 hover:opacity-100"
            )}
          >
            Sign In
          </button>
          <button 
            onClick={() => setIsLogin(false)}
            className={cn(
              "flex-1 py-2 rounded-full text-sm font-bold transition-all",
              !isLogin ? "bg-white text-black shadow-lg" : "text-white opacity-50 hover:opacity-100"
            )}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                className="input-field pl-12"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="input-field pl-12"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              className="input-field pl-12"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 mt-4 group">
            {isLogin ? 'Sign In' : 'Get Started'}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <div className="text-xs opacity-40 mb-4 uppercase tracking-widest font-bold">Or continue with</div>
          <div className="flex gap-4 justify-center">
            {['Google', 'Apple', 'GitHub'].map(provider => (
              <button key={provider} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                <div className="w-5 h-5 bg-white/20 rounded-sm" />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
