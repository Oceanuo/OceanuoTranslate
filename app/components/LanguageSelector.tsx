import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import DropdownIcon from '../../public/dropdown.svg';
import PenIcon from '../../public/pen.svg';
import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onLanguageChange }) => {
  const [targetLanguage, setTargetLanguage] = useState(loadFromLocalStorage('targetLanguage', 'en'));
  const [isCustomLanguage, setIsCustomLanguage] = useState(loadFromLocalStorage('isCustomLanguage', false));
  const [customLanguage, setCustomLanguage] = useState(loadFromLocalStorage('customLanguage', ''));

  useEffect(() => {
    onLanguageChange(targetLanguage);
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
    setIsCustomLanguage(!isCustomLanguage);
    saveToLocalStorage('isCustomLanguage', !isCustomLanguage);
  };

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
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
          <option value="ms">Bahasa Malaysia</option>
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