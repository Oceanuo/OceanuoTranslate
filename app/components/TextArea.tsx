import React, { useState, useEffect, useRef } from 'react';
import ToolBar from './ToolBar';

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
    <div className="flex h-full rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
      <textarea
        ref={textAreaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-grow w-full resize-none bg-white dark:bg-gray-800 border-none focus:outline-none focus:ring-0 p-4 text-black dark:text-white"
        readOnly={readOnly}
      />
      <ToolBar
        onCopy={onCopy}
        onClear={handleClear}
        copied={copied}
        cleared={cleared}
      />
    </div>
  );
};

export default TextArea;