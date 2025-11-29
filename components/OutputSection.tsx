import React, { useState } from 'react';
import { GeneratedPromptResult } from '../types';
import { Button } from './Button';
import { Copy, Check, Terminal, FileCode, Lightbulb, BrainCircuit } from 'lucide-react';

interface OutputSectionProps {
  result: GeneratedPromptResult | null;
  isLoading: boolean;
}

const CopyBlock: React.FC<{ content: string; label: string; icon?: React.ReactNode }> = ({ content, label, icon }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-xl border border-gray-700 bg-gray-950 overflow-hidden transition-all hover:border-gray-600">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
          {icon}
          {label}
        </div>
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          title="Copy to clipboard"
        >
          {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
          {content}
        </pre>
      </div>
    </div>
  );
};

export const OutputSection: React.FC<OutputSectionProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 bg-gray-950">
        <div className="relative">
          <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full animate-pulse"></div>
          <BrainCircuit className="w-16 h-16 text-blue-500 animate-pulse relative z-10" />
        </div>
        <div className="space-y-2 max-w-md">
          <h3 className="text-xl font-medium text-white">Analyzing Requirements...</h3>
          <p className="text-gray-400">Synthesizing the perfect persona, constraints, and instruction set for your request.</p>
        </div>
        <div className="flex gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-12 text-center bg-gray-950">
        <div className="w-20 h-20 bg-gray-900 rounded-2xl flex items-center justify-center mb-6 border border-gray-800">
          <Terminal className="w-10 h-10 text-gray-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-200 mb-2">Ready to Engineer</h3>
        <p className="text-gray-500 max-w-sm">
          Submit a client request on the left to generate a professional-grade prompt structure.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-950 overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-gray-800 bg-gray-900/30">
        <div className="flex items-center justify-between mb-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-900/30 text-blue-400 text-xs font-medium border border-blue-900/50">
            Generated Strategy
          </span>
        </div>
        <h2 className="text-2xl font-bold text-white">{result.title}</h2>
        <p className="text-gray-400 mt-2 text-sm">{result.reasoning}</p>
      </div>

      <div className="p-6 space-y-8 pb-20">
        {/* Role / Persona */}
        <div className="bg-gradient-to-r from-blue-900/10 to-purple-900/10 rounded-xl p-6 border border-blue-900/20">
            <h4 className="text-sm uppercase tracking-wider text-blue-400 font-semibold mb-2">Recommended Persona</h4>
            <p className="text-lg text-white font-medium">{result.roleDefinition}</p>
        </div>

        {/* System Instruction */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-purple-400" />
            System Instruction
          </h3>
          <p className="text-sm text-gray-500">
            Copy this into the "System Instructions" field or prepend it to your chat.
          </p>
          <CopyBlock 
            content={result.systemInstruction} 
            label="System Prompt" 
            icon={<FileCode className="w-4 h-4 text-purple-400" />}
          />
        </div>

        {/* User Prompt Template */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-green-400" />
            User Prompt Template
          </h3>
          <p className="text-sm text-gray-500">
            Use this template to format the specific task details.
          </p>
          <CopyBlock 
            content={result.userPromptTemplate} 
            label="User Message Template" 
            icon={<Terminal className="w-4 h-4 text-green-400" />}
          />
        </div>

        {/* Tips */}
        <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-yellow-400" />
            Pro Tips
          </h3>
          <ul className="space-y-3">
            {result.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center text-xs text-gray-500 border border-gray-700 mt-0.5">
                  {idx + 1}
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Icon component needed for above
const MessageSquare = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);