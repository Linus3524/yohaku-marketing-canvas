import React from 'react';
import { ProductAnalysis } from '../types';

interface ProductCardProps {
  analysis: ProductAnalysis;
  imageSrc: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ analysis, imageSrc }) => {
  return (
    <div className="bg-slate-50 border border-slate-200/50 rounded-2xl p-6 mb-4 flex flex-col md:flex-row gap-6">
      <div className="w-full md:w-1/3 shrink-0">
        <div className="aspect-square rounded-xl overflow-hidden bg-white border border-slate-200/40 relative group">
          <img src={imageSrc} alt={analysis.name} className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-xs text-white/95 font-medium">原始圖片</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center w-full">
        <div className="uppercase tracking-widest text-[10px] text-indigo-600 font-bold mb-1">分析報告 / Report</div>
        <h2 className="text-xl font-bold text-slate-800 mb-1">{analysis.name}</h2>
        <p className="text-slate-500 text-xs mb-4 italic">{analysis.visual_description}</p>
        
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider border-b border-slate-200/60 pb-1 inline-block">核心賣點 / Selling Points</h3>
          <p className="text-slate-600 leading-relaxed text-xs mt-1">{analysis.key_features_zh}</p>
        </div>
      </div>
    </div>
  );
};