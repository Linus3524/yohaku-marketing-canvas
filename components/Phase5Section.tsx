import React, { useState } from 'react';
import { Code, Download, Play, Copy, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { MarketingRoute, ContentPlan, MarketAnalysis, ContentStrategy } from '../types';
import { generateLandingPage } from '../services/geminiService';

interface Phase5SectionProps {
  productName: string;
  brandContext: string;
  selectedRoute: MarketingRoute | null;
  contentPlan: ContentPlan | null;
  marketAnalysis: MarketAnalysis | null;
  contentStrategy: ContentStrategy | null;
  phase2GeneratedImages: Map<string, string>;
}

export const Phase5Section: React.FC<Phase5SectionProps> = ({
  productName,
  brandContext,
  selectedRoute,
  contentPlan,
  marketAnalysis,
  contentStrategy,
  phase2GeneratedImages,
}) => {
  const [htmlCode, setHtmlCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState<boolean>(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedHtml = await generateLandingPage(
        productName,
        brandContext,
        selectedRoute,
        contentPlan,
        marketAnalysis,
        contentStrategy,
        phase2GeneratedImages
      );

      // Replace image source URLs dynamically
      let finalHtml = generatedHtml;
      if (phase2GeneratedImages && phase2GeneratedImages.size > 0) {
        phase2GeneratedImages.forEach((imgBase64, id) => {
          // Replace IMAGE_ITEM_1 or IMAGE_ITEM_item-1
          finalHtml = finalHtml.replaceAll(`IMAGE_ITEM_${id}`, imgBase64);
          // Replace src="1" or src="item-1" with the base64
          finalHtml = finalHtml.replaceAll(`src="${id}"`, `src="${imgBase64}"`);
          finalHtml = finalHtml.replaceAll(`src='${id}'`, `src='${imgBase64}'`);
        });
      }

      setHtmlCode(finalHtml);
    } catch (err: any) {
      console.error(err);
      setError(err?.userMessage || err?.message || '生成 Landing Page 失敗');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${productName || 'landing-page'}.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="premium-card p-6 relative overflow-hidden text-left w-full">
      <div className="absolute top-0 right-0 p-32 bg-indigo-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Phase 5: 電商 Landing Page 生成</h3>
            <p className="text-xs text-slate-500 mt-1">
              {productName ? `基於「${productName}」的行銷文案、策略與生成圖片，一鍵生成高轉化的 RWD Landing Page 代碼。` : '一鍵生成專屬 Landing Page 網頁程式碼。'}
            </p>
          </div>

          {!htmlCode && !isLoading && (
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all duration-200 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>一鍵生成 Landing Page</span>
            </button>
          )}

          {htmlCode && !isLoading && (
            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>重新生成</span>
            </button>
          )}
        </div>

        {isLoading && (
          <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-12 flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
            <div className="text-center">
              <p className="text-slate-700 font-medium text-sm">正在撰寫 Landing Page HTML & CSS...</p>
              <p className="text-slate-400 text-xs mt-1">這需要幾十秒的時間，正在分析您的文案與嵌入生成的產品圖</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex gap-3 text-red-700 text-xs mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">生成出錯</p>
              <p className="mt-1">{error}</p>
              <button
                onClick={handleGenerate}
                className="mt-3 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition cursor-pointer"
              >
                重試一次
              </button>
            </div>
          </div>
        )}

        {htmlCode && !isLoading && (
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      : 'text-slate-500 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Play className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                  實時預覽
                </button>
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-4 py-2 text-xs font-bold rounded-lg transition cursor-pointer ${
                    activeTab === 'code'
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                      : 'text-slate-500 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Code className="w-3 h-3 inline mr-1.5 -mt-0.5" />
                  HTML 原始碼
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '已複製' : '複製代碼'}</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下載 HTML</span>
                </button>
              </div>
            </div>

            {/* Tab content */}
            {activeTab === 'preview' ? (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-inner">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  <span className="text-[10px] text-slate-400 ml-2 font-mono">localhost/preview.html</span>
                </div>
                <iframe
                  title="Landing Page Preview"
                  srcDoc={htmlCode}
                  className="w-full h-[600px] border-none bg-white"
                  sandbox="allow-scripts"
                />
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-900 p-4">
                <textarea
                  readOnly
                  value={htmlCode}
                  className="w-full h-[550px] bg-transparent text-slate-100 font-mono text-xs focus:outline-none resize-none leading-relaxed"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
