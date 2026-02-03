import React, { useState } from 'react';
import { AlertTriangle, Trash2, Mic, Save, HardDrive } from 'lucide-react';
import { storage } from '../../utils/storage';
import { SystemSettings } from '../../types';

interface Props {
  settings: SystemSettings;
  onUpdateSettings: (s: SystemSettings) => void;
}

export const SystemControl: React.FC<Props> = ({ settings, onUpdateSettings }) => {
  const [deleteClassInput, setDeleteClassInput] = useState('');
  const [welcomeMsg, setWelcomeMsg] = useState(settings.welcomeAudioMessage || "Welcome to Ideal Inspiration Classes. Please login to continue.");

  const handleSaveWelcome = () => {
      onUpdateSettings({ ...settings, welcomeAudioMessage: welcomeMsg });
      alert("Welcome Audio Message Saved!");
  };

  const handleMasterCleanup = async () => {
      if (confirm("⚠️ DANGER: This will delete ALL local data (Users, Cache, Settings). Are you sure?")) {
          if (confirm("Double Check: This cannot be undone. Proceed?")) {
              await storage.clear();
              localStorage.clear();
              window.location.reload();
          }
      }
  };

  const handleDeleteClass = async () => {
      if (!deleteClassInput) return;
      if (confirm(`Delete ALL data for Class ${deleteClassInput}?`)) {
          // Iterate storage keys
          const keys = await storage.keys();
          let count = 0;
          for (const key of keys) {
              if (key.includes(`_${deleteClassInput}_`) || key.includes(`-${deleteClassInput}-`)) {
                  await storage.removeItem(key);
                  count++;
              }
          }
          alert(`Cleanup Complete: Removed ${count} items for Class ${deleteClassInput}.`);
      }
  };

  return (
    <div className="space-y-6">
        {/* WELCOME AUDIO */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Mic size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-800">Welcome Audio</h3>
                    <p className="text-sm text-slate-500">Message spoken on the Login Screen.</p>
                </div>
            </div>
            
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={welcomeMsg} 
                    onChange={e => setWelcomeMsg(e.target.value)} 
                    className="flex-1 p-3 border border-slate-200 rounded-xl font-medium text-slate-700"
                    placeholder="Enter welcome message..."
                />
                <button 
                    onClick={handleSaveWelcome}
                    className="bg-blue-600 text-white px-6 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700"
                >
                    <Save size={18} /> Save
                </button>
            </div>
        </div>

        {/* MASTER CLEANUP */}
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center animate-pulse">
                    <AlertTriangle size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-red-800">Master Cleanup</h3>
                    <p className="text-sm text-red-600">Danger Zone: Irreversible Data Deletion.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* DELETE ALL */}
                <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-2">Factory Reset</h4>
                    <p className="text-xs text-slate-500 mb-4">Clears all LocalStorage and Cache. Simulates a fresh install.</p>
                    <button 
                        onClick={handleMasterCleanup}
                        className="w-full py-3 bg-red-600 text-white font-bold rounded-xl shadow hover:bg-red-700 flex items-center justify-center gap-2"
                    >
                        <HardDrive size={18} /> Delete All Data
                    </button>
                </div>

                {/* DELETE CLASS */}
                <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                    <h4 className="font-bold text-slate-800 mb-2">Class Cleanup</h4>
                    <p className="text-xs text-slate-500 mb-4">Removes cached content for a specific class.</p>
                    <div className="flex gap-2">
                        <select 
                            value={deleteClassInput} 
                            onChange={e => setDeleteClassInput(e.target.value)}
                            className="flex-1 p-2 border border-slate-200 rounded-lg text-sm font-bold"
                        >
                            <option value="">Select Class</option>
                            {['6','7','8','9','10','11','12','COMPETITION'].map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button 
                            onClick={handleDeleteClass}
                            disabled={!deleteClassInput}
                            className="px-4 bg-red-100 text-red-600 font-bold rounded-lg hover:bg-red-200 disabled:opacity-50"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};
