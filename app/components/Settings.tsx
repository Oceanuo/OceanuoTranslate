'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FiSettings } from 'react-icons/fi';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import VisibilityIcon from '../../public/Visibility.svg';
import VisibilityOffIcon from '../../public/VisibilityOff.svg';
import Image from 'next/image';
import DropdownIcon from '../../public/dropdown.svg';
import PenIcon from '../../public/pen.svg';
import groqModels from '../../models/groq.json';
import openaiModels from '../../models/openai.json';

const Settings = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('');
  const [theme, setTheme] = useState('system');
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    modelProvider: 'openai',
    apiKey: '',
    apiHost: 'https://api.openai.com/v1',
    model: '',
    temperature: 0.7,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
    systemPrompt: 'You are a professional, authentic machine translation engine.',
    theme: 'system',
  });
  const [tempSettings, setTempSettings] = useState({...settings});
  const [isCustomLanguage, setIsCustomLanguage] = useState(false);
  const [customLanguage, setCustomLanguage] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const apiEndpoint = `${tempSettings.apiHost}/chat/completions`;

  const getModelOptions = () => {
    return tempSettings.modelProvider === 'openai' ? openaiModels : groqModels;
  };

  useEffect(() => {
    const savedSettings = loadFromLocalStorage('settings', settings);
    setSettings(savedSettings);
    setTempSettings(savedSettings);
    setInputText(loadFromLocalStorage('inputText', ''));
    setOutputText(loadFromLocalStorage('outputText', ''));
    setTargetLanguage(loadFromLocalStorage('targetLanguage', ''));
    setTheme(savedSettings.theme);
    setIsCustomLanguage(loadFromLocalStorage('isCustomLanguage', false));
    setCustomLanguage(loadFromLocalStorage('customLanguage', ''));
    
    applyTheme(savedSettings.theme);
  }, []);

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim() || !settings.apiKey) return;

    const language = isCustomLanguage ? customLanguage : targetLanguage;
    setIsTranslating(true);
    setOutputText('Translating...');

    try {
      const response = await fetch(settings.apiHost + '/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            { role: "system", content: settings.systemPrompt },
            { role: "user", content: `Translate the following source text to ${language}, Output translation directly without any additional text.\nSource Text: ${inputText}\nTranslated Text:` }
          ],
          temperature: parseFloat(settings.temperature.toString()),
          top_p: parseFloat(settings.topP.toString()),
          presence_penalty: parseFloat(settings.presencePenalty.toString()),
          frequency_penalty: parseFloat(settings.frequencyPenalty.toString())
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.choices[0].message.content.trim();
      setOutputText(translatedText);
      saveToLocalStorage('outputText', translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      setOutputText('An error occurred during translation. Please check your settings and try again.');
    } finally {
      setIsTranslating(false);
    }
  }, [inputText, settings, isCustomLanguage, customLanguage, targetLanguage]);

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

  const toggleTheme = () => {
    const themes = ['light', 'dark', 'system'];
    const nextTheme = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(nextTheme);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempSettings((prev: typeof settings) => {
      const newSettings = { ...prev, [name]: value };
      if (name === 'modelProvider') {
        newSettings.apiHost = value === 'openai' ? 'https://api.openai.com/v1' : 'https://api.groq.com/openai/v1';
      }
      return newSettings;
    });
  };

  const saveSettings = () => {
    setSettings(tempSettings);
    applyTheme(tempSettings.theme);
    saveToLocalStorage('settings', tempSettings);
    console.log('Saving settings:', tempSettings);
    setShowSettings(false);
  };

  const cancelSettings = () => {
    setTempSettings({...settings});
    setShowSettings(false);
  };

  const restoreDefaultSettings = () => {
    const defaultSettings = {
      modelProvider: 'openai',
      apiKey: '',
      apiHost: 'https://api.openai.com/v1',
      model: '',
      temperature: 0.7,
      topP: 1,
      presencePenalty: 0,
      frequencyPenalty: 0,
      systemPrompt: 'You are a professional, authentic machine translation engine.',
      theme: 'system',
    };
    setTempSettings(defaultSettings);
  };

  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  return (
    <div className="translator">
      <div className="flex flex-col items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">FatherTranslator</h1>
        <button onClick={toggleSettings} className="settings-button w-full">
          <FiSettings />
          <span>Settings</span>
        </button>
      </div>
      {showSettings ? (
        <div className="settings-page">
          <h2>Settings</h2>
          <form className="flex flex-col h-full">
            <label>
              Theme:
              <select name="theme" value={tempSettings.theme} onChange={handleSettingsChange}>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </label>
            <label>
              Model Provider:
              <select name="modelProvider" value={tempSettings.modelProvider} onChange={handleSettingsChange}>
                <option value="openai">OpenAI</option>
                <option value="groq">Groq</option>
              </select>
            </label>
            <label>
              API Key:
              <div className="flex items-center">
                <input
                  type={showApiKey ? "text" : "password"}
                  name="apiKey"
                  value={tempSettings.apiKey}
                  onChange={handleSettingsChange}
                  className="flex-grow"
                />
                <button
                  type="button"
                  onClick={toggleApiKeyVisibility}
                  className="ml-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
                >
                  <Image
                    src={showApiKey ? VisibilityOffIcon : VisibilityIcon}
                    alt={showApiKey ? "Hide API Key" : "Show API Key"}
                    width={24}
                    height={24}
                  />
                </button>
              </div>
            </label>
            <label>
              API Host:
              <input
                type="text"
                name="apiHost"
                value={tempSettings.apiHost}
                onChange={handleSettingsChange}
                placeholder={tempSettings.modelProvider === 'openai' ? 'https://api.openai.com/v1' : 'https://api.groq.com/openai/v1'}
              />
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Full API Endpoint: {apiEndpoint}
            </p>
            <label>
              Model:
              <select name="model" value={tempSettings.model} onChange={handleSettingsChange}>
                {getModelOptions().map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Temperature:
              <input type="number" name="temperature" value={tempSettings.temperature} onChange={handleSettingsChange} step="0.1" min="0" max="1" />
            </label>
            <label>
              Top P:
              <input type="number" name="topP" value={tempSettings.topP} onChange={handleSettingsChange} step="0.1" min="0" max="1" />
            </label>
            <label>
              Presence Penalty:
              <input type="number" name="presencePenalty" value={tempSettings.presencePenalty} onChange={handleSettingsChange} step="0.1" min="0" max="1" />
            </label>
            <label>
              Frequency Penalty:
              <input type="number" name="frequencyPenalty" value={tempSettings.frequencyPenalty} onChange={handleSettingsChange} step="0.1" min="0" max="1" />
            </label>
            <label>
              System Prompt:
              <textarea name="systemPrompt" value={tempSettings.systemPrompt} onChange={handleSettingsChange} rows={3} />
            </label>
            <div className="settings-buttons mt-auto">
              <button type="button" onClick={saveSettings} className="btn btn-primary">Save</button>
              <button type="button" onClick={cancelSettings} className="btn btn-secondary">Cancel</button>
              <button type="button" onClick={restoreDefaultSettings} className="btn btn-tertiary">Restore Defaults</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="flex flex-col flex-grow gap-6">
          <textarea
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              saveToLocalStorage('inputText', e.target.value);
            }}
            placeholder="Enter text to translate"
            className="input-text"
          />
          <div className="flex items-center gap-2">
            {isCustomLanguage ? (
              <input
                type="text"
                value={customLanguage}
                onChange={(e) => {
                  setCustomLanguage(e.target.value);
                  saveToLocalStorage('customLanguage', e.target.value);
                }}
                placeholder="Enter custom language"
                className="language-select flex-grow"
              />
            ) : (
              <select
                value={targetLanguage}
                onChange={(e) => {
                  setTargetLanguage(e.target.value);
                  saveToLocalStorage('targetLanguage', e.target.value);
                }}
                className="language-select flex-grow"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
                <option value="ms">Bahasa Malaysia</option>
              </select>
            )}
            <button
              onClick={() => {
                setIsCustomLanguage(!isCustomLanguage);
                saveToLocalStorage('isCustomLanguage', !isCustomLanguage);
              }}
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
            >
              <Image
                src={isCustomLanguage ? DropdownIcon : PenIcon}
                alt={isCustomLanguage ? "Select language" : "Custom language"}
                width={24}
                height={24}
              />
            </button>
          </div>
          <button 
            onClick={handleTranslate} 
            className="translate-button" 
            disabled={isTranslating || !inputText.trim() || !settings.apiKey}
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
          <textarea
            value={outputText}
            readOnly
            placeholder="Translation will appear here"
            className="output-text"
          />
        </div>
      )}
    </div>
  );
};

export default Settings;