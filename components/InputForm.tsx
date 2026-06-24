import React from 'react';
import { AppState } from '../types';
import { Upload, ArrowRight, Image as ImageIcon } from 'lucide-react';

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
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* Left: Image Upload */}
    <div className="order-2 md:order-1">
      <label
        className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 relative overflow-hidden ${selectedFile ? 'border-blue-500 bg-white shadow-sm' : 'border-slate-300 bg-white/50 hover:border-blue-500 hover:bg-white shadow-sm'
          }`}
      >
        {imagePreview ? (
          <div className="w-full h-full relative group">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-4" />
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white font-medium flex items-center gap-2">
                <Upload className="w-4 h-4" />
                更換圖片
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <ImageIcon className="w-10 h-10 mb-3 text-slate-400" />
            <p className="mb-2 text-sm text-slate-600 font-medium">上傳產品圖片</p>
            <p className="text-xs text-slate-400">支援 JPG, PNG</p>
          </div>
        )}
        <input type="file" className="hidden" onChange={onFileChange} accept="image/*" />
      </label>
    </div>

    {/* Right: Text Inputs */}
    <div className="order-1 md:order-2 flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">1. 產品名稱 (Product Name)</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder="例如：Sony WH-1000XM5, Aesop 洗手乳..."
          className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none transition-colors shadow-sm focus:ring-1 focus:ring-blue-500 ${inputErrors.productName ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
            }`}
        />
        {inputErrors.productName && (
          <p className="text-red-500 text-xs mt-1">{inputErrors.productName}</p>
        )}
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">2. 品牌資訊 / 背景 (Context)</label>
        <textarea
          value={brandContext}
          onChange={(e) => onBrandContextChange(e.target.value)}
          placeholder="可輸入品牌官網網址(AI會分析網址文字) 或直接貼上品牌故事、核心價值..."
          className={`w-full bg-white border rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none transition-colors h-20 resize-none text-sm leading-relaxed shadow-sm focus:ring-1 focus:ring-blue-500 ${inputErrors.brandContext ? 'border-red-500' : 'border-slate-200 focus:border-blue-500'
            }`}
        />
        {inputErrors.brandContext && (
          <p className="text-red-500 text-xs mt-1">{inputErrors.brandContext}</p>
        )}
      </div>

      {selectedFile && appState === AppState.IDLE && (
        <button
          onClick={onAnalyze}
          className="mt-auto w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm uppercase tracking-widest rounded-xl hover:opacity-95 transition-opacity shadow-md shadow-blue-500/10 flex items-center justify-center gap-2"
        >
          <span>開始 AI 分析</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);
