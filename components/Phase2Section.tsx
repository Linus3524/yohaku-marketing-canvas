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
        <div className="premium-card p-6 relative overflow-hidden text-left">
          {/* 裝飾性背景光暈 */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-slate-800 flex-1">Phase 2: 全套內容生成</h3>
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-bold uppercase rounded">PRO</span>
                {debugPromptAvailable && (
                  <button
                    onClick={onOpenDebug}
                    className="ml-2 text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200 transition-colors flex items-center gap-1 border border-slate-200 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    檢視提示詞
                  </button>
                )}
              </div>
              <p className="text-slate-500 text-xs mb-6 leading-relaxed">
                AI 將根據 <strong className="text-slate-700">"{activeRoute.route_name}"</strong> 策略，規劃一套包含 2 張主圖與 6 張社群長圖 (Stories) 的完整銷售漏斗素材。
              </p>

              <div className="space-y-2">
                <label className="micro-label">參考文案 / 競品參考 (Optional)</label>
                <textarea
                  value={refCopy}
                  onChange={(e) => onRefCopyChange(e.target.value)}
                  placeholder="請貼上同類型商品的熱銷文案，或競品官網內容。AI 將拆解其「說服邏輯」與「結構」，並應用於您的產品內容規劃中..."
                  className={`modern-input h-32 resize-none ${
                    inputErrors.refCopy ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                />
                {inputErrors.refCopy && (
                  <p className="text-red-500 text-xs mt-1">{inputErrors.refCopy}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col justify-end md:w-64 shrink-0">
              {appState === AppState.PLANNING ? (
                <div className="h-12 flex items-center justify-center gap-2 text-indigo-600">
                  <Spinner className="w-5 h-5" />
                  <span className="text-sm font-bold animate-pulse">正在規劃腳本...</span>
                </div>
              ) : (
                <button
                  onClick={onGeneratePlan}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
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
