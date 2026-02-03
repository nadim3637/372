import React, { useState, useEffect } from 'react';
import { Save, Volume2, Play } from 'lucide-react';
import { storage } from '../../utils/storage';

const DEFAULT_BUTTONS = [
    { id: 'nav_home', label: 'Home Tab', defaultScript: 'Go to your home dashboard.' },
    { id: 'nav_videos', label: 'Videos Tab', defaultScript: 'Watch video lectures.' },
    { id: 'nav_courses', label: 'Courses Tab', defaultScript: 'Browse your courses and subjects.' },
    { id: 'nav_store', label: 'Store Tab', defaultScript: 'Buy premium subscriptions.' },
    { id: 'nav_profile', label: 'Profile Tab', defaultScript: 'View your profile and stats.' },
    { id: 'ai_tutor_hero', label: 'AI Tutor Hero', defaultScript: 'I am your personal AI Tutor. Ask me anything!' },
    { id: 'ai_tour', label: 'AI Tour Button', defaultScript: 'Welcome to the AI Tour. Let me show you around.' },
    { id: 'game', label: 'Game Button', defaultScript: 'Play Spin Wheel and win coins.' },
    { id: 'inbox', label: 'Inbox Button', defaultScript: 'Check your messages from admin.' },
];

export const VoiceManager: React.FC = () => {
    const [scripts, setScripts] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const stored = await storage.getItem<Record<string, string>>('nst_admin_voice_scripts');
            if (stored) setScripts(stored);
            setLoading(false);
        };
        load();
    }, []);

    const handleSave = async () => {
        await storage.setItem('nst_admin_voice_scripts', scripts);
        alert("Voice Scripts Saved!");
    };

    const handlePreview = (text: string) => {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utt);
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
                        <Volume2 size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-800">Voice Manager</h3>
                        <p className="text-sm text-slate-500">Configure TTS scripts for interactive buttons.</p>
                    </div>
                </div>
                <button 
                    onClick={handleSave}
                    className="bg-pink-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-pink-700 shadow-lg"
                >
                    <Save size={18} /> Save All
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-xs">
                        <tr>
                            <th className="p-4 rounded-tl-xl">Button / Feature</th>
                            <th className="p-4">Script (Text-to-Speech)</th>
                            <th className="p-4 rounded-tr-xl w-24">Preview</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {DEFAULT_BUTTONS.map((btn) => (
                            <tr key={btn.id} className="hover:bg-slate-50">
                                <td className="p-4">
                                    <p className="font-bold text-slate-700">{btn.label}</p>
                                    <p className="text-[10px] font-mono text-slate-400">{btn.id}</p>
                                </td>
                                <td className="p-4">
                                    <input 
                                        type="text" 
                                        className="w-full p-3 border border-slate-200 rounded-lg text-slate-700 focus:border-pink-400 outline-none font-medium"
                                        placeholder={btn.defaultScript}
                                        value={scripts[btn.id] || ''}
                                        onChange={(e) => setScripts({...scripts, [btn.id]: e.target.value})}
                                    />
                                </td>
                                <td className="p-4 text-center">
                                    <button 
                                        onClick={() => handlePreview(scripts[btn.id] || btn.defaultScript)}
                                        className="p-2 bg-slate-200 hover:bg-pink-100 hover:text-pink-600 rounded-full transition-colors"
                                    >
                                        <Play size={16} fill="currentColor" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
