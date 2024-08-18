'use client';

import React, { useState, useEffect } from 'react';
import { FiSettings } from 'react-icons/fi';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import SettingsForm from '../components/SettingsForm';
import TranslationInterface from '../components/TranslationInterface';

const Settings = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    modelProvider: 'openai',
    model: 'gpt-4o-mini-2024-07-18',
    apiKey: '',
    apiHost: 'https://api.openai.com/v1',
    temperature: 0.7,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
    systemPrompt: 'You are a professional, authentic machine translation engine.',
    theme: 'system',
  });

  useEffect(() => {
    const savedSettings = loadFromLocalStorage('settings', settings);
    setSettings(savedSettings);
    applyTheme(savedSettings.theme);
  }, []); 

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const applyTheme = (selectedTheme: string) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (selectedTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(selectedTheme);
    }
  };

  return (
    <div className="translator flex flex-col h-screen">
      <div className="flex flex-col items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">FatherTranslator</h1>
        <button onClick={toggleSettings} className="settings-button w-full">
          <FiSettings />
          <span>Settings</span>
        </button>
      </div>
      {showSettings ? (
        <SettingsForm
          settings={settings}
          setSettings={setSettings}
          applyTheme={applyTheme}
          closeSettings={() => setShowSettings(false)}
        />
      ) : (
        <TranslationInterface settings={settings} />
      )}
    </div>
  );
};

export default Settings;