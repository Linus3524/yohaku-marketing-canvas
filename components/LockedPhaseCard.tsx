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
      <div className="premium-card p-6 border-indigo-200/60 bg-indigo-50/10 flex flex-col items-center justify-center min-h-[180px] transition-all duration-500 animate-pulse text-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-3" />
        <h4 className="text-base font-bold text-indigo-800 mb-1">Phase {phaseNumber}: {title}</h4>
        <p className="text-indigo-600 text-xs font-medium">{loadingMessage}</p>
      </div>
    );
  }

  return (
    <div className="premium-card p-6 flex flex-col gap-6 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              {title}
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-500 text-[10px] font-semibold border border-slate-200/50">
                <Lock className="w-2.5 h-2.5" />
                等待中
              </span>
            </h2>
          </div>
          <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-3xl">
            {description}
          </p>
        </div>

        <div className="flex-shrink-0 self-start md:self-auto">
          <div className="p-2 bg-slate-100/70 border border-slate-200/60 rounded-xl text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
        </div>
      </div>

      {previewContent && (
        <div className="relative mt-2 rounded-2xl overflow-hidden border border-slate-200/35 bg-white/40 p-6 opacity-100 pointer-events-none">
          {previewContent}
        </div>
      )}
    </div>
  );
};
