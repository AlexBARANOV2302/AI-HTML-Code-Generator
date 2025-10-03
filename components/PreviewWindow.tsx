
import React from 'react';

interface PreviewWindowProps {
  code: string;
}

export const PreviewWindow: React.FC<PreviewWindowProps> = ({ code }) => {
  if (!code) {
    return (
        <div className="h-full w-full flex items-center justify-center bg-white">
            <p className="text-gray-500">Preview will appear here</p>
        </div>
    );
  }

  return (
    <div className="h-full w-full bg-white">
      <iframe
        srcDoc={code}
        title="Preview"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};
