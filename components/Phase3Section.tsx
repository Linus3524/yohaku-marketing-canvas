import React from 'react';
import { Spinner } from './Spinner';
import { AppState, MarketAnalysis } from '../types';
import { MarketAnalysis as MarketAnalysisComponent } from './MarketAnalysis';
import { FileText, Search } from 'lucide-react';

interface Phase3SectionProps {
  appState: AppState;
  marketAnalysis: MarketAnalysis | null;
  productName: string;
  region: string;
  onRegionChange: (region: string) => void;
  onGenerateMarketAnalysis: () => void;
  onDownloadPhase3Report: () => void;
  onOpenDebug?: () => void;
  debugPromptAvailable?: boolean;
}

export const Phase3Section: React.FC<Phase3SectionProps> = ({
  appState,
  marketAnalysis,
  productName,
  region,
  onRegionChange,
  onGenerateMarketAnalysis,
  onDownloadPhase3Report,
  onOpenDebug,
  debugPromptAvailable,
}) => {
  const regions = ["台灣", "亞洲", "北美", "全球"];
  const isCustomRegion = !regions.includes(region) && region !== "";
  const isAnalyzing = appState === AppState.ANALYZING_MARKET;
  const canEdit = !marketAnalysis && !isAnalyzing;

  return (
    <div className="premium-card p-6 relative overflow-hidden text-left w-full">
      {/* 裝飾性背景光暈 */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none"></div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              Phase 3: 本地市場分析與定位
              {marketAnalysis && (
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] rounded font-medium">已解鎖</span>
              )}
            </h2>
            <p className="text-xs text-slate-500 mt-1">根據產品資訊，進行市場競品、文化洞察及目標客群 (Persona) 定位。</p>
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

        {/* Region Selection */}
        <div className="mb-6 space-y-3">
          <label className="micro-label">目標分析區域</label>
          <div className="flex flex-wrap gap-2">
            {regions.map((r) => (
              <button
                key={r}
                disabled={!canEdit}
                onClick={() => onRegionChange(r)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border cursor-pointer ${
                  region === r
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {r}
              </button>
            ))}
            <div className="flex items-center gap-2">
              <input
                type="text"
                disabled={!canEdit}
                placeholder="其他區域..."
                value={isCustomRegion ? region : ""}
                onChange={(e) => onRegionChange(e.target.value)}
                className={`modern-input py-2 px-3 text-xs w-32 ${
                  isCustomRegion ? 'border-indigo-500 focus:border-indigo-500' : ''
                } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
          </div>
        </div>

        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Spinner className="w-12 h-12 text-indigo-600" />
            <p className="text-indigo-600 font-semibold text-xs animate-pulse">正在透過 Google Search 檢索最新市場數據...</p>
          </div>
        ) : !marketAnalysis ? (
          <button
            onClick={onGenerateMarketAnalysis}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            執行市場分析 (含 Google Search)
          </button>
        ) : (
          <div className="mt-6">
            <MarketAnalysisComponent
              analysis={marketAnalysis}
              productName={productName}
              onDownload={onDownloadPhase3Report}
            />
          </div>
        )}
      </div>
    </div>
  );
};
