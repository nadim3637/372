import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer, CheckCircle } from 'lucide-react';
import { storage } from '../utils/storage';

interface Props {
  onComplete?: (duration: number) => void;
}

export const StudyTimer: React.FC<Props> = ({ onComplete }) => {
  const [goalMinutes, setGoalMinutes] = useState<number>(0); // 0 = No goal set
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isRunning, setIsRunning] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  
  // Persist timer state
  useEffect(() => {
    const loadState = async () => {
      // We use localStorage for synchronous UI init to avoid flicker, 
      // but we could sync with storage.ts if needed. 
      // For a timer, localStorage is usually fine, but let's check for active session.
      const saved = localStorage.getItem('nst_study_timer');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If it was running, calculate elapsed time
        if (parsed.isRunning && parsed.lastTick) {
            const now = Date.now();
            const elapsed = Math.floor((now - parsed.lastTick) / 1000);
            const newTimeLeft = Math.max(0, parsed.timeLeft - elapsed);
            setTimeLeft(newTimeLeft);
            setGoalMinutes(parsed.goalMinutes);
            setIsRunning(newTimeLeft > 0);
        } else {
            setGoalMinutes(parsed.goalMinutes);
            setTimeLeft(parsed.timeLeft);
            setIsRunning(parsed.isRunning);
        }
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    localStorage.setItem('nst_study_timer', JSON.stringify({
        goalMinutes,
        timeLeft,
        isRunning,
        lastTick: Date.now()
    }));
  }, [goalMinutes, timeLeft, isRunning]);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
            const next = prev - 1;
            if (next <= 0) {
                setIsRunning(false);
                if (onComplete) onComplete(goalMinutes * 60);
                // Play alarm or notify?
                return 0;
            }
            return next;
        });
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
        setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, goalMinutes, onComplete]);

  const setGoal = (minutes: number) => {
      setGoalMinutes(minutes);
      setTimeLeft(minutes * 60);
      setIsRunning(true);
      setShowCustom(false);
  };

  const handleCustomStart = () => {
      const mins = parseInt(customInput);
      if (mins > 0) setGoal(mins);
  };

  const formatTime = (seconds: number) => {
      const h = Math.floor(seconds / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      const s = seconds % 60;
      return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = goalMinutes > 0 ? ((goalMinutes * 60 - timeLeft) / (goalMinutes * 60)) * 100 : 0;
  const strokeDasharray = 2 * Math.PI * 45; // r=45
  const strokeDashoffset = strokeDasharray * ((100 - progress) / 100);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-slate-700">
        {/* BACKGROUND GLOW */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 flex justify-between items-center">
            <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-1">
                    <Timer size={16} className="text-yellow-400" /> Study Goal
                </h3>
                <h2 className="text-2xl font-black">
                    {timeLeft > 0 ? "Focus Mode On" : "Set Your Target"}
                </h2>
            </div>
            
            {/* LIVE PROGRESS RING */}
            {timeLeft > 0 && (
                <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="4" fill="transparent" />
                        <circle 
                            cx="32" cy="32" r="28" 
                            stroke="#eab308" strokeWidth="4" fill="transparent" 
                            strokeDasharray={2 * Math.PI * 28} 
                            strokeDashoffset={(2 * Math.PI * 28) * ((100 - progress) / 100)}
                            className="transition-all duration-1000 ease-linear"
                        />
                    </svg>
                    <div className="absolute text-[10px] font-bold">{Math.round(progress)}%</div>
                </div>
            )}
        </div>

        {timeLeft > 0 ? (
            <div className="mt-6 flex items-center justify-between bg-slate-800/50 p-4 rounded-2xl border border-slate-700 backdrop-blur-sm">
                <div className="font-mono text-4xl font-black tracking-wider text-white">
                    {formatTime(timeLeft)}
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => setIsRunning(!isRunning)}
                        className={`p-3 rounded-xl transition-all ${isRunning ? 'bg-yellow-500 text-black hover:bg-yellow-400' : 'bg-green-600 text-white hover:bg-green-500'}`}
                    >
                        {isRunning ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                    </button>
                    <button 
                        onClick={() => { setIsRunning(false); setTimeLeft(0); setGoalMinutes(0); }}
                        className="p-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-slate-300"
                    >
                        <RotateCcw size={24} />
                    </button>
                </div>
            </div>
        ) : (
            <div className="mt-6 space-y-3">
                <div className="flex gap-2">
                    {[15, 30, 60].map(m => (
                        <button 
                            key={m} 
                            onClick={() => setGoal(m)}
                            className="flex-1 py-3 bg-slate-800 hover:bg-indigo-600 hover:scale-105 border border-slate-700 hover:border-indigo-500 rounded-xl font-bold text-xs transition-all active:scale-95"
                        >
                            {m}m
                        </button>
                    ))}
                    <button 
                        onClick={() => setShowCustom(!showCustom)}
                        className={`px-4 py-3 rounded-xl font-bold text-xs border transition-all ${showCustom ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
                    >
                        Custom
                    </button>
                </div>
                
                {showCustom && (
                    <div className="flex gap-2 animate-in fade-in slide-in-from-top-2">
                        <input 
                            type="number" 
                            placeholder="Mins" 
                            value={customInput} 
                            onChange={e => setCustomInput(e.target.value)}
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 outline-none focus:border-indigo-500 text-white font-bold"
                        />
                        <button 
                            onClick={handleCustomStart}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold"
                        >
                            Start
                        </button>
                    </div>
                )}
            </div>
        )}
    </div>
  );
};
