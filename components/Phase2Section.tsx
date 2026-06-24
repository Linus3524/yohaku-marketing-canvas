import React from 'react';
import { Spinner } from './Spinner';
import { ContentItem, ContentPlan, AppState, MarketingRoute } from '../types';
import { ContentSuite } from './ContentSuite';
import { FileText, Sparkles } from 'lucide-react';

interface Phase2SectionProps {
  activeRoute: MarketingRoute;
  refCopy: string;
  inputErrors: { refCopy?: string };
  appState: AppState;
  contentPlan: ContentPlan | null;
  productImageBase64?: string;
  onRefCopyChange: (value: string) => void;
  onGeneratePlan: () => void;
  onPlanUpdate: (items: ContentItem[]) => void;
  onDownloadReport: () => void;
  onImagesGenerated: (images: Map<string, string>) => void;
  onOpenDebug?: () => void;
  debugPromptAvailable?: boolean;
}

export const Phase2Section: React.FC<Phase2SectionProps> = ({
  activeRoute,
  refCopy,
  inputErrors,
  appState,
  contentPlan,
  productImageBase64,
  onRefCopyChange,
  onGeneratePlan,
  onPlanUpdate,
  onDownloadReport,
  onImagesGenerated,
  onOpenDebug,
  debugPromptAvailable,
}) => {
  return (
    <>
      {/* Phase 2 Trigger Area */}
      <div className="border-t border-slate-200 pt-12" id="phase2-section">
        <div className="bg-white/70 rounded-3xl p-8 border border-slate-200/50 backdrop-blur-md relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 p-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-2xl font-bold text-slate-800 flex-1">Phase 2: 全套內容生成</h3>
                <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold uppercase rounded">PRO</span>
                {debugPromptAvailable && (
                  <button
                    onClick={onOpenDebug}
                    className="ml-2 text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1 border border-slate-200"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    檢視提示詞
                  </button>
                )}
              </div>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                AI 將根據 <strong className="text-slate-700">"{activeRoute.route_name}"</strong> 策略，規劃一套包含 2 張主圖與 6 張社群長圖 (Stories) 的完整銷售漏斗素材。
              </p>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">參考文案 / 競品參考 (Optional)</label>
                <textarea
                  value={refCopy}
                  onChange={(e) => onRefCopyChange(e.target.value)}
                  placeholder="請貼上同類型商品的熱銷文案，或競品官網內容。AI 將拆解其「說服邏輯」與「結構」，並應用於您的產品內容規劃中..."
                  className={`w-full bg-white/60 border rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none h-32 resize-none focus:ring-1 focus:ring-blue-500 ${
                    inputErrors.refCopy ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
                  }`}
                />
                {inputErrors.refCopy && (
                  <p className="text-red-500 text-xs mt-1">{inputErrors.refCopy}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-end md:w-64 shrink-0">
              {appState === AppState.PLANNING ? (
                <div className="h-12 flex items-center justify-center gap-2 text-blue-600">
                  <Spinner className="w-5 h-5" />
                  <span className="text-sm font-bold animate-pulse">正在規劃腳本...</span>
                </div>
              ) : (
                <button
                  onClick={onGeneratePlan}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/10"
                >
                  <Sparkles className="w-4 h-4" />
                  生成 8 張圖腳本
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Phase 2 Results */}
      {(appState === AppState.SUITE_READY || contentPlan) && contentPlan && (
        <div className="mt-12">
          <ContentSuite
            plan={contentPlan}
            onPlanUpdate={onPlanUpdate}
            onDownloadReport={onDownloadReport}
            onImagesGenerated={onImagesGenerated}
            productImageBase64={productImageBase64}
          />
        </div>
      )}
    </>
  );
};
