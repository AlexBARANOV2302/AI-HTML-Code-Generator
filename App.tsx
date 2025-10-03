
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PromptInput } from './components/PromptInput';
import { CodeDisplay } from './components/CodeDisplay';
import { PreviewWindow } from './components/PreviewWindow';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateHtmlFromImageAndPrompt } from './services/geminiService';
import { Toast } from './components/Toast';
import type { ViewMode } from './types';
import { MIN_PROMPT_LENGTH } from './constants';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('code');

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read the image file. Please try another one.');
    }
    reader.readAsDataURL(file);
  };

  const handleImageClear = () => {
    setUploadedImage(null);
  };

  const handleGenerate = useCallback(async () => {
    if (prompt.trim().length < MIN_PROMPT_LENGTH) {
      setError(`Please provide a more detailed prompt (at least ${MIN_PROMPT_LENGTH} characters).`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedCode('');

    try {
      let imageData: string | null = null;
      let mimeType: string | null = null;

      if (uploadedImage) {
        imageData = uploadedImage.split(',')[1];
        mimeType = uploadedImage.split(';')[0].split(':')[1];
      }
      
      const code = await generateHtmlFromImageAndPrompt(imageData, mimeType, prompt);
      setGeneratedCode(code);
      setViewMode('preview');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [uploadedImage, prompt]);
  
  const isGenerateButtonDisabled = isLoading || prompt.trim().length < MIN_PROMPT_LENGTH;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-900 text-gray-100">
      <Header />
      <main className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 lg:p-6 h-[calc(100vh-80px)]">
        {/* Left Panel: Inputs */}
        <div className="flex flex-col bg-gray-800 rounded-lg shadow-2xl p-6 overflow-y-auto">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">1. Provide Inputs</h2>
          <div className="flex-grow flex flex-col gap-6">
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              uploadedImage={uploadedImage} 
              onClearImage={handleImageClear}
            />
            <PromptInput prompt={prompt} setPrompt={setPrompt} />
          </div>
           <button
            onClick={handleGenerate}
            disabled={isGenerateButtonDisabled}
            className={`mt-6 w-full py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out flex items-center justify-center gap-2 ${
              isGenerateButtonDisabled
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-cyan-500 hover:bg-cyan-400 text-white shadow-lg hover:shadow-cyan-500/50 transform hover:-translate-y-1'
            }`}
          >
            {isLoading ? <LoadingSpinner /> : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                Generate Code
              </>
            )}
          </button>
        </div>

        {/* Right Panel: Outputs */}
        <div className="flex flex-col bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
          <div className="flex-shrink-0 p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-cyan-400">2. Review Output</h2>
              <div className="flex space-x-2 bg-gray-700 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode('code')}
                  className={`px-4 py-1 rounded-md text-sm font-medium transition ${viewMode === 'code' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                >
                  Code
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-4 py-1 rounded-md text-sm font-medium transition ${viewMode === 'preview' ? 'bg-cyan-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>
          <div className="flex-grow relative">
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-80 z-10">
                <LoadingSpinner />
                <p className="mt-4 text-lg text-cyan-300">Analyzing inputs and generating code...</p>
              </div>
            )}
            {!isLoading && !generatedCode && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-400 text-lg">Your generated code will appear here.</p>
              </div>
            )}
            {viewMode === 'code' ? (
              <CodeDisplay code={generatedCode} />
            ) : (
              <PreviewWindow code={generatedCode} />
            )}
          </div>
        </div>
      </main>
      {error && <Toast message={error} onClose={() => setError(null)} />}
    </div>
  );
};

export default App;
