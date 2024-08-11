import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CopyIcon from '../../public/copy.svg';
import CopiedIcon from '../../public/copied.svg';
import ClearIcon from '../../public/clear.svg';
import CleariedIcon from '../../public/clearied.svg';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  onCopy: () => void;
  onClear: () => void;
  copied: boolean;
  readOnly?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  onCopy,
  onClear,
  copied,
  readOnly = false
}) => {
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    if (cleared) {
      const timer = setTimeout(() => setCleared(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [cleared]);

  const handleClear = () => {
    onClear();
    setCleared(true);
  };

  return (
    <div className="relative flex-grow">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-text w-full h-full resize-none"
        readOnly={readOnly}
      />
      <div className="absolute top-2 right-2 flex gap-2">
        <button
          onClick={handleClear}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
          title="Clear text"
        >
          <Image
            src={cleared ? CleariedIcon : ClearIcon}
            alt={cleared ? "Cleared" : "Clear"}
            width={20}
            height={20}
          />
        </button>
        <button
          onClick={onCopy}
          className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full"
          title="Copy text"
        >
          <Image
            src={copied ? CopiedIcon : CopyIcon}
            alt={copied ? "Copied" : "Copy"}
            width={20}
            height={20}
          />
        </button>
      </div>
    </div>
  );
};

export default TextArea;