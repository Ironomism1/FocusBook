import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Target, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Eye,
  Bell,
  Monitor
} from 'lucide-react';
import { cn } from '../lib/utils';

const steps = [
  {
    id: 'goals',
    title: 'What are your goals?',
    subtitle: 'Choose your primary focus objectives',
    icon: Target,
    options: [
      { id: 'deep-work', label: 'Deep Work', desc: '4+ hours of uninterrupted focus' },
      { id: 'exam-prep', label: 'Exam Prep', desc: 'Intensive study with active recall' },
      { id: 'creative', label: 'Creative Flow', desc: 'Design, writing, or coding' },
      { id: 'habit', label: 'Habit Building', desc: 'Consistent daily focus sessions' }
    ]
  },
  {
    id: 'restrictions',
    title: 'Set your boundaries',
    subtitle: 'Which apps/sites distract you most?',
    icon: ShieldAlert,
    options: [
      { id: 'social', label: 'Social Media', desc: 'Instagram, Facebook, X' },
      { id: 'gaming', label: 'Gaming', desc: 'Valorant, Steam, Discord' },
      { id: 'streaming', label: 'Streaming', desc: 'YouTube, Netflix, Twitch' },
      { id: 'news', label: 'News/Doomscroll', desc: 'Reddit, News sites' }
    ]
  },
  {
    id: 'monitoring',
    title: 'Biological Tracking',
    subtitle: 'How should we monitor your focus?',
    icon: Eye,
    options: [
      { id: 'gaze', label: 'Gaze Tracking', desc: 'Alert if eyes leave the screen' },
      { id: 'drowsy', label: 'Drowsiness', desc: 'Detect fatigue and suggest breaks' },
      { id: 'posture', label: 'Posture Check', desc: 'Ensure ergonomic focus position' },
      { id: 'attention', label: 'Attention Score', desc: 'AI-powered focus analysis' }
    ]
  },
  {
    id: 'alerts',
    title: 'Alert Preferences',
    subtitle: 'How should we pull you back?',
    icon: Bell,
    options: [
      { id: 'flash', label: 'Screen Flashing', desc: 'Visual red flash on distraction' },
      { id: 'beep', label: 'Audio Beep', desc: 'Loud beep sound after 15 mins' },
      { id: 'boss', label: 'Boss Mode', desc: 'AI Boss gives harsh feedback' },
      { id: 'strict', label: 'Strict Lock', desc: 'Force close distracting apps' }
    ]
  }
];

export const Onboarding = ({ onComplete }: { onComplete: (data: any) => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const toggleOption = (stepId: string, optionId: string) => {
    setSelections(prev => {
      const current = prev[stepId] || [];
      if (current.includes(optionId)) {
        return { ...prev, [stepId]: current.filter(id => id !== optionId) };
      }
      return { ...prev, [stepId]: [...current, optionId] };
    });
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onComplete(selections);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="flex gap-2 mb-12">
          {steps.map((_, idx) => (
            <div 
              key={idx}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all duration-500",
                idx <= currentStep ? "bg-[var(--accent)]" : "bg-white/10"
              )}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass p-10 rounded-[2.5rem]"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)]">
                <Icon size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold">{step.title}</h2>
                <p className="opacity-50">{step.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
              {step.options.map(option => {
                const isSelected = (selections[step.id] || []).includes(option.id);
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleOption(step.id, option.id)}
                    className={cn(
                      "p-5 rounded-2xl border text-left transition-all group relative overflow-hidden",
                      isSelected 
                        ? "border-[var(--accent)] bg-[var(--accent)]/10" 
                        : "border-white/10 bg-white/5 hover:border-white/30"
                    )}
                  >
                    {isSelected && (
                      <motion.div 
                        layoutId="check"
                        className="absolute top-4 right-4 text-[var(--accent)]"
                      >
                        <CheckCircle2 size={20} />
                      </motion.div>
                    )}
                    <h3 className="font-bold mb-1">{option.label}</h3>
                    <p className="text-xs opacity-50">{option.desc}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center">
              <button 
                onClick={handleBack}
                disabled={currentStep === 0}
                className={cn(
                  "flex items-center gap-2 text-sm font-bold transition-opacity",
                  currentStep === 0 ? "opacity-0 pointer-events-none" : "opacity-50 hover:opacity-100"
                )}
              >
                <ArrowLeft size={18} />
                Back
              </button>
              
              <button 
                onClick={handleNext}
                className="btn-primary px-8 flex items-center gap-2 group"
              >
                {currentStep === steps.length - 1 ? 'Finish Setup' : 'Continue'}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 text-center">
          <p className="text-xs opacity-30">
            You can always change these settings later in your profile.
          </p>
        </div>
      </div>
    </div>
  );
};
