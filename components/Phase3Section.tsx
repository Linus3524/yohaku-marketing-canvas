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
    <div className="mt-12 border-t border-slate-200 pt-12">
      <div className="bg-white/70 rounded-3xl p-8 border border-slate-200/50 backdrop-blur-md relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-32 bg-blue-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/10">3</div>
            <h3 className="text-xl font-bold text-slate-800 flex-1">Phase 3: 產品市場分析</h3>
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
          <p className="text-slate-500 mb-6 text-sm leading-relaxed">根據第一及第二階段產生的產品相關資訊，生成完整的市場分析報告</p>
          
          {/* Region Selection */}
          <div className="mb-6 space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">目標分析區域</label>
            <div className="flex flex-wrap gap-2">
              {regions.map((r) => (
                <button
                  key={r}
                  disabled={!canEdit}
                  onClick={() => onRegionChange(r)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all border ${
                    region === r
                      ? "bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10"
                      : "bg-white/60 text-slate-600 border-slate-200/60 hover:bg-white hover:text-slate-800"
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
                  className={`bg-white border rounded-xl px-3 py-2 text-sm text-slate-800 focus:outline-none transition-all placeholder-slate-400 ${
                    isCustomRegion ? 'border-blue-500 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-350'
                  } ${!canEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>
          </div>

          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Spinner className="w-12 h-12 text-blue-600" />
              <p className="text-blue-600 font-semibold font-mono animate-pulse">正在透過 Google Search 檢索最新市場數據...</p>
            </div>
          ) : !marketAnalysis ? (
            <button
              onClick={onGenerateMarketAnalysis}
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-2 group"
            >
              <Search className="w-4 h-4 group-hover:rotate-12 transition-transform" />
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
    </div>
  );
};
