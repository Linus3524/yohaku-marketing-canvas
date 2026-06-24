import React, { useState } from 'react';
import { X, Copy, Check, Terminal } from 'lucide-react';

interface DebugPromptModalProps {
  isOpen: boolean;
  promptContent: string | null;
  onClose: () => void;
  phaseName: string;
}

export const DebugPromptModal: React.FC<DebugPromptModalProps> = ({ isOpen, promptContent, onClose, phaseName }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !promptContent) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
      onClick={onClose}
    >
      <div 
        className="bg-white/80 border border-slate-200/50 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl backdrop-blur-xl relative animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200/60">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-600" />
            {phaseName} 生成提示詞 Debug
          </h3>
          <div className="flex items-center gap-2">
            <button
               onClick={handleCopy}
               className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${copied ? 'bg-green-50 text-green-600 border border-green-200 shadow-sm' : 'bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200 border border-slate-200 shadow-sm'}`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  已複製！
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  複製內容
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 overflow-y-auto bg-slate-50 m-4 rounded-xl border border-slate-200 font-mono text-xs leading-relaxed text-slate-800 shadow-inner whitespace-pre-wrap">
          {promptContent}
        </div>
      </div>
    </div>
  );
};
