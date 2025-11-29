import React, { useState } from 'react';
import { InputSection } from './components/InputSection';
import { OutputSection } from './components/OutputSection';
import { ClientInputData, GeneratedPromptResult } from './types';
import { generateRefinedPrompt } from './services/geminiService';
import { BrainCircuit, PenTool, LayoutTemplate } from 'lucide-react';

const App: React.FC = () => {
  const [result, setResult] = useState<GeneratedPromptResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Mobile tab state: 'input' or 'output'
  const [activeTab, setActiveTab] = useState<'input' | 'output'>('input');

  const handleGenerate = async (data: ClientInputData) => {
    setIsLoading(true);
    setError(null);
    try {
      const generated = await generateRefinedPrompt(data);
      setResult(generated);
      // On mobile, auto-switch to output tab when done
      setActiveTab('output');
    } catch (err) {
      setError("Failed to generate prompt. Please check your API key or try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Use h-[100dvh] for mobile browsers to handle address bar resizing correctly
    <div className="flex flex-col h-screen supports-[height:100dvh]:h-[100dvh] bg-black text-gray-100 overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Header */}
      <header className="flex-none h-16 border-b border-gray-800 bg-gray-950 flex items-center px-4 md:px-6 justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight text-white leading-none">MetaPrompt</h1>
            <span className="hidden md:inline text-xs text-gray-500 font-medium"> Client Request to LLM Structure</span>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-xs font-mono text-gray-500">
           <span>Powered by Gemini 3.0 Pro</span>
           <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className="lg:hidden flex border-b border-gray-800 bg-gray-900 shrink-0">
        <button 
          onClick={() => setActiveTab('input')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'input' ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800/50' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <PenTool className="w-4 h-4" />
          Input
        </button>
        <button 
          onClick={() => setActiveTab('output')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'output' ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800/50' : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          <LayoutTemplate className="w-4 h-4" />
          Result
          {result && <span className="w-2 h-2 rounded-full bg-blue-500"></span>}
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Error Toast */}
        {error && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-900/90 border border-red-700 text-red-100 px-4 py-3 rounded-lg shadow-xl backdrop-blur-md flex items-center gap-2 animate-fade-in-down w-[90%] md:w-auto text-sm md:text-base">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="flex-1">{error}</span>
                <button onClick={() => setError(null)} className="ml-2 hover:text-white">✕</button>
            </div>
        )}

        {/* Split View Container */}
        <div className="w-full h-full lg:grid lg:grid-cols-5 bg-gray-950">
            {/* Input Column - Hidden on mobile if tab is not 'input' */}
            <div className={`lg:col-span-2 h-full overflow-hidden ${activeTab === 'input' ? 'block' : 'hidden lg:block'}`}>
                <InputSection onSubmit={handleGenerate} isLoading={isLoading} />
            </div>
            
            {/* Output Column - Hidden on mobile if tab is not 'output' */}
            <div className={`lg:col-span-3 h-full overflow-hidden border-l border-gray-800 relative ${activeTab === 'output' ? 'block' : 'hidden lg:block'}`}>
                {/* Decorative background grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(17,24,39,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(17,24,39,0.5)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-20"></div>
                
                <div className="relative h-full z-10">
                    <OutputSection result={result} isLoading={isLoading} />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;