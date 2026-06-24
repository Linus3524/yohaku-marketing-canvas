import React from 'react';
import { AppState } from '../types';
import { Upload, ArrowRight } from 'lucide-react';

interface InputFormProps {
  productName: string;
  brandContext: string;
  selectedFile: File | null;
  imagePreview: string | null;
  inputErrors: { productName?: string; brandContext?: string };
  appState: AppState;
  onProductNameChange: (value: string) => void;
  onBrandContextChange: (value: string) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAnalyze: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({
  productName,
  brandContext,
  selectedFile,
  imagePreview,
  inputErrors,
  appState,
  onProductNameChange,
  onBrandContextChange,
  onFileChange,
  onAnalyze,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10 w-full text-left">
    {/* Left: Image Upload (col-span-2) */}
    <div className="col-span-1 md:col-span-2 flex flex-col">
      <label className="micro-label">商品主視覺圖片</label>
      <label className="block w-full">
        {imagePreview ? (
          <div className="upload-zone h-48 flex items-center justify-center relative overflow-hidden group">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-4" />
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-sm font-medium flex items-center gap-2">
                <Upload className="w-4 h-4" />
                更換圖片
              </span>
            </div>
          </div>
        ) : (
          <div className="upload-zone h-48 flex flex-col items-center justify-center text-slate-400 group">
            <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="text-indigo-500">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">拖曳或點擊上傳圖片</span>
            <span className="text-[11px] mt-1 opacity-70">支援 JPG, PNG, WEBP (最大 5MB)</span>
          </div>
        )}
        <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
      </label>
    </div>

    {/* Right: Text Inputs (col-span-3) */}
    <div className="col-span-1 md:col-span-3 flex flex-col gap-5 justify-between">
      <div>
        <label className="micro-label">1. 產品名稱 (Product Name)</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder="例如：Sony WH-1000XM5 無線降噪耳機"
          className={`modern-input ${inputErrors.productName ? 'border-red-500 focus:border-red-500' : ''}`}
        />
        {inputErrors.productName && (
          <p className="text-red-500 text-xs mt-1">{inputErrors.productName}</p>
        )}
      </div>
      
      <div className="flex-1 flex flex-col">
        <label className="micro-label">2. 核心特點 / 描述 (Context)</label>
        <textarea
          value={brandContext}
          onChange={(e) => onBrandContextChange(e.target.value)}
          placeholder="描述產品的核心賣點、目標受眾或設計理念。AI 將以此為基礎生成所有文案..."
          className={`modern-input h-24 resize-none flex-1 ${inputErrors.brandContext ? 'border-red-500 focus:border-red-500' : ''}`}
        />
        {inputErrors.brandContext && (
          <p className="text-red-500 text-xs mt-1">{inputErrors.brandContext}</p>
        )}
      </div>

      {selectedFile && appState === AppState.IDLE && (
        <button
          onClick={onAnalyze}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-[0_4px_14px_0_rgba(79,70,229,0.39)] hover:shadow-[0_6px_20px_rgba(79,70,229,0.23)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>開始 AI 分析</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);
