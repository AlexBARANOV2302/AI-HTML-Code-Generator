
import React from 'react';
import { MIN_PROMPT_LENGTH } from '../constants';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

export const PromptInput: React.FC<PromptInputProps> = ({ prompt, setPrompt }) => {
  const chars = prompt.length;
  const charColor = chars < MIN_PROMPT_LENGTH ? 'text-red-400' : 'text-green-400';

  return (
    <div className="flex flex-col flex-grow">
      <label htmlFor="prompt" className="block text-lg font-semibold text-gray-300 mb-2">
        Describe the website you want to build
      </label>
      <div className="relative flex-grow">
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'Create a modern landing page for a SaaS product that specializes in project management. It should have a clean design, a hero section with a call-to-action button, a features grid, a pricing table, and a footer.'"
          className="w-full h-full p-4 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200 resize-none"
          rows={8}
        />
        <div className={`absolute bottom-3 right-3 text-sm font-mono ${charColor}`}>
          {chars} / {MIN_PROMPT_LENGTH}
        </div>
      </div>
    </div>
  );
};
