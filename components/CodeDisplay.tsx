
import React, { useState } from 'react';

interface CodeDisplayProps {
  code: string;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({ code }) => {
  const [buttonText, setButtonText] = useState('Copy Code');

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setButtonText('Copied!');
      setTimeout(() => setButtonText('Copy Code'), 2000);
    }
  };

  if (!code) return null;

  return (
    <div className="h-full w-full bg-gray-900 relative">
       <button
        onClick={handleCopy}
        className="absolute top-3 right-3 bg-gray-700 hover:bg-cyan-500 text-white text-sm font-semibold py-1 px-3 rounded-md transition-colors z-10"
      >
        {buttonText}
      </button>
      <pre className="h-full w-full overflow-auto p-4 text-sm text-gray-200">
        <code className="language-html">{code}</code>
      </pre>
    </div>
  );
};
