import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DropdownIcon from '../../public/dropdown.svg';
import PenIcon from '../../public/pen.svg';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import languages from '../../language/language.json'; // Import the JSON file

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [isCustomLanguage, setIsCustomLanguage] = useState(false);
  const [customLanguage, setCustomLanguage] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedTargetLanguage = loadFromLocalStorage('targetLanguage', 'en');
    const storedIsCustomLanguage = loadFromLocalStorage('isCustomLanguage', false);
    const storedCustomLanguage = loadFromLocalStorage('customLanguage', '');

    setTargetLanguage(storedTargetLanguage);
    setIsCustomLanguage(storedIsCustomLanguage);
    setCustomLanguage(storedCustomLanguage);

    if (storedIsCustomLanguage) {
      onLanguageChange(storedCustomLanguage);
    } else {
      onLanguageChange(storedTargetLanguage);
    }
  }, []);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setTargetLanguage(newLanguage);
    saveToLocalStorage('targetLanguage', newLanguage);
    onLanguageChange(newLanguage);
  };

  const handleCustomLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newLanguage = e.target.value;
    setCustomLanguage(newLanguage);
    saveToLocalStorage('customLanguage', newLanguage);
    onLanguageChange(newLanguage);
  };

  const toggleCustomLanguage = () => {
    const newIsCustomLanguage = !isCustomLanguage;
    setIsCustomLanguage(newIsCustomLanguage);
    saveToLocalStorage('isCustomLanguage', newIsCustomLanguage);
    
    if (newIsCustomLanguage) {
      onLanguageChange(customLanguage);
    } else {
      onLanguageChange(targetLanguage);
    }
  };

  if (!isClient) {
    return null; 
  }

  return (
    <div className="flex items-center gap-2">
      {isCustomLanguage ? (
        <input
          type="text"
          value={customLanguage}
          onChange={handleCustomLanguageChange}
          placeholder="Enter custom language"
          className="language-select flex-grow"
        />
      ) : (
        <select
          value={targetLanguage}
          onChange={handleLanguageChange}
          className="language-select flex-grow"
        >
          {languages.map((language, index) => (
            <option key={index} value={language}>
              {language}
            </option>
          ))}
        </select>
      )}
      <button
        onClick={toggleCustomLanguage}
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
  );
};

export default LanguageSelector;