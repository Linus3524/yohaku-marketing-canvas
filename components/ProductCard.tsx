import React from 'react';
import { ProductAnalysis } from '../types';

interface ProductCardProps {
  analysis: ProductAnalysis;
  imageSrc: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ analysis, imageSrc }) => {
  return (
    <div className="bg-white/70 border border-slate-200/50 backdrop-blur-md rounded-2xl p-6 mb-8 flex flex-col md:flex-row gap-6 shadow-sm">
      <div className="w-full md:w-1/3 shrink-0">
        <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 relative group">
          <img src={imageSrc} alt={analysis.name} className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
            <span className="text-xs text-white/95 font-medium">原始圖片</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center w-full">
        <div className="uppercase tracking-widest text-xs text-blue-600 font-bold mb-2">分析報告</div>
        <h2 className="text-3xl font-bold text-slate-800 mb-1">{analysis.name}</h2>
        <p className="text-slate-500 text-sm mb-4 italic">{analysis.visual_description}</p>
        
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider border-b border-slate-200/60 pb-1 inline-block">核心賣點</h3>
          <p className="text-slate-600 leading-relaxed text-sm">{analysis.key_features_zh}</p>
        </div>
      </div>
    </div>
  );
};