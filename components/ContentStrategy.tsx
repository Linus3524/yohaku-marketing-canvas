import React, { useState } from 'react';
import { ContentStrategy as ContentStrategyType } from '../types';
import { Download, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface ContentStrategyProps {
  strategy: ContentStrategyType;
  productName: string;
  onDownload?: () => void;
}

export const ContentStrategy: React.FC<ContentStrategyProps> = ({ strategy, productName, onDownload }) => {
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<{ index: number; type: 'aiStudio' | 'gamma' } | null>(null);

  const copyToClipboard = (text: string, index: number, type: 'aiStudio' | 'gamma') => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt({ index, type });
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  return (
    <div className="w-full text-left">
      <div className="mb-10">
        <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
          <h3 className="text-xl font-bold text-slate-800">Phase 4: 內容與 SEO 策略</h3>
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" />
              下載策略報告
            </button>
          )}
        </div>
      </div>

      {/* 內容主題 */}
      <div className="mb-8">
        <h4 className="text-lg font-bold text-slate-800 mb-4">內容主題</h4>
        <div className="space-y-4">
          {(strategy.contentTopics || []).map((topic, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-6 border border-slate-200/50 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <h5 className="text-base font-bold text-slate-800 mb-2">{topic.title}</h5>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{topic.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-1">
                    <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs text-indigo-600 font-semibold shadow-xs">
                      主要關鍵字: {topic.focusKeyword || '無'}
                    </span>
                    {(topic.longTailKeywords || []).slice(0, 3).map((keyword, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-100/80 border border-slate-200/60 rounded-lg text-xs text-slate-500 font-medium">
                        {keyword}
                      </span>
                    ))}
                    {(topic.longTailKeywords || []).length > 3 && (
                      <span className="px-2.5 py-1 bg-slate-100 border border-slate-200/60 rounded-lg text-xs text-slate-400 font-medium">
                        +{(topic.longTailKeywords || []).length - 3} 更多
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => setExpandedTopic(expandedTopic === idx ? null : idx)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200/85 rounded-xl text-sm font-semibold text-slate-700 transition-colors flex items-center gap-1.5 self-start shadow-xs"
                >
                  {expandedTopic === idx ? (
                    <>
                      <span>收起詳情</span>
                      <ChevronUp className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>展開 SEO 詳情</span>
                      <ChevronDown className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
              
              {expandedTopic === idx && (
                <div className="mt-6 pt-6 border-t border-slate-200/80">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/40">
                      <h6 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">關鍵字密度</h6>
                      <p className="text-sm text-slate-700 font-medium">{topic.seoGuidance?.keywordDensity || 'N/A'}</p>
                    </div>
                    
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/40">
                      <h6 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">語意關鍵字</h6>
                      <div className="flex flex-wrap gap-1.5">
                        {(topic.seoGuidance?.semanticKeywords || []).map((keyword, i) => (
                          <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-600 border border-purple-100 rounded text-xs font-medium">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/40">
                      <h6 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">內部連結</h6>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                        {(topic.seoGuidance?.internalLinks || []).map((link, i) => (
                          <li key={i} className="font-mono">{link}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/40">
                      <h6 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">外部連結</h6>
                      <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                        {(topic.seoGuidance?.externalLinks || []).map((link, i) => (
                          <li key={i} className="font-mono">{link}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* 提示詞區塊 */}
                  <div className="mt-6 pt-6 border-t border-slate-200 space-y-6">
                    {/* AI Studio 提示詞 */}
                    {strategy.aiStudioPrompts?.[idx] && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h6 className="text-xs font-bold text-slate-500">AI Studio 生成提示詞</h6>
                            <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-600 text-[10px] font-bold rounded-lg shadow-xs">React + Tailwind CSS</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(strategy.aiStudioPrompts[idx], idx, 'aiStudio')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 shadow-xs ${
                              copiedPrompt?.index === idx && copiedPrompt?.type === 'aiStudio' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200 border-slate-200'
                            }`}
                          >
                            {copiedPrompt?.index === idx && copiedPrompt?.type === 'aiStudio' ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>已複製！</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>複製提示詞</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-inner">
                          <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                            {strategy.aiStudioPrompts[idx]}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Gamma.app 提示詞 */}
                    {strategy.gammaPrompts?.[idx] && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <h6 className="text-xs font-bold text-slate-500">Gamma.app 生成提示詞</h6>
                            <span className="px-2 py-0.5 bg-pink-50 border border-pink-200 text-pink-600 text-[10px] font-bold rounded-lg shadow-xs">簡報/網頁</span>
                          </div>
                          <button
                            onClick={() => copyToClipboard(strategy.gammaPrompts[idx], idx, 'gamma')}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 shadow-xs ${
                              copiedPrompt?.index === idx && copiedPrompt?.type === 'gamma' 
                                ? 'bg-green-50 text-green-700 border-green-200' 
                                : 'bg-slate-100 text-slate-600 hover:text-slate-800 hover:bg-slate-200 border-slate-200'
                            }`}
                          >
                            {copiedPrompt?.index === idx && copiedPrompt?.type === 'gamma' ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>已複製！</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>複製提示詞</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-inner">
                          <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono leading-relaxed">
                            {strategy.gammaPrompts[idx]}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 互動元素建議 */}
      <div className="mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-200/50 shadow-sm">
        <h4 className="text-lg font-bold text-slate-800 mb-4">互動元素建議</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(strategy.interactiveElements || []).map((element, idx) => (
            <div key={idx} className="bg-white rounded-xl p-4 border border-slate-200/80">
              <h5 className="text-sm font-bold text-slate-800 mb-2">{element.type}</h5>
              <p className="text-xs text-slate-600 leading-relaxed">{element.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA 建議 */}
      <div className="mb-8 bg-slate-50 rounded-2xl p-6 border border-slate-200/50 shadow-sm">
        <h4 className="text-lg font-bold text-slate-800 mb-4">行動呼籲文案建議</h4>
        <div className="flex flex-wrap gap-3">
          {(strategy.ctaSuggestions || []).map((cta, idx) => (
            <div key={idx} className="px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200/65 rounded-xl font-medium text-sm shadow-xs">
              {cta}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

