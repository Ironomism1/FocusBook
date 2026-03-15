/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Newspaper, 
  Shield, 
  Youtube, 
  BarChart3, 
  Calendar, 
  Settings, 
  Brain, 
  MessageSquare, 
  Eye, 
  AlertCircle,
  Clock,
  CheckCircle2,
  Zap,
  Menu,
  X,
  Palette,
  Bell,
  Search,
  User as UserIcon,
  MoreVertical,
  Globe,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  BarChart,
  Bar
} from 'recharts';
import { Theme, NewsItem, FocusSession, ScheduleEvent } from './types';
import { MOCK_NEWS, MOCK_SESSIONS, MOCK_SCHEDULE } from './constants';
import { cn } from './lib/utils';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-300 group relative",
      active 
        ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-secondary)] text-white shadow-lg shadow-[var(--accent)]/20" 
        : "text-[var(--fg)] opacity-60 hover:opacity-100 hover:bg-[var(--fg)]/5"
    )}
  >
    <Icon size={20} className={cn("transition-transform duration-300", active && "scale-110")} />
    <span className="font-bold text-sm tracking-tight">{label}</span>
    {active && (
      <motion.div 
        layoutId="active-pill"
        className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
      />
    )}
  </button>
);

const ThemeSwitcher = ({ currentTheme, onThemeChange }: { currentTheme: Theme, onThemeChange: (t: Theme) => void }) => {
  const themes: Theme[] = ['modern', 'technical', 'hardware', 'brutalist', 'minimal', 'organic', 'cyberpunk', 'paper'];
  
  return (
    <div className="p-4 bg-[var(--fg)]/5 rounded-3xl border border-[var(--border)] mb-4">
      <div className="flex items-center gap-2 mb-3 opacity-40 px-1">
        <Palette size={14} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Templates</span>
      </div>
      <div className="grid grid-cols-4 gap-2">
        {themes.map((t) => (
          <button
            key={t}
            onClick={() => onThemeChange(t)}
            title={t}
            className={cn(
              "w-full aspect-square rounded-xl transition-all border-2 flex items-center justify-center",
              currentTheme === t 
                ? "border-[var(--accent)] bg-[var(--accent)]/10" 
                : "border-transparent bg-[var(--fg)]/5 hover:bg-[var(--fg)]/10"
            )}
          >
            <div className={cn(
              "w-3 h-3 rounded-full",
              t === 'modern' ? "bg-cyan-400" :
              t === 'organic' ? "bg-pink-500" :
              t === 'hardware' ? "bg-emerald-500" :
              t === 'cyberpunk' ? "bg-yellow-400" : "bg-gray-400"
            )} />
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [authState, setAuthState] = useState<'unauthenticated' | 'onboarding' | 'authenticated'>('unauthenticated');
  const [userData, setUserData] = useState<any>(null);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('focusbook-theme') as Theme) || 'modern');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFocusing, setIsFocusing] = useState(false);
  const [focusTime, setFocusTime] = useState(0);
  const [isDrowsy, setIsDrowsy] = useState(false);
  const [attentionScore, setAttentionScore] = useState(95);
  const [alertThreshold, setAlertThreshold] = useState(() => Number(localStorage.getItem('focusbook-alert-threshold')) || 15); // minutes
  const [distractionTime, setDistractionTime] = useState(0); // seconds
  const [isAlerting, setIsAlerting] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(() => localStorage.getItem('focusbook-audio-enabled') !== 'false');
  const [schedule, setSchedule] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('focusbook-schedule');
    return saved ? JSON.parse(saved) : MOCK_SCHEDULE;
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [restrictions, setRestrictions] = useState(() => {
    const saved = localStorage.getItem('focusbook-restrictions');
    return saved ? JSON.parse(saved) : {
      youtubeEntertainment: true,
      youtubeEducationalOnly: true,
      keywords: ['gaming', 'vlogs', 'memes']
    };
  });
  const [bossMessages, setBossMessages] = useState<string[]>(["You've been focused for 20 minutes. Your gaze is steady. Keep it up, you're in the flow zone."]);
  const [bossInput, setBossInput] = useState("");
  const [sessions, setSessions] = useState<FocusSession[]>(() => {
    const saved = localStorage.getItem('focusbook-sessions');
    return saved ? JSON.parse(saved) : MOCK_SESSIONS;
  });

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Persistence
  useEffect(() => {
    localStorage.setItem('focusbook-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('focusbook-alert-threshold', alertThreshold.toString());
  }, [alertThreshold]);

  useEffect(() => {
    localStorage.setItem('focusbook-audio-enabled', audioEnabled.toString());
  }, [audioEnabled]);

  useEffect(() => {
    localStorage.setItem('focusbook-schedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('focusbook-restrictions', JSON.stringify(restrictions));
  }, [restrictions]);

  useEffect(() => {
    localStorage.setItem('focusbook-sessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleAuthSuccess = (isNewUser: boolean) => {
    if (isNewUser) {
      setAuthState('onboarding');
    } else {
      setAuthState('authenticated');
    }
  };

  const handleOnboardingComplete = (data: any) => {
    setUserData(data);
    setAuthState('authenticated');
  };

  const handleLogout = () => {
    setAuthState('unauthenticated');
    setIsFocusing(false);
  };

  const endFocusSession = () => {
    setIsFocusing(false);
    const newSession: FocusSession = {
      id: Math.random().toString(36).substr(2, 9),
      startTime: new Date(),
      duration: Math.floor(focusTime / 60),
      focusScore: Math.floor(attentionScore),
      attentionLevel: Math.floor(attentionScore * 0.8),
      drowsinessLevel: isDrowsy ? 80 : 10
    };
    setSessions([...sessions, newSession]);
    setFocusTime(0);
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to clear all local data? This will reset your schedule and settings.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const addScheduleEvent = () => {
    const title = prompt("Enter event title:");
    if (!title) return;
    const time = prompt("Enter time (e.g., 09:00 AM):", "09:00 AM");
    if (!time) return;
    const type = prompt("Enter type (focus, break, meeting):", "focus") as any;
    
    const newEvent: ScheduleEvent = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      time,
      type: ['focus', 'break', 'meeting'].includes(type) ? type : 'focus'
    };
    setSchedule([...schedule, newEvent]);
  };

  const deleteScheduleEvent = (id: string) => {
    setSchedule(schedule.filter(e => e.id !== id));
  };

  const applyScheduleOptimization = () => {
    // Simulate optimization by shifting the first focus session
    const newSchedule = schedule.map(event => {
      if (event.type === 'focus' && event.time.includes('09:00')) {
        return { ...event, time: '09:30 AM' };
      }
      return event;
    });
    setSchedule(newSchedule);
    alert("Schedule optimized! Your morning focus session has been shifted to 9:30 AM.");
  };

  const handleBossChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!bossInput.trim()) return;
    
    const userMsg = bossInput;
    setBossInput("");
    setBossMessages(prev => [...prev, userMsg]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'm monitoring your focus levels. They seem stable.",
        "Remember to blink often to reduce eye strain.",
        "Your attention score is currently " + attentionScore.toFixed(0) + "%.",
        "Deep work is a superpower. Stay in the zone.",
        "I've blocked 3 distracting tabs in the last hour for you."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      setBossMessages(prev => [...prev, randomResponse]);
    }, 1000);
  };

  const toggleRestriction = (key: keyof typeof restrictions) => {
    if (typeof restrictions[key] === 'boolean') {
      setRestrictions({ ...restrictions, [key]: !restrictions[key] });
    }
  };

  const addKeyword = () => {
    const kw = prompt("Enter keyword to block:");
    if (kw && !restrictions.keywords.includes(kw)) {
      setRestrictions({ ...restrictions, keywords: [...restrictions.keywords, kw] });
    }
  };

  const removeKeyword = (kw: string) => {
    setRestrictions({ ...restrictions, keywords: restrictions.keywords.filter(k => k !== kw) });
  };

  // Audio Beep Function
  const playBeep = () => {
    if (!audioEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.2);
    } catch (e) {
      console.error("Audio context failed", e);
    }
  };

  // Simulated focus timer
  useEffect(() => {
    let interval: any;
    if (isFocusing) {
      interval = setInterval(() => {
        setFocusTime(prev => prev + 1);
        
        // Randomly fluctuate attention score
        const newAttention = Math.max(0, Math.min(100, attentionScore + (Math.random() * 4 - 2)));
        setAttentionScore(newAttention);
        
        // Simulate drowsiness detection
        if (Math.random() > 0.98) setIsDrowsy(true);
        else if (Math.random() > 0.9) setIsDrowsy(false);

        // Alert Logic: If attention is low or drowsy, increment distraction timer
        const isDistracted = newAttention < 70 || isDrowsy;
        
        if (isDistracted) {
          setDistractionTime(prev => {
            const next = prev + 1;
            if (next >= alertThreshold * 60) {
              setIsAlerting(true);
              playBeep();
              return 0; // Reset after alert
            }
            return next;
          });
        } else {
          setDistractionTime(0);
          setIsAlerting(false);
        }
      }, 1000);
    } else {
      setDistractionTime(0);
      setIsAlerting(false);
    }
    return () => clearInterval(interval);
  }, [isFocusing, attentionScore, isDrowsy, alertThreshold]);

  // Flash effect cleanup
  useEffect(() => {
    if (isAlerting) {
      const timeout = setTimeout(() => setIsAlerting(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [isAlerting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Welcome Header */}
            <div className="lg:col-span-3">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2"
              >
                <div>
                  <h1 className="text-4xl font-display font-black tracking-tighter">
                    Welcome back, Shriyansh
                  </h1>
                  <p className="opacity-50 text-sm mt-1">
                    {userData?.goals?.includes('deep-work') 
                      ? "Ready for another deep focus session?" 
                      : "Your focus ecosystem is optimized and ready."}
                  </p>
                </div>
                <div className="flex gap-2">
                  {userData?.goals?.map((goal: string) => (
                    <span key={goal} className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-[10px] font-bold uppercase tracking-wider border border-[var(--accent)]/20">
                      {goal.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Biological Tracking / Focus Mode */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="card relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className={cn("w-3 h-3 rounded-full animate-pulse", isFocusing ? "bg-red-500" : "bg-gray-500")} />
                  <span className="text-xs font-mono uppercase tracking-widest opacity-60">
                    {isFocusing ? "Live Tracking Active" : "Tracking Standby"}
                  </span>
                </div>

                {/* Simulated Webcam Feed */}
                <div className="relative w-full max-w-2xl aspect-video bg-black/40 rounded-lg border border-[var(--border)] overflow-hidden flex items-center justify-center">
                  {!isFocusing ? (
                    <div className="text-center flex flex-col items-center gap-4">
                      <Brain size={64} className="opacity-20" />
                      <button 
                        onClick={() => setIsFocusing(true)}
                        className="btn px-8 py-3 bg-[var(--accent)] text-white rounded-full font-bold hover:scale-105 transition-transform"
                      >
                        Start Focus Session
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Tracking Overlays */}
                      <div className="absolute inset-0 border-2 border-[var(--accent)]/30 pointer-events-none">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[var(--accent)]" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[var(--accent)]" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[var(--accent)]" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[var(--accent)]" />
                      </div>
                      
                      {/* Face Mesh Simulation */}
                      <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none">
                        <path d="M100,100 Q200,50 300,100 T500,100" fill="none" stroke="var(--accent)" strokeWidth="1" />
                        <circle cx="200" cy="150" r="10" fill="none" stroke="var(--accent)" />
                        <circle cx="400" cy="150" r="10" fill="none" stroke="var(--accent)" />
                      </svg>

                      <div className="absolute top-4 right-4 flex flex-col gap-2 text-right font-mono text-[10px] uppercase">
                        <div className="flex items-center gap-2 justify-end">
                          <span>Gaze Vector: [0.12, -0.05]</span>
                          <Eye size={12} className="text-[var(--accent)]" />
                        </div>
                        <div className="flex items-center gap-2 justify-end">
                          <span>Attention: {attentionScore.toFixed(1)}%</span>
                          <Brain size={12} className="text-[var(--accent)]" />
                        </div>
                        <div className={cn("flex items-center gap-2 justify-end", isDrowsy ? "text-red-500" : "text-[var(--accent)]")}>
                          <span>Drowsiness: {isDrowsy ? "HIGH" : "LOW"}</span>
                          <AlertCircle size={12} />
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-6xl font-mono font-bold tracking-tighter mb-2">
                          {formatTime(focusTime)}
                        </div>
                        <button 
                          onClick={endFocusSession}
                          className="px-6 py-2 bg-red-500/20 text-red-500 border border-red-500/50 rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-colors"
                        >
                          End Session
                        </button>
                      </div>

                      {isDrowsy && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-xl"
                        >
                          <AlertCircle size={18} />
                          <span className="text-sm font-bold">Drowsiness Detected! Take a break.</span>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-6 grid grid-cols-4 gap-4 w-full max-w-2xl">
                  <div className="p-4 bg-[var(--fg)]/5 rounded-xl border border-[var(--border)]">
                    <span className="text-[10px] uppercase tracking-widest opacity-50 block mb-1">Attention</span>
                    <div className="text-2xl font-bold font-mono">{attentionScore.toFixed(0)}%</div>
                  </div>
                  <div className="p-4 bg-[var(--fg)]/5 rounded-xl border border-[var(--border)]">
                    <span className="text-[10px] uppercase tracking-widest opacity-50 block mb-1">Alert Timer</span>
                    <div className="flex flex-col">
                      <input 
                        type="number" 
                        value={alertThreshold} 
                        onChange={(e) => setAlertThreshold(Number(e.target.value))}
                        className="bg-transparent text-xl font-bold font-mono w-full focus:outline-none text-[var(--accent)]"
                      />
                      <span className="text-[8px] opacity-40">MINUTES</span>
                    </div>
                  </div>
                  <div className="p-4 bg-[var(--fg)]/5 rounded-xl border border-[var(--border)]">
                    <span className="text-[10px] uppercase tracking-widest opacity-50 block mb-1">Distraction</span>
                    <div className="text-2xl font-bold font-mono text-red-500">
                      {Math.floor(distractionTime / 60)}:{(distractionTime % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  <div className="p-4 bg-[var(--fg)]/5 rounded-xl border border-[var(--border)]">
                    <span className="text-[10px] uppercase tracking-widest opacity-50 block mb-1">Local LLM</span>
                    <div className="text-2xl font-bold font-mono text-[var(--accent)]">BOSS</div>
                  </div>
                </div>
              </div>

              {/* Reports / Analytics Preview */}
              <div className="card">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <BarChart3 size={20} className="text-[var(--accent)]" />
                    Focus Analytics
                  </h3>
                  <select className="bg-[var(--fg)]/5 border border-[var(--border)] rounded-md text-xs px-2 py-1">
                    <option>Weekly View</option>
                    <option>Monthly View</option>
                  </select>
                </div>
                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sessions}>
                      <defs>
                        <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis 
                        dataKey="startTime" 
                        stroke="var(--fg)" 
                        opacity={0.5} 
                        fontSize={10} 
                        tickFormatter={(val) => new Date(val).toLocaleDateString()}
                      />
                      <YAxis stroke="var(--fg)" opacity={0.5} fontSize={10} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
                      />
                      <Area type="monotone" dataKey="focusScore" stroke="var(--accent)" fillOpacity={1} fill="url(#colorFocus)" />
                      <Area type="monotone" dataKey="attentionLevel" stroke="#8884d8" fillOpacity={0} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Sidebar Widgets */}
            <div className="flex flex-col gap-6">
              {/* Schedule */}
              <div className="card">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Calendar size={20} className="text-[var(--accent)]" />
                  Today's Schedule
                </h3>
                <div className="flex flex-col gap-3">
                  {schedule.map(event => (
                    <div key={event.id} className="flex items-center gap-3 p-3 bg-[var(--fg)]/5 rounded-lg border border-[var(--border)] group hover:border-[var(--accent)] transition-colors">
                      <div className={cn(
                        "w-2 h-10 rounded-full",
                        event.type === 'focus' ? "bg-[var(--accent)]" : 
                        event.type === 'break' ? "bg-blue-500" : "bg-purple-500"
                      )} />
                      <div className="flex-1">
                        <div className="text-sm font-bold">{event.title}</div>
                        <div className="text-[10px] opacity-50 font-mono">{event.time}</div>
                      </div>
                      <button 
                        onClick={() => deleteScheduleEvent(event.id)}
                        className="opacity-0 group-hover:opacity-100 text-red-500 transition-opacity p-1 hover:bg-red-500/10 rounded"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={addScheduleEvent}
                  className="w-full mt-4 py-2 border border-dashed border-[var(--border)] rounded-lg text-xs opacity-50 hover:opacity-100 transition-opacity"
                >
                  + Add Event
                </button>
              </div>

              {/* Boss Mode (Local LLM) */}
              <div className="card bg-gradient-to-br from-[var(--accent)]/10 to-transparent">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Zap size={20} className="text-[var(--accent)]" />
                    Boss Mode
                  </h3>
                  <div className="px-2 py-0.5 bg-[var(--accent)]/20 text-[var(--accent)] rounded text-[10px] font-bold uppercase">Local</div>
                </div>
                <div className="max-h-[150px] overflow-y-auto space-y-2 mb-4 pr-2 custom-scrollbar">
                  {bossMessages.map((msg, i) => (
                    <div key={i} className={cn(
                      "text-xs p-2 rounded-lg",
                      i % 2 === 0 ? "bg-[var(--fg)]/5 italic opacity-80" : "bg-[var(--accent)]/10 text-[var(--accent)] font-bold text-right"
                    )}>
                      {msg}
                    </div>
                  ))}
                </div>
                <form onSubmit={handleBossChat} className="relative">
                  <input 
                    type="text" 
                    value={bossInput}
                    onChange={(e) => setBossInput(e.target.value)}
                    placeholder="Ask Boss anything..." 
                    className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-[var(--accent)]"
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--accent)]">
                    <MessageSquare size={16} />
                  </button>
                </form>
              </div>

              {/* Restrictions Status */}
              <div className="card">
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <Shield size={20} className="text-[var(--accent)]" />
                  Focus Shield
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-60">YouTube Filter</span>
                    <span className="text-[var(--accent)] font-bold">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-60">App Restrictions</span>
                    <span className="text-[var(--accent)] font-bold">ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-60">Web Scraper</span>
                    <span className="opacity-40 italic">Idle</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'news':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tighter">Personalised News</h2>
              <div className="flex items-center gap-2">
                <span className="text-xs opacity-50">Sorted by Cosine Similarity</span>
                <div className="w-8 h-8 rounded-full bg-[var(--accent)]/20 flex items-center justify-center">
                  <Search size={16} className="text-[var(--accent)]" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {MOCK_NEWS.map(news => (
                <motion.div 
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card group hover:border-[var(--accent)] transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-0.5 bg-[var(--fg)]/5 rounded text-[10px] font-bold uppercase tracking-wider opacity-60">
                      {news.category}
                    </span>
                    <span className="text-[10px] font-mono text-[var(--accent)]">
                      {(news.relevance * 100).toFixed(0)}% Match
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">{news.title}</h3>
                  <p className="text-sm opacity-70 mb-4">{news.summary}</p>
                  <div className="flex items-center justify-between text-[10px] opacity-50 uppercase tracking-widest">
                    <span>{news.source}</span>
                    <span>2 hours ago</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'restrictions':
        return (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tighter">Focus Shield Settings</h2>
              <div className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-[10px] font-bold uppercase tracking-widest animate-pulse">
                Strict Mode Active
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* YouTube Filter */}
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-red-500/20 rounded-lg">
                    <Youtube className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">YouTube Filter</h3>
                    <p className="text-xs opacity-50">Naïve Bayes Classification</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Block Entertainment</span>
                    <button 
                      onClick={() => toggleRestriction('youtubeEntertainment')}
                      className={cn(
                        "w-10 h-5 rounded-full relative transition-colors",
                        restrictions.youtubeEntertainment ? "bg-[var(--accent)]" : "bg-gray-400"
                      )}
                    >
                      <motion.div 
                        animate={{ x: restrictions.youtubeEntertainment ? 22 : 4 }}
                        className="absolute top-1 w-3 h-3 bg-white rounded-full" 
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Allow Educational Only</span>
                    <button 
                      onClick={() => toggleRestriction('youtubeEducationalOnly')}
                      className={cn(
                        "w-10 h-5 rounded-full relative transition-colors",
                        restrictions.youtubeEducationalOnly ? "bg-[var(--accent)]" : "bg-gray-400"
                      )}
                    >
                      <motion.div 
                        animate={{ x: restrictions.youtubeEducationalOnly ? 22 : 4 }}
                        className="absolute top-1 w-3 h-3 bg-white rounded-full" 
                      />
                    </button>
                  </div>
                  <div className="pt-4 border-t border-[var(--border)]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase opacity-50 block">Custom Keywords</label>
                      <button onClick={addKeyword} className="text-[var(--accent)] text-[10px] font-bold">+ ADD</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {restrictions.keywords.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-[var(--fg)]/5 rounded text-xs border border-[var(--border)] flex items-center gap-1">
                          {tag} 
                          <button onClick={() => removeKeyword(tag)} className="opacity-50 hover:opacity-100"><X size={10} /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Website Filter */}
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <Globe size={24} className="text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">Website Filter</h3>
                    <p className="text-xs opacity-50">Domain-level Blocking</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {[
                      { name: 'instagram.com', status: 'Blocked', icon: '📸' },
                      { name: 'facebook.com', status: 'Blocked', icon: '👤' },
                      { name: 'twitter.com', status: 'Blocked', icon: '🐦' },
                    ].map((site) => (
                      <div key={site.name} className="flex items-center justify-between p-2 bg-[var(--fg)]/5 rounded-lg border border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{site.icon}</span>
                          <span className="text-sm font-medium">{site.name}</span>
                        </div>
                        <span className="text-[10px] font-bold text-red-500 uppercase">{site.status}</span>
                      </div>
                    ))}
                  </div>
                  <button className="w-full py-2 border border-dashed border-[var(--border)] rounded-lg text-xs opacity-50 hover:opacity-100 transition-opacity">
                    + Add Website
                  </button>
                </div>
              </div>

              {/* App Restrictions */}
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-500/20 rounded-lg">
                    <Shield className="text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold">App Restrictions</h3>
                    <p className="text-xs opacity-50">Deep Focus Honesty Mode</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    {[
                      { name: 'Valorant', status: 'Locked', icon: '🎮' },
                      { name: 'Steam', status: 'Locked', icon: '🕹️' },
                      { name: 'Discord', status: 'Restricted', icon: '💬' },
                    ].map((app) => (
                      <div key={app.name} className="flex items-center justify-between p-2 bg-[var(--fg)]/5 rounded-lg border border-[var(--border)]">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{app.icon}</span>
                          <span className="text-sm font-medium">{app.name}</span>
                        </div>
                        <span className={cn(
                          "text-[10px] font-bold uppercase",
                          app.status === 'Locked' ? "text-red-500" : "text-yellow-500"
                        )}>{app.status}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-[10px] text-yellow-600 font-medium">
                      Honesty mode relies on your commitment. Violation logs are sent to your "Boss" for review.
                    </p>
                  </div>
                  <button className="w-full py-2 bg-[var(--fg)]/5 border border-[var(--border)] rounded-lg text-sm font-bold">
                    Configure Blocklist
                  </button>
                </div>
              </div>

              {/* Honesty Log */}
              <div className="card">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <AlertCircle size={18} className="text-orange-500" />
                  Honesty Violation Log
                </h3>
                <div className="space-y-3">
                  <div className="text-[10px] opacity-50 italic mb-2">Last 24 hours</div>
                  <div className="flex items-center justify-between p-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                    <div className="text-xs">Attempted to open <span className="font-bold">Valorant</span></div>
                    <div className="text-[10px] opacity-50">10:42 AM</div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                    <div className="text-xs">Accessed <span className="font-bold">instagram.com</span></div>
                    <div className="text-[10px] opacity-50">09:15 AM</div>
                  </div>
                  <div className="pt-4">
                    <div className="text-[10px] uppercase font-bold opacity-40 mb-2">Boss Feedback</div>
                    <p className="text-xs italic opacity-70">
                      "I saw those attempts on Valorant. Remember your goal for Project Alpha. Get back to work."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'reports':
        return (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tighter">Performance Reports</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-[var(--fg)]/5 rounded-lg text-sm font-bold">Daily</button>
                <button className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-bold">Weekly</button>
                <button className="px-4 py-2 bg-[var(--fg)]/5 rounded-lg text-sm font-bold">Monthly</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card text-center">
                <div className="text-sm opacity-50 uppercase mb-1">Avg. Focus Score</div>
                <div className="text-4xl font-black text-[var(--accent)]">
                  {sessions.length > 0 ? (sessions.reduce((acc, s) => acc + s.focusScore, 0) / sessions.length).toFixed(1) : '0'}
                </div>
                <div className="text-[10px] text-green-500 mt-2">+5.2% from last week</div>
              </div>
              <div className="card text-center">
                <div className="text-sm opacity-50 uppercase mb-1">Deep Work Hours</div>
                <div className="text-4xl font-black text-[var(--accent)]">
                  {(sessions.reduce((acc, s) => acc + s.duration, 0) / 60).toFixed(1)}h
                </div>
                <div className="text-[10px] text-green-500 mt-2">+2.1h from last week</div>
              </div>
              <div className="card text-center">
                <div className="text-sm opacity-50 uppercase mb-1">Distractions Blocked</div>
                <div className="text-4xl font-black text-red-500">
                  {sessions.length * 12}
                </div>
                <div className="text-[10px] text-red-500 mt-2">-12% from last week</div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card h-[400px]">
                <h3 className="font-bold mb-6">Focus Consistency</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sessions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="startTime" stroke="var(--fg)" opacity={0.5} fontSize={10} tickFormatter={(val) => new Date(val).toLocaleDateString()} />
                    <YAxis stroke="var(--fg)" opacity={0.5} fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                    <Bar dataKey="focusScore" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="card h-[400px]">
                <h3 className="font-bold mb-6">Attention vs Drowsiness</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sessions}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis dataKey="startTime" stroke="var(--fg)" opacity={0.5} fontSize={10} tickFormatter={(val) => new Date(val).toLocaleDateString()} />
                    <YAxis stroke="var(--fg)" opacity={0.5} fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)' }} />
                    <Line type="monotone" dataKey="attentionLevel" stroke="var(--accent)" strokeWidth={3} dot={{ r: 6 }} />
                    <Line type="monotone" dataKey="drowsinessLevel" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
      case 'models':
        return (
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter">Model Hierarchy</h2>
                <p className="text-sm opacity-50">Manage CNN and Naïve Bayes implementations</p>
              </div>
              <button id="retrain-all-btn" className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-bold flex items-center gap-2">
                <Zap size={16} />
                Retrain All
              </button>
            </div>

            <div className="space-y-4">
              {[
                { name: 'Gaze Tracker', type: 'CNN (TensorFlow)', status: 'Active', load: '12%', accuracy: '98.2%' },
                { name: 'Drowsiness Tracker', type: 'CNN (TensorFlow)', status: 'Active', load: '8%', accuracy: '96.5%' },
                { name: 'Attention Tracker', type: 'CNN (TensorFlow)', status: 'Active', load: '15%', accuracy: '94.1%' },
                { name: 'YouTube Filter', type: 'Naïve Bayes', status: 'Active', load: '2%', accuracy: '91.8%' },
                { name: 'News Personalizer', type: 'Cosine Similarity', status: 'Active', load: '5%', accuracy: '89.4%' },
                { name: 'Boss (Local LLM)', type: 'Transformer (Llama)', status: 'Active', load: '45%', accuracy: 'N/A' },
              ].map((model, i) => (
                <div key={i} className="card flex items-center justify-between group hover:bg-[var(--fg)]/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                      <Brain size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold">{model.name}</h3>
                      <p className="text-xs opacity-50">{model.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-12">
                    <div className="text-center">
                      <div className="text-[10px] uppercase opacity-40 font-bold mb-1">Accuracy</div>
                      <div className="text-sm font-mono">{model.accuracy}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] uppercase opacity-40 font-bold mb-1">CPU Load</div>
                      <div className="text-sm font-mono">{model.load}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs font-bold uppercase tracking-wider">{model.status}</span>
                    </div>
                    <button id={`model-settings-${i}`} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Settings size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="card border-dashed">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[var(--fg)]/5 flex items-center justify-center mb-4">
                  <Zap size={24} className="opacity-20" />
                </div>
                <h3 className="font-bold mb-1">Add New Model Layer</h3>
                <p className="text-xs opacity-50 mb-4">Integrate custom PyTorch or TensorFlow weights into the hierarchy.</p>
                <button id="upload-model-btn" className="px-6 py-2 border border-[var(--border)] rounded-full text-xs font-bold hover:bg-[var(--fg)]/5 transition-colors">
                  Upload Model Artifacts
                </button>
              </div>
            </div>
          </div>
        );
      case 'schedule':
        return (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tighter">Daily Schedule</h2>
                <p className="text-sm opacity-50">Optimized flow based on your circadian rhythm</p>
              </div>
              <button 
                id="add-schedule-event-btn" 
                onClick={addScheduleEvent}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg text-sm font-bold flex items-center gap-2"
              >
                <Calendar size={16} />
                Add Event
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {schedule.map((event, i) => (
                <motion.div 
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card flex items-center gap-6 group hover:border-[var(--accent)] transition-all"
                >
                  <div className="text-center min-w-[80px]">
                    <div className="text-lg font-black tracking-tighter">{event.time.split(' ')[0]}</div>
                    <div className="text-[10px] uppercase opacity-40 font-bold">{event.time.split(' ')[1]}</div>
                  </div>
                  <div className={cn(
                    "w-1 h-12 rounded-full",
                    event.type === 'focus' ? "bg-[var(--accent)]" : 
                    event.type === 'break' ? "bg-blue-500" : "bg-purple-500"
                  )} />
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{event.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] px-2 py-0.5 bg-[var(--fg)]/5 rounded uppercase font-bold opacity-60">
                        {event.type}
                      </span>
                      <span className="text-[10px] opacity-40 flex items-center gap-1">
                        <Clock size={10} /> 45 mins
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button id={`edit-event-${event.id}`} className="p-2 hover:bg-[var(--fg)]/5 rounded-lg"><Settings size={16} /></button>
                    <button 
                      id={`delete-event-${event.id}`} 
                      onClick={() => deleteScheduleEvent(event.id)}
                      className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="card bg-[var(--accent)]/5 border-dashed border-[var(--accent)]/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--accent)]/20 rounded-2xl text-[var(--accent)]">
                  <Brain size={24} />
                </div>
                <div>
                  <h4 className="font-bold">AI Optimization Suggestion</h4>
                  <p className="text-xs opacity-70">Based on your focus patterns, moving your "Deep Work" session to 9:30 AM could increase productivity by 15%.</p>
                </div>
                <button 
                  id="apply-schedule-opt-btn" 
                  onClick={applyScheduleOptimization}
                  className="ml-auto px-4 py-2 bg-[var(--accent)] text-white rounded-xl text-xs font-bold"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold tracking-tighter">Settings</h2>
            
            <div className="space-y-6">
              <section className="card">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Palette size={18} className="text-[var(--accent)]" />
                  Appearance & Theme
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(['modern', 'technical', 'hardware', 'brutalist', 'minimal', 'organic', 'cyberpunk', 'paper'] as Theme[]).map((t) => (
                    <button
                      key={t}
                      id={`theme-select-${t}`}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all text-left group",
                        theme === t ? "border-[var(--accent)] bg-[var(--accent)]/5" : "border-[var(--border)] hover:border-[var(--fg)]/20"
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg mb-3 flex items-center justify-center text-white",
                        t === 'modern' ? "bg-cyan-500" :
                        t === 'cyberpunk' ? "bg-yellow-500" :
                        t === 'organic' ? "bg-pink-500" : "bg-gray-500"
                      )}>
                        <Palette size={16} />
                      </div>
                      <div className="text-xs font-bold capitalize">{t}</div>
                    </button>
                  ))}
                </div>
              </section>

              <section className="card">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Bell size={18} className="text-[var(--accent)]" />
                  Focus Alerts
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-[var(--fg)]/5 rounded-2xl border border-[var(--border)]">
                    <div>
                      <div className="font-bold text-sm">Distraction Alert Threshold</div>
                      <div className="text-xs opacity-50">How long to wait before alerting you</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="range" 
                        min="1" 
                        max="60" 
                        value={alertThreshold}
                        onChange={(e) => setAlertThreshold(Number(e.target.value))}
                        className="accent-[var(--accent)]"
                      />
                      <span className="font-mono font-bold text-[var(--accent)] w-12 text-right">{alertThreshold}m</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-[var(--fg)]/5 rounded-2xl border border-[var(--border)]">
                    <div>
                      <div className="font-bold text-sm">Auditory Feedback</div>
                      <div className="text-xs opacity-50">Play a beep when distracted</div>
                    </div>
                    <button 
                      id="toggle-audio-feedback" 
                      onClick={() => setAudioEnabled(!audioEnabled)}
                      className={cn(
                        "w-12 h-6 rounded-full relative transition-colors",
                        audioEnabled ? "bg-[var(--accent)]" : "bg-gray-400"
                      )}
                    >
                      <motion.div 
                        animate={{ x: audioEnabled ? 24 : 4 }}
                        className="absolute top-1 w-4 h-4 bg-white rounded-full" 
                      />
                    </button>
                  </div>
                </div>
              </section>

              <section className="card">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Shield size={18} className="text-[var(--accent)]" />
                  Privacy & Data
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Local Model Processing</span>
                    <span className="text-green-500 font-bold text-[10px] uppercase">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="opacity-70">Biometric Data Storage</span>
                    <span className="opacity-40 italic text-[10px] uppercase">Local Only</span>
                  </div>
                  <button 
                    id="clear-data-btn" 
                    onClick={handleClearData}
                    className="w-full mt-4 py-3 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all"
                  >
                    Clear All Local Data
                  </button>
                </div>
              </section>

              <div className="flex items-center justify-between p-6 bg-[var(--fg)]/5 rounded-3xl border border-[var(--border)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--accent)] flex items-center justify-center text-white font-black">
                    {userData?.name?.[0] || 'S'}
                  </div>
                  <div>
                    <div className="font-bold">{userData?.name || 'Shriyansh Mishra'}</div>
                    <div className="text-xs opacity-50">shriyanshmishra2006@gmail.com</div>
                  </div>
                </div>
                <button 
                  id="logout-settings-btn"
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        );
    }
  };

  if (authState === 'unauthenticated') {
    return <Auth onAuthSuccess={handleAuthSuccess} />;
  }

  if (authState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className={cn("min-h-screen flex transition-all duration-500", `theme-${theme}`)}>
      {/* Alert Flash Overlay */}
      <AnimatePresence>
        {isAlerting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="fixed inset-0 z-[9999] bg-red-600 pointer-events-none mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-[var(--card)] border-r border-[var(--border)] flex flex-col sticky top-0 h-screen z-50"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center text-white font-black italic">FB</div>
              <h1 className="text-xl font-black tracking-tighter">FocusBook</h1>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-[var(--fg)]/5 rounded-lg transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarItem icon={Newspaper} label="Personal News" active={activeTab === 'news'} onClick={() => setActiveTab('news')} />
          <SidebarItem icon={Shield} label="Focus Shield" active={activeTab === 'restrictions'} onClick={() => setActiveTab('restrictions')} />
          <SidebarItem icon={BarChart3} label="Reports" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          <SidebarItem icon={Calendar} label="Schedule" active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
          <SidebarItem icon={Brain} label="Model Hierarchy" active={activeTab === 'models'} onClick={() => setActiveTab('models')} />
          <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div className="p-4 border-t border-[var(--border)]">
          {isSidebarOpen && <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />}
          <div className="mt-4 flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500" />
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-bold truncate">Shriyansh Mishra</div>
                <div className="text-[10px] opacity-50 truncate">Pro Focus Member</div>
              </div>
            )}
            {isSidebarOpen && (
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-[var(--border)] bg-[var(--card)]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-bold opacity-60 uppercase tracking-widest">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[var(--fg)]/5 rounded-full border border-[var(--border)]">
              <Zap size={14} className="text-[var(--accent)]" />
              <span className="text-xs font-bold">Streak: 12 Days</span>
            </div>
            <div className="flex items-center gap-4">
              <Bell size={20} className="opacity-60 hover:opacity-100 cursor-pointer" />
              <div className="h-8 w-[1px] bg-[var(--border)]" />
              <div className="flex items-center gap-2">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold">
                    {currentTime.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-[10px] opacity-50 font-mono">
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[var(--fg)]/10 flex items-center justify-center">
                  <UserIcon size={18} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

