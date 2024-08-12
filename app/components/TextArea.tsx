import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import CopyIcon from '../../public/copy.svg';
import CopiedIcon from '../../public/checkmark.svg';
import ClearIcon from '../../public/clear.svg';
import CleariedIcon from '../../public/checkmark.svg';

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
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (cleared) {
      const timer = setTimeout(() => setCleared(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [cleared]);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.scrollTop = 0;
    }
  }, [value]);

  const handleClear = () => {
    onClear();
    setCleared(true);
  };

  return (
    <div className="relative flex flex-col h-full rounded-lg overflow-hidden bg-gray-800">
        <textarea
          ref={textAreaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-text w-full h-full resize-none bg-transparent border-none focus:outline-none focus:ring-0"
          readOnly={readOnly}
        />
      <div className="bg-gradient-to-t from-gray-700 to-transparent h-8 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 right-0 bg-gray-700 p-2 flex justify-end gap-2">
        <button
          onClick={handleClear}
          className="p-2 bg-gray-600 hover:bg-gray-500 rounded-full transition-colors duration-200"
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
          className="p-2 bg-gray-600 hover:bg-gray-500 rounded-full transition-colors duration-200"
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