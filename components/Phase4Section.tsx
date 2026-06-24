import React from 'react';
import { Spinner } from './Spinner';
import { AppState, ContentStrategy } from '../types';
import { ContentStrategy as ContentStrategyComponent } from './ContentStrategy';
import { FileText, Sparkles } from 'lucide-react';

interface Phase4SectionProps {
  appState: AppState;
  contentStrategy: ContentStrategy | null;
  productName: string;
  onGenerateContentStrategy: () => void;
  onDownloadPhase4Report: () => void;
  onOpenDebug?: () => void;
  debugPromptAvailable?: boolean;
}

export const Phase4Section: React.FC<Phase4SectionProps> = ({
  appState,
  contentStrategy,
  productName,
  onGenerateContentStrategy,
  onDownloadPhase4Report,
  onOpenDebug,
  debugPromptAvailable,
}) => {
  return (
    <div className="premium-card p-6 relative overflow-hidden text-left w-full">
      {/* 裝飾性背景光暈 */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Phase 4: 內容行銷與 SEO 優化
              {contentStrategy && (
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] rounded font-medium">已解鎖</span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-1">基於第三階段的分析結果，生成專業的內容策略與 SEO 優化方案。</p>
          </div>
          <div className="flex gap-2 self-start md:self-auto">
            {debugPromptAvailable && (
              <button
                onClick={onOpenDebug}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1 border border-slate-200 cursor-pointer font-medium"
              >
                <FileText className="w-3.5 h-3.5" />
                檢視提示詞
              </button>
            )}
          </div>
        </div>

        {appState === AppState.ANALYZING_CONTENT ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Spinner className="w-12 h-12 text-indigo-600" />
            <p className="text-indigo-600 font-semibold text-xs animate-pulse">正在生成內容策略...</p>
          </div>
        ) : !contentStrategy ? (
          <button
            onClick={onGenerateContentStrategy}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            開始生成內容策略
          </button>
        ) : (
          <div className="mt-6">
            <ContentStrategyComponent
              strategy={contentStrategy}
              productName={productName}
              onDownload={onDownloadPhase4Report}
            />
          </div>
        )}
      </div>
    </div>
  );
};
