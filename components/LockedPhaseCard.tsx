import React from 'react';
import { Lock, Loader2 } from 'lucide-react';

interface LockedPhaseCardProps {
  phaseNumber: number;
  title: string;
  description: string;
  isLoading?: boolean;
  loadingMessage?: string;
  previewContent?: React.ReactNode;
}

export const LockedPhaseCard: React.FC<LockedPhaseCardProps> = ({
  phaseNumber,
  title,
  description,
  isLoading = false,
  loadingMessage = 'AI 正在計算與規劃中...',
  previewContent
}) => {
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4 pb-12 mt-8">
        <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-200/60 backdrop-blur-md shadow-md flex flex-col items-center justify-center min-h-[220px] transition-all duration-500 animate-pulse">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <h4 className="text-lg font-bold text-blue-800 mb-2">Phase {phaseNumber}: {title}</h4>
          <p className="text-blue-600 text-sm font-medium">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-12 mt-8 opacity-60 select-none">
      <div className="bg-white/30 rounded-3xl p-8 border border-slate-200/30 backdrop-blur-xs shadow-xs flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1 flex gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center font-bold text-lg border border-slate-300/40">
              {phaseNumber}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <h3 className="text-lg font-bold text-slate-500">{title}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-400 text-[10px] font-semibold">
                  <Lock className="w-2.5 h-2.5" />
                  待解鎖
                </span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
                {description}
              </p>
            </div>
          </div>
          
          <div className="flex-shrink-0 self-start md:self-auto">
            <div className="p-3 bg-slate-100/70 border border-slate-200/60 rounded-2xl text-slate-400">
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {previewContent && (
          <div className="relative mt-2 rounded-2xl overflow-hidden border border-slate-200/35 bg-white/20 p-6 blur-[1.5px] opacity-40 select-none pointer-events-none">
            {previewContent}
          </div>
        )}
      </div>
    </div>
  );
};
