import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Phase5SectionProps {
  productName: string;
}

export const Phase5Section: React.FC<Phase5SectionProps> = ({ productName }) => {
  return (
    <div className="premium-card p-6 relative overflow-hidden text-left w-full">
      <div className="absolute top-0 right-0 p-32 bg-orange-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Phase 5: Ultra 版本限定</h3>
            <p className="text-xs text-slate-500 mt-1">
              {productName ? `「${productName}」的進階 Landing Page 配圖與 HTML 代碼匯出功能已移轉至 Ultra 版本。` : '進階 Landing Page 配圖與 HTML 代碼匯出功能已移轉至 Ultra 版本。'}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl border border-slate-200/60 p-6">
          <p className="text-slate-600 leading-relaxed mb-4 text-xs">一鍵配圖與部署已遷移至 Ultra 商業版本，請點選下方按鈕前往體驗。</p>
          <a
            href="https://ultra.icareu.tw/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs rounded-xl shadow-[0_4px_14px_0_rgba(234,88,12,0.39)] hover:shadow-[0_6px_20px_rgba(234,88,12,0.23)] hover:-translate-y-0.5 transition-all duration-200"
          >
            <span>請至 Ultra 版本體驗使用</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
