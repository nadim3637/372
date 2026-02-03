import { useState, useEffect, useRef, useCallback } from 'react';
import { storage } from '../utils/storage';

export interface AudioConfig {
  enabled: boolean;
  voiceURI: string | null;
  volume: number;
  rate: number;
}

const DEFAULT_CONFIG: AudioConfig = {
  enabled: true,
  voiceURI: null,
  volume: 1,
  rate: 1
};

export const useInteractiveAudio = () => {
  const [config, setConfig] = useState<AudioConfig>(DEFAULT_CONFIG);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const synth = window.speechSynthesis;

  // Load config on mount
  useEffect(() => {
    const loadConfig = async () => {
      const stored = localStorage.getItem('nst_audio_config');
      if (stored) {
        setConfig(JSON.parse(stored));
      }
    };
    loadConfig();

    // Load voices
    const loadVoices = () => {
      const voices = synth.getVoices();
      setAvailableVoices(voices);
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  const saveConfig = (newConfig: AudioConfig) => {
    setConfig(newConfig);
    localStorage.setItem('nst_audio_config', JSON.stringify(newConfig));
  };

  const toggleAudio = () => {
    saveConfig({ ...config, enabled: !config.enabled });
  };

  const setVoice = (voiceURI: string) => {
    saveConfig({ ...config, voiceURI });
  };

  const playText = useCallback((text: string, force: boolean = false) => {
    if ((!config.enabled && !force) || !text) return;

    // Cancel current speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = config.volume;
    utterance.rate = config.rate;

    if (config.voiceURI) {
      const voice = availableVoices.find(v => v.voiceURI === config.voiceURI);
      if (voice) utterance.voice = voice;
    } else {
        // Prefer Indian English or Hindi if available and no preference
        const indianVoice = availableVoices.find(v => v.lang === 'en-IN' || v.lang === 'hi-IN');
        if (indianVoice) utterance.voice = indianVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.speak(utterance);
  }, [config, availableVoices]);

  const playButtonAudio = useCallback(async (buttonId: string, defaultText: string) => {
    if (!config.enabled) return;

    // Check for Admin Override script
    // We assume admin scripts are stored in 'nst_admin_voice_scripts' in storage
    // Format: { [buttonId]: "Script text" }
    let textToPlay = defaultText;
    
    try {
        const scripts = await storage.getItem<Record<string, string>>('nst_admin_voice_scripts');
        if (scripts && scripts[buttonId]) {
            textToPlay = scripts[buttonId];
        }
    } catch (e) {
        console.error("Failed to load voice script", e);
    }

    playText(textToPlay);
  }, [config.enabled, playText]);

  const stopAudio = () => {
      synth.cancel();
      setIsSpeaking(false);
  };

  return {
    isAudioEnabled: config.enabled,
    toggleAudio,
    playText,
    playButtonAudio,
    stopAudio,
    isSpeaking,
    availableVoices,
    setVoice,
    currentVoiceURI: config.voiceURI
  };
};
