import React from 'react';
import { ExternalLink } from 'lucide-react';

interface Phase5SectionProps {
  productName: string;
}

export const Phase5Section: React.FC<Phase5SectionProps> = ({ productName }) => {
  return (
    <div className="mt-12 border-t border-slate-200 pt-12">
      <div className="bg-white/70 rounded-3xl p-8 border border-slate-200/50 backdrop-blur-md relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 p-32 bg-orange-600/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-orange-500/10">5</div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Phase 5: Ultra 版本限定</h3>
              <p className="text-slate-500 text-sm mt-1">
                {productName ? `「${productName}」的進階 Landing Page 配圖功能已移轉至 Ultra 版本。` : '進階 Landing Page 配圖功能已移轉至 Ultra 版本。'}
              </p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200/60 p-6">
            <p className="text-slate-600 leading-relaxed mb-5 text-sm">請至 Ultra 版本體驗使用。</p>
            <a
              href="https://ultra.icareu.tw/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl transition-all shadow-md shadow-orange-500/15"
            >
              <span>請至 Ultra 版本體驗使用</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
