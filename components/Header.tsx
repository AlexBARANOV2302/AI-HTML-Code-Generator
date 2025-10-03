
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex-shrink-0 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-4 lg:px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3">
           <div className="w-10 h-10 bg-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
           </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">AI HTML Code Generator</h1>
        </div>
        <div className="text-sm text-gray-400">Powered by Gemini</div>
      </div>
    </header>
  );
};
