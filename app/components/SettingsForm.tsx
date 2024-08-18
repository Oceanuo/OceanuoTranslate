import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import VisibilityIcon from '../../public/Visibility.svg';
import VisibilityOffIcon from '../../public/VisibilityOff.svg';
import groqModels from '../../public/models/groq.json';
import openaiModels from '../../public/models/openai.json';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage'; 
import PenIcon from '../../public/pen.svg';
import DropdownIcon from '../../public/dropdown.svg';

interface SettingsFormProps {
  settings: any;
  setSettings: (settings: any) => void;
  applyTheme: (theme: string) => void;
  closeSettings: () => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ settings, setSettings, applyTheme, closeSettings }) => {
  const [tempSettings, setTempSettings] = useState(() => {
    const savedSettings = loadFromLocalStorage('settings', settings);
    return {
      ...savedSettings,
      modelProvider: savedSettings.modelProvider || 'openai',
      model: savedSettings.model || 'gpt-4o-mini-2024-07-18',
    };
  });
  const [showApiKey, setShowApiKey] = useState(false);
  const [isModelEditable, setIsModelEditable] = useState(() => {
    return loadFromLocalStorage('isModelEditable', false);
  });

  const apiEndpoint = `${tempSettings.apiHost}/chat/completions`;

  const getModelOptions = () => {
    return tempSettings.modelProvider === 'openai' ? openaiModels : groqModels;
  };

  useEffect(() => {
    // Apply the loaded settings
    setSettings(tempSettings);
    applyTheme(tempSettings.theme);
  }, [applyTheme, setSettings, tempSettings]);

  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempSettings((prev: typeof tempSettings) => {
      const newSettings = { ...prev, [name]: value };
      if (name === 'modelProvider') {
        newSettings.apiHost = value === 'openai' ? 'https://api.openai.com/v1' : 'https://api.groq.com/openai/v1';
        newSettings.model = value === 'openai' ? openaiModels[0] : groqModels[0];
        setIsModelEditable(false);
      }
      if (name === 'model' && !getModelOptions().includes(value)) {
        setIsModelEditable(true);
      }
      return newSettings;
    });
  };

  const toggleModelInput = () => {
    setIsModelEditable((prev: boolean) => {
      if (prev) {
        const currentOptions = getModelOptions();
        if (!currentOptions.includes(tempSettings.model)) {
          setTempSettings((prev: typeof tempSettings) => ({
            ...prev,
            model: currentOptions[0],
          }));
        }
      }
      return !prev;
    });
  };

  const saveSettings = () => {
    setSettings(tempSettings);
    applyTheme(tempSettings.theme);
    saveToLocalStorage('settings', tempSettings);
    saveToLocalStorage('isModelEditable', isModelEditable);
    closeSettings();
  };

  const cancelSettings = () => {
    closeSettings();
  };

  const restoreDefaultSettings = () => {
    const defaultSettings = {
      modelProvider: 'openai',
      model: 'gpt-4o-mini-2024-07-18',
      apiKey: '',
      apiHost: 'https://api.openai.com/v1',
      temperature: 0,
      topP: 0,
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
            <option value="groq">GROQ</option>
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
          <div className="flex items-center">
            {isModelEditable ? (
              <input
                type="text"
                name="model"
                value={tempSettings.model}
                onChange={handleSettingsChange}
                className="flex-grow"
              />
            ) : (
              <select
                name="model"
                value={tempSettings.model}
                onChange={handleSettingsChange}
                className="flex-grow"
              >
                {getModelOptions().map((model) => (
                  <option key={model} value={model}>
                    {model}
                  </option>
                ))}
              </select>
            )}
            <button
              type="button"
              onClick={toggleModelInput}
              className="ml-2 p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
            >
              <Image
                src={isModelEditable ? DropdownIcon : PenIcon}
                alt={isModelEditable ? "Show Dropdown" : "Edit Model"}
                width={20}
                height={20}
              />
            </button>
          </div>
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
  );
};

export default SettingsForm;