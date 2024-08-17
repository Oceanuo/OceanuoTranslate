import React from 'react';
import Image from 'next/image';
import CopyIcon from '../../public/copy.svg';
import CopiedIcon from '../../public/checkmark.svg';
import ClearIcon from '../../public/clear.svg';
import CleariedIcon from '../../public/checkmark.svg';

interface ToolBarProps {
  onCopy: () => void;
  onClear: () => void;
  copied: boolean;
  cleared: boolean;
}

const ToolBar: React.FC<ToolBarProps> = ({ onCopy, onClear, copied, cleared }) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-2 flex flex-col justify-start gap-2 h-full">
      <button
        onClick={onCopy}
        className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-full transition-colors duration-200"
        title="Copy text"
      >
        <Image
          src={copied ? CopiedIcon : CopyIcon}
          alt={copied ? "Copied" : "Copy"}
          width={20}
          height={20}
        />
      </button>
      <button
        onClick={onClear}
        className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 rounded-full transition-colors duration-200"
        title="Clear text"
      >
        <Image
          src={cleared ? CleariedIcon : ClearIcon}
          alt={cleared ? "Cleared" : "Clear"}
          width={20}
          height={20}
        />
      </button>
    </div>
  );
};

export default ToolBar;