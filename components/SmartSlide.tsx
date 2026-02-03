import React from 'react';
import { ArrowUp, Sparkles, Map, Bell } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  onTourClick?: () => void;
}

export const SmartSlide: React.FC<Props> = ({ children, onTourClick }) => {
  return (
    <div className="relative z-10 mt-4 bg-slate-50 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] border-t border-slate-100 pb-24 min-h-screen">
        {/* HANDLE / HINT */}
        <div className="flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
        </div>
        
        <div className="px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest">
                <ArrowUp size={14} className="animate-bounce" /> Explore More
            </div>
            
            {onTourClick && (
                <button 
                    onClick={onTourClick}
                    className="flex items-center gap-2 bg-white border border-indigo-100 px-3 py-1.5 rounded-full shadow-sm hover:scale-105 transition-transform"
                >
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                    <span className="text-xs font-black text-indigo-600 flex items-center gap-1">
                        <Map size={12} /> AI Tour
                    </span>
                </button>
            )}
        </div>

        {/* CONTENT CONTAINER */}
        <div className="p-2 space-y-6">
            {children}
        </div>
    </div>
  );
};
