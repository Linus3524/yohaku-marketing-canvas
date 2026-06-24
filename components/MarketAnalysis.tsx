import React from 'react';
import { MarketAnalysis as MarketAnalysisType } from '../types';
import { Download } from 'lucide-react';

interface MarketAnalysisProps {
  analysis: MarketAnalysisType;
  productName: string;
  onDownload?: () => void;
}

export const MarketAnalysis: React.FC<MarketAnalysisProps> = ({ analysis, productName, onDownload }) => {
  return (
    <div className="w-full text-left">
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <h3 className="text-xl font-bold text-slate-800">Phase 3: 產品市場分析</h3>
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              下載分析報告
            </button>
          )}
        </div>
      </div>

      {/* 產品核心價值 */}
      <div className="mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-200/50 shadow-sm">
        <h4 className="text-lg font-bold text-slate-800 mb-4">產品核心價值</h4>
        
        <div className="mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-200/30">
          <h5 className="text-sm font-bold text-slate-500 mb-2">主要特色</h5>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-sm leading-relaxed">
            {analysis.productCoreValue.mainFeatures.map((feature, idx) => (
              <li key={idx}>{feature}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6 bg-slate-50/50 p-4 rounded-xl border border-slate-200/30">
          <h5 className="text-sm font-bold text-slate-500 mb-2">核心優勢</h5>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-sm leading-relaxed">
            {analysis.productCoreValue.coreAdvantages.map((advantage, idx) => (
              <li key={idx}>{advantage}</li>
            ))}
          </ul>
        </div>
        
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/30">
          <h5 className="text-sm font-bold text-slate-500 mb-2">解決的痛點</h5>
          <ul className="list-disc list-inside space-y-1.5 text-slate-600 text-sm leading-relaxed">
            {analysis.productCoreValue.painPointsSolved.map((painPoint, idx) => (
              <li key={idx}>{painPoint}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* 目標市場定位 */}
      <div className="mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-200/50 shadow-sm">
        <h4 className="text-lg font-bold text-slate-800 mb-4">目標市場定位</h4>
        
        <div className="space-y-6">
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/30">
            <h5 className="text-sm font-bold text-slate-500 mb-2">文化洞察</h5>
            <p className="text-slate-600 text-sm leading-relaxed">{analysis.marketPositioning.culturalInsights}</p>
          </div>
          
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/30">
            <h5 className="text-sm font-bold text-slate-500 mb-2">消費習慣</h5>
            <p className="text-slate-600 text-sm leading-relaxed">{analysis.marketPositioning.consumerHabits}</p>
          </div>
          
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/30">
            <h5 className="text-sm font-bold text-slate-500 mb-2">語言特性</h5>
            <p className="text-slate-600 text-sm leading-relaxed">{analysis.marketPositioning.languageNuances}</p>
          </div>
          
          <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/30">
            <h5 className="text-sm font-bold text-slate-500 mb-3">搜尋趨勢</h5>
            <div className="flex flex-wrap gap-2">
              {analysis.marketPositioning.searchTrends.map((trend, idx) => (
                <span key={idx} className="px-3.5 py-1 bg-slate-100 border border-slate-200/60 rounded-full text-xs text-slate-600 font-semibold shadow-xs">
                  {trend}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 競爭對手分析 */}
      <div className="mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-200/50 shadow-sm">
        <h4 className="text-lg font-bold text-slate-800 mb-4">競爭對手分析</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.competitors.map((competitor, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
              <h5 className="text-base font-bold text-slate-800 mb-2">{competitor.brandName}</h5>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">{competitor.marketingStrategy}</p>
              
              <div className="mb-4">
                <h6 className="text-xs font-bold text-green-700 mb-1.5">優勢</h6>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 leading-relaxed">
                  {competitor.advantages.map((adv, i) => (
                    <li key={i}>{adv}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h6 className="text-xs font-bold text-red-700 mb-1.5">劣勢</h6>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 leading-relaxed">
                  {competitor.weaknesses.map((weak, i) => (
                    <li key={i}>{weak}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 潛在客戶描繪 */}
      <div className="mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-200/50 shadow-sm">
        <h4 className="text-lg font-bold text-slate-800 mb-4">潛在客戶描繪</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.buyerPersonas.map((persona, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/60">
              <h5 className="text-base font-bold text-slate-800 mb-2">{persona.name}</h5>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">{persona.demographics}</p>
              
              <div className="mb-4">
                <h6 className="text-xs font-bold text-slate-400 mb-1.5">興趣</h6>
                <div className="flex flex-wrap gap-1">
                  {persona.interests.map((interest, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-slate-100 border border-slate-200/60 rounded-md text-[10px] font-semibold text-slate-600">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h6 className="text-xs font-bold text-slate-400 mb-1.5">痛點</h6>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 leading-relaxed">
                  {persona.painPoints.map((pain, i) => (
                    <li key={i}>{pain}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h6 className="text-xs font-bold text-slate-400 mb-1.5">搜尋關鍵字</h6>
                <div className="flex flex-wrap gap-1">
                  {persona.searchKeywords.map((keyword, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 rounded-md text-[10px] font-semibold text-indigo-600">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

