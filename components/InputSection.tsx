import React, { useState } from 'react';
import { PromptGoal, ComplexityLevel, ClientInputData } from '../types';
import { Button } from './Button';
import { Sparkles, ArrowRight, MessageSquare, Settings2 } from 'lucide-react';

interface InputSectionProps {
  onSubmit: (data: ClientInputData) => void;
  isLoading: boolean;
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isLoading }) => {
  const [rawMessage, setRawMessage] = useState('');
  const [goal, setGoal] = useState<PromptGoal>(PromptGoal.CODING);
  const [complexity, setComplexity] = useState<ComplexityLevel>(ComplexityLevel.INTERMEDIATE);
  const [additionalContext, setAdditionalContext] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawMessage.trim()) return;
    onSubmit({ rawMessage, goal, complexity, additionalContext });
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border-r border-gray-800">
      <div className="p-6 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          Client Request
        </h2>
        <p className="text-gray-400 text-xs mt-1">Paste the message you received from your client below.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Main Input */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Raw Client Message <span className="text-red-400">*</span>
          </label>
          <textarea
            value={rawMessage}
            onChange={(e) => setRawMessage(e.target.value)}
            placeholder="e.g., 'I need a landing page for my coffee shop. It needs to look modern, use earth tones, and have a contact form. Also needs a menu section.'"
            className="w-full h-48 bg-gray-950 border border-gray-700 rounded-xl p-4 text-gray-200 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm leading-relaxed transition-all"
            required
          />
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 flex items-center gap-2">
              <Settings2 className="w-4 h-4" /> Goal / Domain
            </label>
            <div className="relative">
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as PromptGoal)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {Object.values(PromptGoal).map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Complexity Level</label>
            <div className="relative">
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as ComplexityLevel)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {Object.values(ComplexityLevel).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Optional Context */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Hidden Context <span className="text-gray-500 text-xs">(Optional)</span>
          </label>
          <textarea
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            placeholder="e.g., Client is very picky about typography. The tech stack must be Next.js."
            className="w-full h-24 bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-gray-300 placeholder-gray-600 focus:ring-2 focus:ring-blue-500 resize-none text-sm"
          />
        </div>
      </div>

      <div className="p-6 border-t border-gray-800 bg-gray-900/50">
        <Button 
          onClick={handleSubmit} 
          isLoading={isLoading} 
          className="w-full py-3 text-base shadow-xl shadow-blue-500/10"
          disabled={!rawMessage.trim()}
          icon={<Sparkles className="w-5 h-5" />}
        >
          Generate Engineering Prompt
        </Button>
      </div>
    </div>
  );
};