import React from 'react';
import { Users, BookOpen, BrainCircuit, Banknote, Settings, BarChart3, Shield, FileText, Video, HelpCircle, Gift, Database, Activity, Megaphone, Key, Trash2, Mic, Globe, Lock, Bell, AlertTriangle } from 'lucide-react';

interface Props {
  onNavigate: (tab: string) => void;
  stats: {
    users: number;
    subAdmins: number;
    demands: number;
    pendingLogins: number;
  };
}

const ZoneCard = ({ title, icon: Icon, color, children }: any) => (
    <div className={`p-4 rounded-3xl border-2 ${color} h-full`}>
        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-black/5">
            <div className="p-2 bg-white rounded-xl shadow-sm"><Icon size={20} /></div>
            <h3 className="font-black text-slate-800 uppercase tracking-wider text-sm">{title}</h3>
        </div>
        <div className="space-y-2">
            {children}
        </div>
    </div>
);

const ZoneButton = ({ label, icon: Icon, onClick, count }: any) => (
    <button onClick={onClick} className="w-full bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 flex items-center justify-between group transition-all">
        <div className="flex items-center gap-3">
            <Icon size={16} className="text-slate-400 group-hover:text-slate-600" />
            <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900">{label}</span>
        </div>
        {count !== undefined && (
            <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full group-hover:bg-slate-800 group-hover:text-white transition-colors">{count}</span>
        )}
    </button>
);

export const AdminHome: React.FC<Props> = ({ onNavigate, stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in">
        {/* ZONE 1: USERS & ACCESS */}
        <ZoneCard title="Users & Access" icon={Users} color="bg-blue-50 border-blue-100 text-blue-600">
            <ZoneButton label="All Users / Students" icon={Users} onClick={() => onNavigate('USERS')} count={stats.users} />
            <ZoneButton label="Sub-Admin Manager" icon={Shield} onClick={() => onNavigate('SUB_ADMINS')} count={stats.subAdmins} />
            <ZoneButton label="Access Requests" icon={Key} onClick={() => onNavigate('ACCESS')} count={stats.pendingLogins} />
            <ZoneButton label="Content Demands" icon={Megaphone} onClick={() => onNavigate('DEMAND')} count={stats.demands} />
        </ZoneCard>

        {/* ZONE 2: CONTENT FACTORY */}
        <ZoneCard title="Content Factory" icon={BookOpen} color="bg-emerald-50 border-emerald-100 text-emerald-600">
            <ZoneButton label="Subject Manager" icon={BookOpen} onClick={() => onNavigate('SUBJECTS_MGR')} />
            <ZoneButton label="Syllabus & Chapters" icon={FileText} onClick={() => onNavigate('SYLLABUS_MANAGER')} />
            <ZoneButton label="PDF Notes Manager" icon={FileText} onClick={() => onNavigate('CONTENT_PDF')} />
            <ZoneButton label="Video Lectures" icon={Video} onClick={() => onNavigate('CONTENT_VIDEO')} />
            <ZoneButton label="MCQ & Tests" icon={HelpCircle} onClick={() => onNavigate('CONTENT_MCQ')} />
            <ZoneButton label="Universal Playlist" icon={Globe} onClick={() => onNavigate('UNIVERSAL_PLAYLIST')} />
        </ZoneCard>

        {/* ZONE 3: AI & AUTOMATION */}
        <ZoneCard title="AI & Automation" icon={BrainCircuit} color="bg-purple-50 border-purple-100 text-purple-600">
            <ZoneButton label="Global AI Modes" icon={BrainCircuit} onClick={() => onNavigate('APP_MODES')} />
            <ZoneButton label="AI Configuration" icon={Settings} onClick={() => onNavigate('CONFIG_AI')} />
            <ZoneButton label="Universal AI Logs" icon={Activity} onClick={() => onNavigate('UNIVERSAL_AI_QA')} />
            <ZoneButton label="Bilingual Logic" icon={Globe} onClick={() => alert("Managed automatically in AI Config.")} />
        </ZoneCard>

        {/* ZONE 4: MONETIZATION */}
        <ZoneCard title="Monetization" icon={Banknote} color="bg-yellow-50 border-yellow-100 text-yellow-600">
            <ZoneButton label="Subscription Plans" icon={Banknote} onClick={() => onNavigate('PRICING_MGMT')} />
            <ZoneButton label="User Subscriptions" icon={Users} onClick={() => onNavigate('SUBSCRIPTION_MANAGER')} />
            <ZoneButton label="Gift Codes" icon={Gift} onClick={() => onNavigate('CODES')} />
            <ZoneButton label="Config Features" icon={Lock} onClick={() => onNavigate('CONFIG_FEATURES')} />
        </ZoneCard>

        {/* ZONE 5: SYSTEM CONTROL */}
        <ZoneCard title="System Control" icon={Settings} color="bg-slate-50 border-slate-200 text-slate-600">
            <ZoneButton label="System Settings" icon={Settings} onClick={() => onNavigate('CONFIG_GENERAL')} />
            <ZoneButton label="Voice Manager" icon={Mic} onClick={() => onNavigate('VOICE_MANAGER')} />
            <ZoneButton label="System Control" icon={AlertTriangle} onClick={() => onNavigate('SYSTEM_CONTROL')} />
            <ZoneButton label="Database View" icon={Database} onClick={() => onNavigate('DATABASE')} />
            <ZoneButton label="Recycle Bin" icon={Trash2} onClick={() => onNavigate('RECYCLE')} />
        </ZoneCard>

        {/* ZONE 6: ANALYTICS */}
        <ZoneCard title="Analytics & Logs" icon={BarChart3} color="bg-pink-50 border-pink-100 text-pink-600">
            <ZoneButton label="Universal Analysis" icon={BarChart3} onClick={() => onNavigate('UNIVERSAL_ANALYSIS')} />
            <ZoneButton label="Activity Logs" icon={Activity} onClick={() => onNavigate('LOGS')} />
            <ZoneButton label="Leaderboard" icon={BarChart3} onClick={() => onNavigate('LEADERBOARD')} />
        </ZoneCard>
    </div>
  );
};
