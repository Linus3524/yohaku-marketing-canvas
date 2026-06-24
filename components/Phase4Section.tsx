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
    <div className="mt-12 border-t border-slate-200 pt-12">
      <div className="bg-white/70 rounded-3xl p-8 border border-slate-200/50 backdrop-blur-md relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/10">4</div>
            <h3 className="text-xl font-bold text-slate-800 flex-1">Phase 4: 內容與 SEO 策略</h3>
            {debugPromptAvailable && (
              <button
                onClick={onOpenDebug}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1 border border-slate-200"
              >
                <FileText className="w-3.5 h-3.5" />
                檢視提示詞
              </button>
            )}
          </div>
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">基於第三階段的分析結果，生成專業的內容策略與 SEO 優化方案</p>

          {appState === AppState.ANALYZING_CONTENT ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Spinner className="w-12 h-12 text-blue-600" />
              <p className="text-blue-600 font-semibold animate-pulse">正在生成內容策略...</p>
            </div>
          ) : !contentStrategy ? (
            <button
              onClick={onGenerateContentStrategy}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2"
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
    </div>
  );
};
